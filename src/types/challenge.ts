export type Difficulty = 'Kolay' | 'Orta' | 'Zor';

export type Category =
  | 'Diziler & Döngüler'
  | 'Nesne & Referans'
  | 'Asenkron & Promise'
  | 'Kapsam & Closure'
  | 'Tip & Mantık'
  | 'String & Veri İşleme';

export interface TestCase {
  id: string;
  description: string;
  /** Arguments passed to the target function */
  input: unknown[];
  /** Expected return value from the target function */
  expected: unknown;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: Category;
  xpReward: number;
  functionName: string;
  shortDescription: string;
  problemDescription: string;
  expectedBehavior: string;
  hint: string;
  buggyCode: string;
  solutionCode: string;
  /** Shown after solving or after revealing the solution */
  explanation: string;
  testCases: TestCase[];
}

export interface TestCaseResult {
  testCaseId: string;
  description: string;
  passed: boolean;
  inputFormatted: string;
  expectedFormatted: string;
  actualFormatted: string;
  error?: string;
  durationMs: number;
}

export interface ExecutionResult {
  success: boolean;
  allPassed: boolean;
  results: TestCaseResult[];
  logs: string[];
  runtimeError?: string;
  timedOut?: boolean;
  totalDurationMs: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  conditionText: string;
}

export interface UserProgress {
  xp: number;
  completedChallengeIds: string[];
  unlockedBadgeIds: string[];
  savedCodeByChallenge: Record<string, string>;
  revealedSolutionIds: string[];
}
