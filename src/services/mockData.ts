import {
  Batch,
  Cohort,
  StudentBatch,
  User,
  Question,
  Assessment,
  Submission,
  Assignment,
  AttendanceRecord,
  ClassSession,
  LiveSession,
  Notification,
  StudentPerformance,
} from '@/types';

export const INITIAL_STUDENTS: User[] = [
  {
    id: 'usr_stud_01',
    name: 'Alex Turner',
    email: 'alex.turner@student.codepulse.io',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joinedDate: '2024-06-10',
    batchIds: ['batch_fsd_2025_01'],
    batchName: 'Full Stack & DSA Cohort 2025-A',
    performanceScore: 92,
    phone: '+1 (555) 382-9912',
    bio: 'DSA enthusiast, aspiring software engineer.',
  },
  {
    id: 'usr_stud_02',
    name: 'Sophia Chen',
    email: 'sophia.chen@student.codepulse.io',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joinedDate: '2024-06-12',
    batchIds: ['batch_fsd_2025_01'],
    batchName: 'Full Stack & DSA Cohort 2025-A',
    performanceScore: 96,
    phone: '+1 (555) 492-1082',
    bio: 'Competitive programmer & React developer.',
  },
  {
    id: 'usr_stud_03',
    name: 'Liam Martinez',
    email: 'liam.martinez@student.codepulse.io',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joinedDate: '2024-06-15',
    batchIds: ['batch_fsd_2025_01'],
    batchName: 'Full Stack & DSA Cohort 2025-A',
    performanceScore: 78,
    phone: '+1 (555) 593-8472',
    bio: 'Backend enthusiast working on Node.js and PostgreSQL.',
  },
  {
    id: 'usr_stud_04',
    name: 'Amara Okafor',
    email: 'amara.okafor@student.codepulse.io',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joinedDate: '2024-06-18',
    batchIds: ['batch_ml_2025_01'],
    batchName: 'Python & AI Foundations Cohort 2025',
    performanceScore: 89,
    phone: '+1 (555) 601-9238',
  },
  {
    id: 'usr_stud_05',
    name: 'Ethan Wright',
    email: 'ethan.wright@student.codepulse.io',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'INACTIVE',
    joinedDate: '2024-05-20',
    batchIds: ['batch_fsd_2025_01'],
    batchName: 'Full Stack & DSA Cohort 2025-A',
    performanceScore: 64,
  },
  {
    id: 'usr_stud_06',
    name: 'Zara Patel',
    email: 'zara.patel@student.codepulse.io',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joinedDate: '2024-06-25',
    batchIds: ['batch_fsd_2025_01'],
    batchName: 'Full Stack & DSA Cohort 2025-A',
    performanceScore: 88,
  },
];

export const INITIAL_INSTRUCTORS: User[] = [
  {
    id: 'usr_inst_01',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@codepulse.io',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joinedDate: '2024-03-01',
    phone: '+1 (555) 042-8921',
    bio: 'Lead Instructor for Algorithms & System Architecture. Ex-Google Staff.',
    assignedBatchesCount: 3,
    totalStudentsCount: 118,
  },
  {
    id: 'usr_inst_02',
    name: 'Devon Bradley',
    email: 'devon.bradley@codepulse.io',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joinedDate: '2024-04-10',
    phone: '+1 (555) 773-9021',
    bio: 'Cloud Native & Frontend Engineering Specialist.',
    assignedBatchesCount: 2,
    totalStudentsCount: 68,
  },
  {
    id: 'usr_inst_03',
    name: 'Priya Narang',
    email: 'priya.narang@codepulse.io',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joinedDate: '2024-05-01',
    phone: '+1 (555) 881-2309',
    bio: 'Data Structures and Competitive Programming Mentor.',
    assignedBatchesCount: 2,
    totalStudentsCount: 54,
  },
];

