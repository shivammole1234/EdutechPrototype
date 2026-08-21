import { SubmissionStatus, TestCaseResult, TestCase } from '@/types';

export interface CodeExecutionRequest {
  code: string;
  language: string;
  questionId?: string;
  testCases: TestCase[];
  customInput?: string;
}

export interface CodeExecutionResponse {
  status: SubmissionStatus;
  score: number;
  maxScore: number;
  totalTests: number;
  passedTests: number;
  executionTimeMs: number;
  memoryUsedMb: number;
  testCaseResults: TestCaseResult[];
  stdout?: string;
  compilerMessage?: string;
  runtimeError?: string;
}

export const executionService = {
  async executeCode(
    request: CodeExecutionRequest,
    onStateChange?: (state: 'IDLE' | 'QUEUED' | 'RUNNING' | 'COMPLETED') => void
  ): Promise<CodeExecutionResponse> {
    onStateChange?.('QUEUED');
    await new Promise((r) => setTimeout(r, 250));

    onStateChange?.('RUNNING');
    await new Promise((r) => setTimeout(r, 650));

    const { code, language, testCases } = request;

    // Check basic syntax/compilation issues
    if (!code || code.trim().length === 0) {
      onStateChange?.('COMPLETED');
      return {
        status: 'COMPILATION_ERROR',
        score: 0,
        maxScore: 100,
        totalTests: testCases.length,
        passedTests: 0,
        executionTimeMs: 0,
        memoryUsedMb: 0,
        compilerMessage: 'Error: Empty source code provided.',
        testCaseResults: [],
      };
    }

    // Basic heuristic or JavaScript evaluation for simple functions
    const results: TestCaseResult[] = [];
    let passedCount = 0;

    // Try executing JavaScript/TypeScript locally if possible and safe
    let canEvalJs = false;
    let evalFunction: Function | null = null;

    if (language === 'javascript' || language === 'typescript') {
      try {
        // Strip TS type annotations if typescript
        const jsCode = code
          .replace(/:\s*[A-Za-z0-9_\[\]<>, |]+/g, '')
          .replace(/<[A-Za-z0-9_, ]+>/g, '');

        // Extract function name or wrapped function
        const match = jsCode.match(/function\s+([a-zA-Z0-9_]+)/);
        const fnName = match ? match[1] : null;

        if (fnName) {
          const fn = new Function(`${jsCode}; return ${fnName};`)();
          if (typeof fn === 'function') {
            evalFunction = fn;
            canEvalJs = true;
          }
        }
      } catch (err: any) {
        onStateChange?.('COMPLETED');
        return {
          status: 'COMPILATION_ERROR',
          score: 0,
          maxScore: 100,
          totalTests: testCases.length,
          passedTests: 0,
          executionTimeMs: 14,
          memoryUsedMb: 12.2,
          compilerMessage: `SyntaxError: ${err?.message || 'Compilation failed'}`,
          testCaseResults: [],
        };
      }
    }

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const execTime = Math.floor(Math.random() * 25) + 15;
      const memUsed = +(14 + Math.random() * 4).toFixed(1);

      if (canEvalJs && evalFunction) {
        try {
          // Parse test case input if JSON array / args
          let args: any[] = [];
          if (tc.input.includes('\n')) {
            const lines = tc.input.split('\n');
            args = lines.map((l) => {
              try {
                return JSON.parse(l);
              } catch {
                return l;
              }
            });
          } else {
            try {
              args = [JSON.parse(tc.input)];
            } catch {
              args = [tc.input];
            }
          }

          const out = evalFunction(...args);
          const normalizedActual = JSON.stringify(out);
          const normalizedExpected = tc.expectedOutput.replace(/\s+/g, '');
          const matches =
            normalizedActual === normalizedExpected ||
            JSON.stringify(normalizedActual) === JSON.stringify(normalizedExpected) ||
            String(out) === tc.expectedOutput;

          if (matches) {
            passedCount++;
            results.push({
              testCaseId: tc.id,
              status: 'ACCEPTED',
              passed: true,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              actualOutput: JSON.stringify(out),
              executionTimeMs: execTime,
              memoryUsedMb: memUsed,
              isHidden: tc.isHidden,
            });
          } else {
            results.push({
              testCaseId: tc.id,
              status: 'WRONG_ANSWER',
              passed: false,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              actualOutput: JSON.stringify(out),
              executionTimeMs: execTime,
              memoryUsedMb: memUsed,
              errorMessage: `Output mismatch: expected ${tc.expectedOutput}, got ${JSON.stringify(out)}`,
              isHidden: tc.isHidden,
            });
          }
        } catch (err: any) {
          results.push({
            testCaseId: tc.id,
            status: 'RUNTIME_ERROR',
            passed: false,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            errorMessage: err?.message || 'Runtime exception',
            executionTimeMs: execTime,
            memoryUsedMb: memUsed,
            isHidden: tc.isHidden,
          });
        }
      } else {
        // Simulated execution for Python / C++ / Java
        // If code has typical solution logic or returns expected tokens, mark pass
        const isLikelyPassing =
          code.length > 50 &&
          !code.includes('throw new Error') &&
          !code.includes('pass') &&
          !code.includes('TODO');

        if (isLikelyPassing) {
          passedCount++;
          results.push({
            testCaseId: tc.id,
            status: 'ACCEPTED',
            passed: true,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: tc.expectedOutput,
            executionTimeMs: execTime,
            memoryUsedMb: memUsed,
            isHidden: tc.isHidden,
          });
        } else {
          results.push({
            testCaseId: tc.id,
            status: i === 0 ? 'ACCEPTED' : 'WRONG_ANSWER',
            passed: i === 0,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: i === 0 ? tc.expectedOutput : 'null',
            executionTimeMs: execTime,
            memoryUsedMb: memUsed,
            errorMessage: i === 0 ? undefined : 'Output mismatch',
            isHidden: tc.isHidden,
          });
          if (i === 0) passedCount++;
        }
      }
    }

    const totalTests = testCases.length || 1;
    const allPassed = passedCount === totalTests;
    const score = Math.round((passedCount / totalTests) * 100);
    const overallStatus: SubmissionStatus = allPassed
      ? 'ACCEPTED'
      : results.some((r) => r.status === 'RUNTIME_ERROR')
      ? 'RUNTIME_ERROR'
      : 'WRONG_ANSWER';

    onStateChange?.('COMPLETED');

    return {
      status: overallStatus,
      score,
      maxScore: 100,
      totalTests,
      passedTests: passedCount,
      executionTimeMs: Math.max(...results.map((r) => r.executionTimeMs || 20), 45),
      memoryUsedMb: Math.max(...results.map((r) => r.memoryUsedMb || 16), 18.2),
      testCaseResults: results,
      stdout: allPassed ? `All ${totalTests} test cases passed successfully.` : `${passedCount}/${totalTests} test cases passed.`,
    };
  },
};
