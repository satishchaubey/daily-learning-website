import { Roadmap, User, Problem } from '../types';
import localCurriculum from '../data/curriculum.json';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const DEFAULT_DEMO_USER: User = {
  _id: 'usr_demo_101',
  username: 'SeniorCandidate',
  email: 'learner@dailymastery.dev',
  role: 'PRO_DEV',
  timezone: 'Asia/Kolkata',
  streaks: {
    easy: { current: 14, longest: 21, lastActiveDate: new Date().toISOString().slice(0, 10) },
    medium: { current: 8, longest: 14, lastActiveDate: new Date().toISOString().slice(0, 10) },
    advanced: { current: 3, longest: 7, lastActiveDate: new Date().toISOString().slice(0, 10) },
    freezeTokens: 2,
  },
  completedTopicIds: ['system-design-c1-t1', 'backend-c1-t1', 'leetcode-c1-t1'],
  solvedProblemIds: ['two-sum-target'],
};

const DEFAULT_PROBLEMS: Problem[] = [
  {
    slug: 'two-sum-target',
    title: 'Two Sum & Fast Hash Map Lookup',
    category: 'Algorithms & Data Structures',
    difficulty: 'EASY',
    streakTier: 'EASY_STREAK',
    descriptionMarkdown: `### Two Sum
Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

#### Constraints:
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- Only one valid answer exists.`,
    starterTemplates: {
      javascript: `function twoSum(nums, target) {
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
      python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    },
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]', explanation: '2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]', explanation: '2 + 4 = 6' },
    ],
    visualizerPayload: {
      type: 'DSA_HASHMAP',
      initialArray: [2, 7, 11, 15],
      target: 9,
    },
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses & Call Stack',
    category: 'Algorithms & Data Structures',
    difficulty: 'EASY',
    streakTier: 'EASY_STREAK',
    descriptionMarkdown: `### Valid Parentheses
Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket.`,
    starterTemplates: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
    },
    testCases: [
      { input: 's = "()[]{}"', expectedOutput: 'true', explanation: 'All pairs properly closed' },
      { input: 's = "(]"', expectedOutput: 'false', explanation: 'Mismatched closing bracket' },
    ],
  },
  {
    slug: 'longest-substring-without-repeat',
    title: 'Longest Substring Without Repeating Characters',
    category: 'Algorithms & Data Structures',
    difficulty: 'MEDIUM',
    streakTier: 'MEDIUM_STREAK',
    descriptionMarkdown: `### Longest Substring Without Repeating Characters
Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

#### Key Optimization:
Use a dynamic **Sliding Window** with a Hash Map storing the last seen index of each character to achieve $O(N)$ single-pass execution.`,
    starterTemplates: {
      javascript: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const lastSeen = new Map();
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    max_len = left = 0
    for right, char in enumerate(s):
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    },
    testCases: [
      { input: 's = "abcabcbb"', expectedOutput: '3', explanation: 'Substring "abc"' },
      { input: 's = "bbbbb"', expectedOutput: '1', explanation: 'Substring "b"' },
    ],
  },
  {
    slug: 'lru-cache-implementation',
    title: 'LRU Cache Design (O(1) Eviction)',
    category: 'Low Level Design (LLD)',
    difficulty: 'MEDIUM',
    streakTier: 'MEDIUM_STREAK',
    descriptionMarkdown: `### LRU Cache Design
Design and implement a data structure for **Least Recently Used (LRU) cache**. It should support \`get\` and \`put\` in **O(1)** time complexity.

Uses a Hash Map paired with a Doubly Linked List for instant eviction and updates.`,
    starterTemplates: {
      javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}`,
    },
    testCases: [
      { input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2);', expectedOutput: '-1', explanation: 'Key 2 was evicted' },
    ],
    visualizerPayload: {
      type: 'LLD_DOUBLY_LINKED_LIST',
      nodes: ['Head (MRU)', 'Node(1,1)', 'Node(3,3)', 'Tail (LRU)'],
    },
  },
  {
    slug: 'async-queue-concurrency',
    title: 'Async Task Queue with Concurrency Limit',
    category: 'Backend Engineering',
    difficulty: 'MEDIUM',
    streakTier: 'MEDIUM_STREAK',
    descriptionMarkdown: `### Concurrent Task Queue
Implement an asynchronous task queue that runs up to \`concurrency\` asynchronous functions simultaneously. When any task finishes, the next queued task must immediately start.

Crucial for avoiding downstream API rate limits and preventing memory exhaustion in Node.js backend services.`,
    starterTemplates: {
      javascript: `class AsyncQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await task());
        } catch (e) {
          reject(e);
        }
      });
      this.next();
    });
  }
  next() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      this.running++;
      task().finally(() => {
        this.running--;
        this.next();
      });
    }
  }
}`,
    },
    testCases: [
      { input: 'Queue with concurrency=2, adding 5 tasks of 100ms', expectedOutput: 'Completed in ~300ms', explanation: '2 parallel streams' },
    ],
  },
  {
    slug: 'distributed-rate-limiter',
    title: 'Distributed Token Bucket Rate Limiter (Amazon Scale)',
    category: 'Architecture & Distributed Systems',
    difficulty: 'ADVANCED',
    streakTier: 'ADVANCED_STREAK',
    descriptionMarkdown: `### Distributed Token Bucket Rate Limiter
Design a low-latency rate limiter suitable for **1,000,000 QPS** on an API Gateway.

Must prevent denial-of-service, handle burst traffic, and synchronize atomic state with Redis or memory tokens.`,
    starterTemplates: {
      javascript: `class TokenBucketRateLimiter {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }
  allowRequest(tokensNeeded = 1) {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
    if (this.tokens >= tokensNeeded) {
      this.tokens -= tokensNeeded;
      return true;
    }
    return false;
  }
}`,
    },
    testCases: [
      { input: 'Burst of 5 requests with capacity 5', expectedOutput: 'true, true, true, true, true', explanation: 'All allowed' },
      { input: '6th immediate request', expectedOutput: 'false', explanation: 'Bucket empty -> 429' },
    ],
    visualizerPayload: {
      type: 'SYSTEM_TOPOLOGY',
      services: ['CloudFront Edge', 'API Gateway', 'Distributed Redis', 'Backend Microservices'],
    },
  },
  {
    slug: 'consistent-hashing-ring',
    title: 'Consistent Hashing Ring with Virtual Nodes',
    category: 'Architecture & Distributed Systems',
    difficulty: 'ADVANCED',
    streakTier: 'ADVANCED_STREAK',
    descriptionMarkdown: `### Consistent Hashing Ring
Implement a Consistent Hashing Ring with **Virtual Nodes** to distribute cache keys across database or cache servers.

When a server node is added or removed, only $K/N$ keys should require migration, preventing thundering herds on primary databases.`,
    starterTemplates: {
      javascript: `class ConsistentHashRing {
  constructor(virtualNodes = 100) {
    this.virtualNodes = virtualNodes;
    this.ring = new Map();
    this.sortedKeys = [];
  }
  addNode(node) {
    for (let i = 0; i < this.virtualNodes; i++) {
      const vKey = this.hash(\`\${node}#\${i}\`);
      this.ring.set(vKey, node);
      this.sortedKeys.push(vKey);
    }
    this.sortedKeys.sort((a, b) => a - b);
  }
  getNode(key) {
    if (this.sortedKeys.length === 0) return null;
    const keyHash = this.hash(key);
    // Binary search for first node >= keyHash
    for (const h of this.sortedKeys) {
      if (h >= keyHash) return this.ring.get(h);
    }
    return this.ring.get(this.sortedKeys[0]); // Wrap around
  }
  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
    return Math.abs(hash);
  }
}`,
    },
    testCases: [
      { input: '3 Server Nodes, 1000 Keys routed', expectedOutput: 'Uniform distribution across servers', explanation: 'Minimal remap on node removal' },
    ],
  },
  {
    slug: 'rag-vector-chunking',
    title: 'RAG Text Chunking & Overlap Window',
    category: 'AI & LLM Engineering',
    difficulty: 'MEDIUM',
    streakTier: 'MEDIUM_STREAK',
    descriptionMarkdown: `### RAG Semantic Text Chunking
Implement a sliding chunking algorithm with token overlap for **Retrieval-Augmented Generation (RAG)**.

Ensures that semantic meaning that spans across chunk boundaries is preserved, avoiding broken sentences when generating vector embeddings.`,
    starterTemplates: {
      python: `def chunk_document(text: str, chunk_size: int = 200, overlap: int = 40):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks`,
      javascript: `function chunkDocument(text, chunkSize = 200, overlap = 40) {
  const words = text.split(/\\s+/);
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
    i += chunkSize - overlap;
  }
  return chunks;
}`,
    },
    testCases: [
      { input: 'Document of 300 words with chunkSize=100, overlap=20', expectedOutput: '4 overlapping chunks', explanation: 'Preserves boundary context' },
    ],
  },
];

export const apiService = {
  // Roadmaps
  async getRoadmaps(): Promise<Roadmap[]> {
    try {
      const res = await fetch(`${API_BASE}/roadmaps`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
    return localCurriculum as unknown as Roadmap[];
  },

  async getRoadmap(slug: string): Promise<Roadmap | null> {
    try {
      const res = await fetch(`${API_BASE}/roadmaps/${slug}`);
      if (res.ok) return await res.json();
    } catch {}
    const list = localCurriculum as unknown as Roadmap[];
    return list.find((r) => r.slug === slug || r.id === slug) || null;
  },

  // User & Streaks
  getUser(): User {
    if (typeof window === 'undefined') {
      return DEFAULT_DEMO_USER;
    }
    const stored = localStorage.getItem('daily_mastery_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    localStorage.setItem('daily_mastery_user', JSON.stringify(DEFAULT_DEMO_USER));
    return DEFAULT_DEMO_USER;
  },

  async saveUser(user: User): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('daily_mastery_user', JSON.stringify(user));
    }
  },

  async recordActivity(tier: 'easy' | 'medium' | 'advanced', actionId?: string): Promise<User> {
    const user = this.getUser();
    try {
      const res = await fetch(`${API_BASE}/streaks/${user._id}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, actionId }),
      });
      if (res.ok) {
        const data = await res.json();
        user.streaks = data.streaks;
      }
    } catch {
      // Local fallback calculation
      const today = new Date().toISOString().slice(0, 10);
      const tierObj = user.streaks[tier];
      if (!tierObj.lastActiveDate) {
        tierObj.current = 1;
        tierObj.longest = Math.max(tierObj.longest, 1);
        tierObj.lastActiveDate = today;
      } else {
        const last = new Date(tierObj.lastActiveDate + 'T00:00:00Z');
        const now = new Date(today + 'T00:00:00Z');
        const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tierObj.current += 1;
          tierObj.longest = Math.max(tierObj.longest, tierObj.current);
          tierObj.lastActiveDate = today;
        } else if (diffDays > 1) {
          // Strict reset!
          tierObj.current = 1;
          tierObj.lastActiveDate = today;
        }
      }
    }

    if (actionId) {
      if (tier === 'easy' && !user.completedTopicIds.includes(actionId)) {
        user.completedTopicIds.push(actionId);
      } else if ((tier === 'medium' || tier === 'advanced') && !user.solvedProblemIds.includes(actionId)) {
        user.solvedProblemIds.push(actionId);
      }
    }

    await this.saveUser(user);
    return user;
  },

  async useFreezeToken(): Promise<User> {
    const user = this.getUser();
    if (user.streaks.freezeTokens > 0) {
      user.streaks.freezeTokens -= 1;
      const today = new Date().toISOString().slice(0, 10);
      user.streaks.easy.lastActiveDate = today;
      user.streaks.medium.lastActiveDate = today;
      user.streaks.advanced.lastActiveDate = today;
      await this.saveUser(user);
    }
    return user;
  },

  // Problems
  async getProblems(): Promise<Problem[]> {
    try {
      const res = await fetch(`${API_BASE}/practice/problems`);
      if (res.ok) {
        const serverProblems = await res.json();
        if (Array.isArray(serverProblems) && serverProblems.length > 0) {
          return serverProblems;
        }
      }
    } catch {}
    return DEFAULT_PROBLEMS;
  },

  async getProblem(slug: string): Promise<Problem | null> {
    try {
      const res = await fetch(`${API_BASE}/practice/problems/${slug}`);
      if (res.ok) return await res.json();
    } catch {}
    return DEFAULT_PROBLEMS.find((p) => p.slug === slug) || null;
  },
};