export const INITIAL_STUDENT_BATCHES: StudentBatch[] = [
  {
    id: 'sbatch_fsd_alpha',
    name: 'Batch Alfa (Morning Core)',
    code: 'BATCH-FSD-ALP',
    section: 'Morning Track (9:00 AM - 12:00 PM)',
    studentIds: ['usr_stud_01', 'usr_stud_02', 'usr_stud_03'],
    studentCount: 24,
    tags: ['Full-Time', 'Morning Track', 'Algorithms Intensive'],
    cohortId: 'batch_fsd_2025_01',
    cohortName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    description: 'High-velocity morning cohort focusing on core data structures and React patterns.',
    createdAt: '2025-01-05',
  },
  {
    id: 'sbatch_fsd_beta',
    name: 'Batch Beta (Evening FastTrack)',
    code: 'BATCH-FSD-BET',
    section: 'Evening Track (6:00 PM - 9:00 PM)',
    studentIds: ['usr_stud_05', 'usr_stud_06'],
    studentCount: 24,
    tags: ['Working Professionals', 'FastTrack', 'Systems'],
    cohortId: 'batch_fsd_2025_01',
    cohortName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    description: 'Evening sprint group focusing on microservices, TypeScript, and full-stack projects.',
    createdAt: '2025-01-05',
  },
  {
    id: 'sbatch_ai_gamma',
    name: 'Batch Gamma (Applied AI Group)',
    code: 'BATCH-AI-GAM',
    section: 'Weekday AI Lab (7:00 PM - 9:30 PM)',
    studentIds: ['usr_stud_04'],
    studentCount: 36,
    tags: ['Python AI', 'PyTorch', 'LLMs'],
    cohortId: 'batch_ml_2025_01',
    cohortName: 'Python & Applied AI Engineering',
    description: 'Specialized deep-learning and RAG systems working group.',
    createdAt: '2025-01-20',
  },
  {
    id: 'sbatch_dsa_delta',
    name: 'Batch Delta (Competitive DSA Masters)',
    code: 'BATCH-DSA-DEL',
    section: 'Weekend Intensive (10:00 AM - 1:00 PM)',
    studentIds: ['usr_stud_02', 'usr_stud_06'],
    studentCount: 30,
    tags: ['Weekend Only', 'Hard DSA', 'Graph Theory'],
    cohortId: 'batch_dsa_adv_01',
    cohortName: 'Advanced Competitive Programming & System Design',
    description: 'Weekend tournament and contest preparation group.',
    createdAt: '2025-02-15',
  },
  {
    id: 'sbatch_unassigned_eps',
    name: 'Batch Epsilon (Cloud & DevOps New Intake)',
    code: 'BATCH-CLD-EPS',
    section: 'Self-Paced Hybrid Lab',
    studentIds: ['usr_stud_03', 'usr_stud_05'],
    studentCount: 18,
    tags: ['New Intake', 'Cloud Native', 'Kubernetes'],
    description: 'Recently formed student cluster ready for academic cohort middleware attachment.',
    createdAt: '2025-03-01',
  },
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch_fsd_2025_01',
    name: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    code: 'FSD-2025-A',
    programTrack: 'Full Stack & Cloud Architecture',
    academicTerm: 'Spring 2025',
    instructorId: 'usr_inst_01',
    instructorName: 'Dr. Elena Rostova',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    instructorEmail: 'elena.rostova@codepulse.io',
    coInstructorId: 'usr_inst_03',
    coInstructorName: 'Priya Narang',
    assignedBatchIds: ['sbatch_fsd_alpha', 'sbatch_fsd_beta'],
    assignedBatchNames: ['Batch Alfa (Morning Core)', 'Batch Beta (Evening FastTrack)'],
    totalStudentCount: 48,
    studentCount: 48,
    maxCapacity: 60,
    startDate: '2025-01-10',
    endDate: '2025-06-30',
    status: 'ACTIVE',
    progress: 68,
    description: 'Comprehensive 24-week immersive track covering Algorithms, TypeScript, React, Node.js, and System Design. Acts as the central middleware routing daily live coding lectures and proctored midterms to student batches Alfa & Beta.',
    topics: ['Arrays & HashMaps', 'Two Pointers & Sliding Window', 'Trees & Graphs', 'Dynamic Programming', 'React Architecture', 'Microservices'],
    schedule: 'Mon, Wed, Fri • 6:00 PM - 8:30 PM EST',
    virtualRoomId: 'live_room_fsd_01',
    meetUrl: 'https://meet.codepulse.io/live/fsd-2025-a',
    createdAt: '2025-01-02',
  },
  {
    id: 'batch_ml_2025_01',
    name: 'Python & Applied AI Engineering',
    code: 'PAI-2025',
    programTrack: 'Artificial Intelligence & Machine Learning',
    academicTerm: 'Spring 2025',
    instructorId: 'usr_inst_02',
    instructorName: 'Devon Bradley',
    instructorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    instructorEmail: 'devon.bradley@codepulse.io',
    assignedBatchIds: ['sbatch_ai_gamma'],
    assignedBatchNames: ['Batch Gamma (Applied AI Group)'],
    totalStudentCount: 36,
    studentCount: 36,
    maxCapacity: 45,
    startDate: '2025-02-01',
    endDate: '2025-07-15',
    status: 'ACTIVE',
    progress: 42,
    description: 'Hands-on track focused on Data Structures in Python, NumPy, PyTorch, and LLM application development.',
    topics: ['Python OOP', 'NumPy & Pandas', 'Neural Networks', 'Embeddings & RAG', 'API Deployment'],
    schedule: 'Tue, Thu • 7:00 PM - 9:30 PM EST',
    virtualRoomId: 'live_room_ml_01',
    meetUrl: 'https://meet.codepulse.io/live/pai-2025',
    createdAt: '2025-01-20',
  },
  {
    id: 'batch_dsa_adv_01',
    name: 'Advanced Competitive Programming & System Design',
    code: 'DSA-ADV-01',
    programTrack: 'Algorithms & High-Scale Systems',
    academicTerm: 'Summer 2025',
    instructorId: 'usr_inst_03',
    instructorName: 'Priya Narang',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    instructorEmail: 'priya.narang@codepulse.io',
    coInstructorId: 'usr_inst_01',
    coInstructorName: 'Dr. Elena Rostova',
    assignedBatchIds: ['sbatch_dsa_delta'],
    assignedBatchNames: ['Batch Delta (Competitive DSA Masters)'],
    totalStudentCount: 30,
    studentCount: 30,
    maxCapacity: 40,
    startDate: '2025-03-01',
    endDate: '2025-08-30',
    status: 'ACTIVE',
    progress: 25,
    description: 'Intensive interview prep focusing on LeetCode Hard patterns, Graph Theory, and High-Scale Architectures.',
    topics: ['Segment Trees', 'Tries & Disjoint Sets', 'Graph Algorithms', 'Cache Design', 'Rate Limiters'],
    schedule: 'Sat, Sun • 10:00 AM - 1:00 PM EST',
    virtualRoomId: 'live_room_dsa_01',
    meetUrl: 'https://meet.codepulse.io/live/dsa-adv-01',
    createdAt: '2025-02-25',
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q_01_two_sum',
    title: 'Two Sum',
    slug: 'two-sum',
    type: 'CODING',
    topic: 'Arrays & Hashing',
    subtopic: 'Hash Maps',
    difficulty: 'EASY',
    languages: ['javascript', 'typescript', 'python', 'cpp', 'java'],
    points: 100,
    status: 'PUBLISHED',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    testCases: [
      {
        id: 'tc_01',
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]',
        isHidden: false,
        explanation: 'Standard positive integer array test',
      },
      {
        id: 'tc_02',
        input: '[3,2,4]\n6',
        expectedOutput: '[1,2]',
        isHidden: false,
      },
      {
        id: 'tc_03',
        input: '[3,3]\n6',
        expectedOutput: '[0,1]',
        isHidden: false,
      },
      {
        id: 'tc_04_hidden',
        input: '[-1,-2,-3,-4,-5]\n-8',
        expectedOutput: '[2,4]',
        isHidden: true,
      },
      {
        id: 'tc_05_hidden',
        input: '[1000000000,-1000000000,5,3]\n8',
        expectedOutput: '[2,3]',
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        lookup = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in lookup:
                return [lookup[complement], i]
            lookup[num] = i
        return []`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> lookup;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (lookup.count(complement)) {
                return {lookup[complement], i};
            }
            lookup[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
    },
    updatedAt: '2025-02-14T10:00:00Z',
    createdAt: '2024-11-01T08:00:00Z',
    acceptanceRate: 84.5,
    submissionsCount: 342,
    authorName: 'Dr. Elena Rostova',
  },
  {
    id: 'q_02_reverse_string',
    title: 'Reverse a String In-Place',
    slug: 'reverse-string',
    type: 'CODING',
    topic: 'Strings & Two Pointers',
    difficulty: 'EASY',
    languages: ['javascript', 'typescript', 'python', 'cpp', 'java'],
    points: 80,
    status: 'PUBLISHED',
    description: `Write a function that reverses an array of characters \`s\` in-place.

You must do this by modifying the input array in-place with \`O(1)\` extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.',
    ],
    testCases: [
      {
        id: 'tc_rs_01',
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
        isHidden: false,
      },
      {
        id: 'tc_rs_02',
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
        isHidden: false,
      },
      {
        id: 'tc_rs_03_hidden',
        input: '["a"]',
        expectedOutput: '["a"]',
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {character[]} s
 * @return {character[]}
 */
function reverseString(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  return s;
}`,
      typescript: `function reverseString(s: string[]): string[] {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
  return s;
}`,
      python: `class Solution:
    def reverseString(self, s: list[str]) -> list[str]:
        s.reverse()
        return s`,
    },
    updatedAt: '2025-02-12T14:30:00Z',
    createdAt: '2024-11-05T09:00:00Z',
    acceptanceRate: 91.2,
    submissionsCount: 289,
    authorName: 'Dr. Elena Rostova',
  },
  {
    id: 'q_03_valid_parentheses',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    type: 'CODING',
    topic: 'Stacks & Queues',
    difficulty: 'MEDIUM',
    languages: ['javascript', 'typescript', 'python', 'cpp', 'java'],
    points: 120,
    status: 'PUBLISHED',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}"',
    ],
    testCases: [
      { id: 'tc_vp_01', input: '"()"', expectedOutput: 'true', isHidden: false },
      { id: 'tc_vp_02', input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
      { id: 'tc_vp_03', input: '"(]"', expectedOutput: 'false', isHidden: false },
      { id: 'tc_vp_04_hidden', input: '"{[()]}"', expectedOutput: 'true', isHidden: true },
      { id: 'tc_vp_05_hidden', input: '"([)]"', expectedOutput: 'false', isHidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (['(', '{', '['].includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`,
    },
    updatedAt: '2025-02-10T12:00:00Z',
    createdAt: '2024-11-10T10:00:00Z',
    acceptanceRate: 72.8,
    submissionsCount: 410,
    authorName: 'Priya Narang',
  },
  {
    id: 'q_04_lru_cache',
    title: 'Design LRU Cache',
    slug: 'lru-cache',
    type: 'CODING',
    topic: 'Design & Data Structures',
    difficulty: 'HARD',
    languages: ['javascript', 'typescript', 'python', 'cpp'],
    points: 200,
    status: 'PUBLISHED',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
* \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
* \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
* \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    testCases: [
      {
        id: 'tc_lru_01',
        input: 'capacity: 2, ops: put(1,1), put(2,2), get(1), put(3,3), get(2)',
        expectedOutput: '[null, null, 1, null, -1]',
        isHidden: false,
      },
    ],
    starterCode: {
      javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}`,
      typescript: `class LRUCache {
  private capacity: number;
  private map: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}`,
    },
    updatedAt: '2025-02-15T09:00:00Z',
    createdAt: '2024-11-20T08:00:00Z',
    acceptanceRate: 58.4,
    submissionsCount: 180,
    authorName: 'Dr. Elena Rostova',
  },
  {
    id: 'q_05_mcq_promises',
    title: 'JavaScript Event Loop & Microtasks Execution Order',
    slug: 'js-event-loop-microtasks',
    type: 'MCQ',
    topic: 'JavaScript Internals',
    difficulty: 'MEDIUM',
    languages: ['javascript'],
    points: 50,
    status: 'PUBLISHED',
    description: `What is the console output order for the following JavaScript snippet?

\`\`\`javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');
\`\`\``,
    options: [
      { id: 'opt_1', text: '1, 4, 3, 2', isCorrect: true },
      { id: 'opt_2', text: '1, 2, 3, 4', isCorrect: false },
      { id: 'opt_3', text: '1, 4, 2, 3', isCorrect: false },
      { id: 'opt_4', text: '1, 3, 4, 2', isCorrect: false },
    ],
    examples: [],
    constraints: [],
    testCases: [],
    starterCode: {},
    updatedAt: '2025-02-11T11:00:00Z',
    createdAt: '2024-11-15T10:00:00Z',
    acceptanceRate: 79.1,
    submissionsCount: 220,
    authorName: 'Devon Bradley',
  },
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm_midterm_dsa_01',
    title: 'Midterm Coding Assessment: DSA Core & Problem Solving',
    description: 'Timed assessment evaluating competency in Hash Maps, Stacks, Pointers, and algorithmic optimization.',
    batchIds: ['batch_fsd_2025_01'],
    batchNames: ['Full Stack & DSA Accelerator (Cohort 2025-A)'],
    questionIds: ['q_01_two_sum', 'q_02_reverse_string', 'q_03_valid_parentheses'],
    durationMinutes: 60,
    startTime: '2025-02-20T14:00:00Z',
    endTime: '2025-03-01T23:59:59Z',
    status: 'IN_PROGRESS',
    totalPoints: 300,
    passPercentage: 70,
    settings: {
      shuffleQuestions: false,
      shuffleOptions: true,
      negativeMarking: false,
      sectionTiming: false,
      allowedLanguages: ['javascript', 'typescript', 'python', 'cpp', 'java'],
      proctoring: {
        enableWebcam: true,
        fullscreenRequired: true,
        tabSwitchLimit: 3,
        blockCopyPaste: true,
        trackAudio: false,
      },
    },
    questionsCount: 3,
    submissionsCount: 38,
    avgScore: 84,
    highestScore: 100,
    createdAt: '2025-02-15T12:00:00Z',
    authorName: 'Dr. Elena Rostova',
  },
  {
    id: 'asm_mock_interview_02',
    title: 'System Design & High-Scale Algorithms Benchmark',
    description: 'Advanced assessment covering LRU Caches, distributed rate-limiting logic, and concurrent queues.',
    batchIds: ['batch_fsd_2025_01', 'batch_dsa_adv_01'],
    batchNames: ['Full Stack & DSA Accelerator', 'Advanced Competitive Programming'],
    questionIds: ['q_04_lru_cache', 'q_03_valid_parentheses'],
    durationMinutes: 90,
    startTime: '2025-03-05T18:00:00Z',
    endTime: '2025-03-10T23:59:59Z',
    status: 'UPCOMING',
    totalPoints: 320,
    passPercentage: 75,
    settings: {
      shuffleQuestions: true,
      shuffleOptions: true,
      negativeMarking: false,
      sectionTiming: true,
      allowedLanguages: ['javascript', 'typescript', 'python', 'cpp'],
      proctoring: {
        enableWebcam: true,
        fullscreenRequired: true,
        tabSwitchLimit: 2,
        blockCopyPaste: true,
        trackAudio: true,
      },
    },
    questionsCount: 2,
    submissionsCount: 0,
    createdAt: '2025-02-18T10:00:00Z',
    authorName: 'Dr. Elena Rostova',
  },
  {
    id: 'asm_diagnostic_03',
    title: 'Cohort Diagnostic: JavaScript Fundamentals & Async JS',
    description: 'Initial benchmark test covering Event Loop, Promises, Arrays, and Object Mutability.',
    batchIds: ['batch_fsd_2025_01'],
    batchNames: ['Full Stack & DSA Accelerator (Cohort 2025-A)'],
    questionIds: ['q_01_two_sum', 'q_05_mcq_promises'],
    durationMinutes: 45,
    startTime: '2025-01-20T10:00:00Z',
    endTime: '2025-01-25T23:59:59Z',
    status: 'COMPLETED',
    totalPoints: 150,
    passPercentage: 65,
    settings: {
      shuffleQuestions: false,
      shuffleOptions: true,
      negativeMarking: false,
      sectionTiming: false,
      allowedLanguages: ['javascript', 'typescript'],
      proctoring: {
        enableWebcam: false,
        fullscreenRequired: false,
        tabSwitchLimit: 5,
        blockCopyPaste: false,
        trackAudio: false,
      },
    },
    questionsCount: 2,
    submissionsCount: 46,
    avgScore: 89,
    highestScore: 100,
    createdAt: '2025-01-15T08:00:00Z',
    authorName: 'Devon Bradley',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_90124',
    assessmentId: 'asm_midterm_dsa_01',
    assessmentTitle: 'Midterm Coding Assessment: DSA Core & Problem Solving',
    questionId: 'q_01_two_sum',
    questionTitle: 'Two Sum',
    studentId: 'usr_stud_01',
    studentName: 'Alex Turner',
    studentEmail: 'alex.turner@student.codepulse.io',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    language: 'typescript',
    code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    status: 'ACCEPTED',
    score: 100,
    maxScore: 100,
    totalTests: 5,
    passedTests: 5,
    executionTimeMs: 124,
    memoryUsedMb: 18.4,
    submittedAt: '2025-02-21T11:42:00Z',
    testCaseResults: [
      {
        testCaseId: 'tc_01',
        status: 'ACCEPTED',
        passed: true,
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]',
        actualOutput: '[0,1]',
        executionTimeMs: 24,
        memoryUsedMb: 17.8,
        isHidden: false,
      },
      {
        testCaseId: 'tc_02',
        status: 'ACCEPTED',
        passed: true,
        input: '[3,2,4]\n6',
        expectedOutput: '[1,2]',
        actualOutput: '[1,2]',
        executionTimeMs: 22,
        memoryUsedMb: 18.0,
        isHidden: false,
      },
      {
        testCaseId: 'tc_03',
        status: 'ACCEPTED',
        passed: true,
        input: '[3,3]\n6',
        expectedOutput: '[0,1]',
        actualOutput: '[0,1]',
        executionTimeMs: 26,
        memoryUsedMb: 18.1,
        isHidden: false,
      },
      {
        testCaseId: 'tc_04_hidden',
        status: 'ACCEPTED',
        passed: true,
        input: '[-1,-2,-3,-4,-5]\n-8',
        expectedOutput: '[2,4]',
        actualOutput: '[2,4]',
        executionTimeMs: 25,
        memoryUsedMb: 18.4,
        isHidden: true,
      },
      {
        testCaseId: 'tc_05_hidden',
        status: 'ACCEPTED',
        passed: true,
        input: '[1000000000,-1000000000,5,3]\n8',
        expectedOutput: '[2,3]',
        actualOutput: '[2,3]',
        executionTimeMs: 27,
        memoryUsedMb: 18.4,
        isHidden: true,
      },
    ],
  },
  {
    id: 'sub_90125',
    assessmentId: 'asm_midterm_dsa_01',
    assessmentTitle: 'Midterm Coding Assessment: DSA Core & Problem Solving',
    questionId: 'q_02_reverse_string',
    questionTitle: 'Reverse a String In-Place',
    studentId: 'usr_stud_01',
    studentName: 'Alex Turner',
    studentEmail: 'alex.turner@student.codepulse.io',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    language: 'typescript',
    code: `function reverseString(s: string[]): string[] {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
  return s;
}`,
    status: 'ACCEPTED',
    score: 80,
    maxScore: 80,
    totalTests: 3,
    passedTests: 3,
    executionTimeMs: 88,
    memoryUsedMb: 16.2,
    submittedAt: '2025-02-21T12:05:00Z',
    testCaseResults: [
      {
        testCaseId: 'tc_rs_01',
        status: 'ACCEPTED',
        passed: true,
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
        actualOutput: '["o","l","l","e","h"]',
        executionTimeMs: 30,
        memoryUsedMb: 16.0,
      },
      {
        testCaseId: 'tc_rs_02',
        status: 'ACCEPTED',
        passed: true,
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
        actualOutput: '["h","a","n","n","a","H"]',
        executionTimeMs: 28,
        memoryUsedMb: 16.1,
      },
      {
        testCaseId: 'tc_rs_03_hidden',
        status: 'ACCEPTED',
        passed: true,
        input: '["a"]',
        expectedOutput: '["a"]',
        actualOutput: '["a"]',
        executionTimeMs: 30,
        memoryUsedMb: 16.2,
        isHidden: true,
      },
    ],
  },
  {
    id: 'sub_90126',
    assessmentId: 'asm_midterm_dsa_01',
    assessmentTitle: 'Midterm Coding Assessment: DSA Core & Problem Solving',
    questionId: 'q_03_valid_parentheses',
    questionTitle: 'Valid Parentheses',
    studentId: 'usr_stud_03',
    studentName: 'Liam Martinez',
    studentEmail: 'liam.martinez@student.codepulse.io',
    batchId: 'batch_fsd_2025_01',
    language: 'javascript',
    code: `function isValid(s) {
  return s.length % 2 === 0;
}`,
    status: 'WRONG_ANSWER',
    score: 24,
    maxScore: 120,
    totalTests: 5,
    passedTests: 1,
    executionTimeMs: 95,
    memoryUsedMb: 15.5,
    submittedAt: '2025-02-21T13:10:00Z',
    testCaseResults: [
      {
        testCaseId: 'tc_vp_01',
        status: 'ACCEPTED',
        passed: true,
        input: '"()"',
        expectedOutput: 'true',
        actualOutput: 'true',
      },
      {
        testCaseId: 'tc_vp_02',
        status: 'WRONG_ANSWER',
        passed: false,
        input: '"()[]{}"',
        expectedOutput: 'true',
        actualOutput: 'true',
      },
      {
        testCaseId: 'tc_vp_03',
        status: 'WRONG_ANSWER',
        passed: false,
        input: '"(]"',
        expectedOutput: 'false',
        actualOutput: 'true',
        errorMessage: 'Output mismatch: expected false, got true',
      },
    ],
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_01_tree_traversals',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    title: 'Assignment 4: Binary Tree Inversion & BFS/DFS Visualizer',
    description: 'Implement iterative and recursive tree traversals. Include time-complexity analysis markdown document.',
    dueDate: '2025-03-02T23:59:59Z',
    totalPoints: 100,
    status: 'ACTIVE',
    submissionsCount: 34,
    totalStudents: 48,
    tags: ['Trees', 'Recursion', 'DFS', 'BFS'],
    attachments: [
      { name: 'TreeTraversal_Spec.pdf', size: '1.4 MB', url: '#' },
      { name: 'Starter_Tree_Node.ts', size: '24 KB', url: '#' },
    ],
    createdAt: '2025-02-16T10:00:00Z',
  },
  {
    id: 'asg_02_react_state_engine',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
    title: 'Assignment 5: Custom Zustand-style Mini Reactive Store',
    description: 'Build a lightweight pub/sub state manager in TypeScript with useSyncExternalStore hook integration.',
    dueDate: '2025-03-12T23:59:59Z',
    totalPoints: 150,
    status: 'ACTIVE',
    submissionsCount: 12,
    totalStudents: 48,
    tags: ['React', 'TypeScript', 'State Management'],
    createdAt: '2025-02-19T09:00:00Z',
  },
];

export const INITIAL_CLASSES: ClassSession[] = [
  {
    id: 'cls_01',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator',
    title: 'Live Lab: Graph Algorithms (Dijkstra & BFS Shortest Path)',
    instructorName: 'Dr. Elena Rostova',
    date: '2025-02-23',
    time: '6:00 PM EST',
    durationMinutes: 90,
    status: 'SCHEDULED',
    meetUrl: 'https://meet.google.com/xyz-codepulse-dsa',
    description: 'Interactive coding session implementing Adjacency Lists and Priority Queues.',
    attendanceCount: 0,
    totalStudents: 48,
  },
  {
    id: 'cls_02',
    batchId: 'batch_fsd_2025_01',
    batchName: 'Full Stack & DSA Accelerator',
    title: 'System Design: Rate Limiting & Sliding Window Counter',
    instructorName: 'Dr. Elena Rostova',
    date: '2025-02-21',
    time: '6:00 PM EST',
    durationMinutes: 120,
    status: 'COMPLETED',
    meetUrl: '#',
    recordingUrl: 'https://cdn.codepulse.io/recordings/sd-rate-limiting.mp4',
    description: 'Deep dive into Redis token buckets, Leaky buckets, and distributed Redis locks.',
    attendanceCount: 44,
    totalStudents: 48,
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_01',
    studentId: 'usr_stud_01',
    studentName: 'Alex Turner',
    studentEmail: 'alex.turner@student.codepulse.io',
    batchId: 'batch_fsd_2025_01',
    classId: 'cls_02',
    classTitle: 'System Design: Rate Limiting & Sliding Window Counter',
    date: '2025-02-21',
    status: 'PRESENT',
    durationMinutes: 118,
  },
  {
    id: 'att_02',
    studentId: 'usr_stud_02',
    studentName: 'Sophia Chen',
    studentEmail: 'sophia.chen@student.codepulse.io',
    batchId: 'batch_fsd_2025_01',
    classId: 'cls_02',
    classTitle: 'System Design: Rate Limiting & Sliding Window Counter',
    date: '2025-02-21',
    status: 'PRESENT',
    durationMinutes: 120,
  },
  {
    id: 'att_03',
    studentId: 'usr_stud_03',
    studentName: 'Liam Martinez',
    studentEmail: 'liam.martinez@student.codepulse.io',
    batchId: 'batch_fsd_2025_01',
    classId: 'cls_02',
    classTitle: 'System Design: Rate Limiting & Sliding Window Counter',
    date: '2025-02-21',
    status: 'LATE',
    durationMinutes: 75,
    notes: 'Joined 45 mins late due to network delay.',
  },
  {
    id: 'att_04',
    studentId: 'usr_stud_05',
    studentName: 'Ethan Wright',
    studentEmail: 'ethan.wright@student.codepulse.io',
    batchId: 'batch_fsd_2025_01',
    classId: 'cls_02',
    classTitle: 'System Design: Rate Limiting & Sliding Window Counter',
    date: '2025-02-21',
    status: 'ABSENT',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_01',
    userId: 'usr_stud_01',
    role: 'STUDENT',
    title: 'Midterm Assessment is Live',
    message: 'DSA Core & Problem Solving Midterm is now active. Time limit: 60 minutes.',
    type: 'ASSESSMENT',
    read: false,
    createdAt: '2025-02-21T09:00:00Z',
    link: '/student/assessments/asm_midterm_dsa_01',
  },
  {
    id: 'notif_02',
    userId: 'usr_stud_01',
    role: 'STUDENT',
    title: 'Submission Graded: Two Sum',
    message: 'Your TypeScript solution was Accepted with 100/100 points (124ms).',
    type: 'RESULT',
    read: true,
    createdAt: '2025-02-21T11:45:00Z',
    link: '/student/submissions/sub_90124',
  },
  {
    id: 'notif_03',
    userId: 'usr_inst_01',
    role: 'INSTRUCTOR',
    title: 'Live Proctor Alert: Tab Switch Detected',
    message: 'Student Liam Martinez switched tabs 3 times during Midterm Assessment.',
    type: 'SYSTEM',
    read: false,
    createdAt: '2025-02-21T13:12:00Z',
    link: '/instructor/assessments/asm_midterm_dsa_01',
  },
  {
    id: 'notif_04',
    role: 'ALL',
    title: 'Scheduled Maintenance Notice',
    message: 'Code execution sandboxes will undergo planned kernel upgrades this Sunday at 02:00 UTC.',
    type: 'SYSTEM',
    read: true,
    createdAt: '2025-02-18T15:00:00Z',
  },
];

export const INITIAL_LIVE_SESSION: LiveSession = {
  id: 'live_sess_01',
  batchId: 'batch_fsd_2025_01',
  batchName: 'Full Stack & DSA Accelerator (Cohort 2025-A)',
  assessmentId: 'asm_midterm_dsa_01',
  assessmentTitle: 'Midterm Coding Assessment: DSA Core & Problem Solving',
  title: 'Midterm Proctor & Live Coding Arena',
  instructorId: 'usr_inst_01',
  instructorName: 'Dr. Elena Rostova',
  startTime: '2025-02-21T14:00:00Z',
  status: 'LIVE',
  activeParticipants: 6,
  totalParticipants: 48,
  students: [
    {
      studentId: 'usr_stud_01',
      studentName: 'Alex Turner',
      studentEmail: 'alex.turner@student.codepulse.io',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      startedAt: '14:02:10',
      currentQuestionIndex: 2,
      currentQuestionTitle: 'Valid Parentheses',
      questionsAttempted: 2,
      totalQuestions: 3,
      codeActivity: 'Typing stack logic',
      language: 'typescript',
      currentCode: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (['(', '{', '['].includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      testAttempts: 3,
      score: 180,
      connectionQuality: 'GOOD',
      flags: [],
      lastPing: '2s ago',
    },
    {
      studentId: 'usr_stud_02',
      studentName: 'Sophia Chen',
      studentEmail: 'sophia.chen@student.codepulse.io',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      status: 'COMPLETED',
      startedAt: '14:00:45',
      currentQuestionIndex: 3,
      currentQuestionTitle: 'All Solved',
      questionsAttempted: 3,
      totalQuestions: 3,
      codeActivity: 'Submitted solution',
      language: 'python',
      currentCode: `# All questions finished with 100% tests passed`,
      testAttempts: 4,
      score: 300,
      connectionQuality: 'GOOD',
      flags: [],
      lastPing: '1m ago',
    },
    {
      studentId: 'usr_stud_03',
      studentName: 'Liam Martinez',
      studentEmail: 'liam.martinez@student.codepulse.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'FLAGGED',
      startedAt: '14:05:20',
      currentQuestionIndex: 1,
      currentQuestionTitle: 'Reverse a String In-Place',
      questionsAttempted: 1,
      totalQuestions: 3,
      codeActivity: 'Window focus lost',
      language: 'javascript',
      currentCode: `function reverseString(s) {
  return s.reverse();
}`,
      testAttempts: 2,
      score: 80,
      connectionQuality: 'FAIR',
      flags: [
        {
          id: 'flg_01',
          type: 'TAB_SWITCH',
          timestamp: '14:14:22',
          message: 'Switched window tab to external browser page',
          severity: 'HIGH',
        },
        {
          id: 'flg_02',
          type: 'COPY_PASTE',
          timestamp: '14:16:04',
          message: 'Pasted 42 lines from clipboard',
          severity: 'MEDIUM',
        },
      ],
      lastPing: '4s ago',
    },
    {
      studentId: 'usr_stud_04',
      studentName: 'Amara Okafor',
      studentEmail: 'amara.okafor@student.codepulse.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      startedAt: '14:03:00',
      currentQuestionIndex: 2,
      currentQuestionTitle: 'Valid Parentheses',
      questionsAttempted: 1,
      totalQuestions: 3,
      codeActivity: 'Running test cases',
      language: 'python',
      currentCode: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
      testAttempts: 1,
      score: 100,
      connectionQuality: 'GOOD',
      flags: [],
      lastPing: '1s ago',
    },
    {
      studentId: 'usr_stud_05',
      studentName: 'Ethan Wright',
      studentEmail: 'ethan.wright@student.codepulse.io',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'IDLE',
      startedAt: '14:08:15',
      currentQuestionIndex: 1,
      currentQuestionTitle: 'Two Sum',
      questionsAttempted: 0,
      totalQuestions: 3,
      codeActivity: 'Idle for > 4 mins',
      language: 'javascript',
      currentCode: `function twoSum(nums, target) {}`,
      testAttempts: 0,
      score: 0,
      connectionQuality: 'POOR',
      flags: [],
      lastPing: '12s ago',
    },
    {
      studentId: 'usr_stud_06',
      studentName: 'Zara Patel',
      studentEmail: 'zara.patel@student.codepulse.io',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      startedAt: '14:01:40',
      currentQuestionIndex: 3,
      currentQuestionTitle: 'Valid Parentheses',
      questionsAttempted: 2,
      totalQuestions: 3,
      codeActivity: 'Optimizing memory footprint',
      language: 'cpp',
      currentCode: `#include <vector>\n// C++ optimization`,
      testAttempts: 5,
      score: 180,
      connectionQuality: 'GOOD',
      flags: [],
      lastPing: '3s ago',
    },
  ],
};

export const MOCK_STUDENT_PERFORMANCE: StudentPerformance = {
  studentId: 'usr_stud_01',
  overallScore: 92.4,
  problemsSolved: 64,
  totalProblems: 80,
  assessmentsCompleted: 7,
  totalAssessments: 8,
  currentStreak: 14,
  longestStreak: 21,
  hoursSpent: 58.5,
  successRate: 88.5,
  skills: [
    { skill: 'JavaScript / TypeScript', score: 94, problemsSolved: 28, totalProblems: 30, level: 'Expert' },
    { skill: 'Data Structures & Algorithms', score: 90, problemsSolved: 22, totalProblems: 25, level: 'Advanced' },
    { skill: 'React Architecture', score: 92, problemsSolved: 10, totalProblems: 12, level: 'Advanced' },
    { skill: 'Python Scripting', score: 82, problemsSolved: 8, totalProblems: 10, level: 'Intermediate' },
    { skill: 'SQL & Database Design', score: 86, problemsSolved: 6, totalProblems: 8, level: 'Advanced' },
    { skill: 'System Design', score: 78, problemsSolved: 4, totalProblems: 6, level: 'Intermediate' },
  ],
  topicPerformance: [
    { topic: 'Arrays & Hashing', score: 96, count: 18 },
    { topic: 'Two Pointers', score: 92, count: 12 },
    { topic: 'Trees & Graphs', score: 88, count: 14 },
    { topic: 'Dynamic Programming', score: 74, count: 10 },
    { topic: 'Stack & Queue', score: 94, count: 10 },
  ],
  scoreTrend: [
    { date: 'Jan 15', score: 78, assessment: 'Diagnostic Test' },
    { date: 'Jan 28', score: 84, assessment: 'Quiz 1: Arrays' },
    { date: 'Feb 05', score: 88, assessment: 'Quiz 2: Stacks' },
    { date: 'Feb 14', score: 92, assessment: 'Quiz 3: Recursion' },
    { date: 'Feb 21', score: 96, assessment: 'DSA Midterm' },
  ],
  submissionActivity: [
    { day: 'Mon', count: 6 },
    { day: 'Tue', count: 8 },
    { day: 'Wed', count: 12 },
    { day: 'Thu', count: 5 },
    { day: 'Fri', count: 14 },
    { day: 'Sat', count: 9 },
    { day: 'Sun', count: 4 },
  ],
};
