import { describe, it, expect } from 'vitest';
import { runCodeInSandbox } from './sandboxRunner';
import { CHALLENGES } from '../data/challenges';

describe('sandboxRunner & MVP challenges', () => {
  it('contains at least 12 complete JavaScript debugging challenges', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(12);
    for (const c of CHALLENGES) {
      expect(c.title.length).toBeGreaterThan(3);
      expect(c.problemDescription.length).toBeGreaterThan(10);
      expect(c.expectedBehavior.length).toBeGreaterThan(10);
      expect(c.hint.length).toBeGreaterThan(10);
      expect(c.explanation.length).toBeGreaterThan(20);
      expect(c.testCases.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('validates that each challenge buggyCode fails and solutionCode passes all tests', async () => {
    for (const challenge of CHALLENGES) {
      const buggyOutcome = await runCodeInSandbox(
        challenge.buggyCode,
        challenge.functionName,
        challenge.testCases
      );
      expect(
        buggyOutcome.allPassed,
        `Expected buggyCode for ${challenge.id} (${challenge.title}) to fail`
      ).toBe(false);

      const solutionOutcome = await runCodeInSandbox(
        challenge.solutionCode,
        challenge.functionName,
        challenge.testCases
      );
      expect(
        solutionOutcome.allPassed,
        `Expected solutionCode for ${challenge.id} (${challenge.title}) to pass. Error: ${solutionOutcome.runtimeError ?? ''}`
      ).toBe(true);
      expect(solutionOutcome.results.every((r) => r.passed)).toBe(true);
    }
  });

  it('captures console.log output inside the worker', async () => {
    const code = `
      function add(a, b) {
        console.log("Toplama:", a, b);
        return a + b;
      }
    `;
    const res = await runCodeInSandbox(code, 'add', [
      { id: 't1', description: 'adds numbers', input: [2, 3], expected: 5 },
    ]);

    expect(res.allPassed).toBe(true);
    expect(res.logs).toContain('Toplama: 2 3');
  });

  it('returns syntax error details when code is invalid JavaScript', async () => {
    const badCode = `function broken(a, { return a; }`;
    const res = await runCodeInSandbox(badCode, 'broken', [
      { id: 't1', description: 'test', input: [1], expected: 1 },
    ]);

    expect(res.success).toBe(false);
    expect(res.allPassed).toBe(false);
    expect(res.runtimeError).toMatch(/Sözdizimi \/ Derleme Hatası/i);
  });

  it('blocks restricted APIs such as fetch inside the worker', async () => {
    const maliciousCode = `
      function tryFetch() {
        return fetch("https://example.com");
      }
    `;
    const res = await runCodeInSandbox(maliciousCode, 'tryFetch', [
      { id: 't1', description: 'should fail network call', input: [], expected: null },
    ]);

    expect(res.allPassed).toBe(false);
    expect(res.results[0].error).toMatch(/Güvenlik kısıtlaması/i);
  });

  it('terminates infinite loops when timeout is exceeded', async () => {
    const infiniteLoopCode = `
      function hang() {
        while (true) {}
        return 42;
      }
    `;
    const res = await runCodeInSandbox(
      infiniteLoopCode,
      'hang',
      [{ id: 't1', description: 'hang test', input: [], expected: 42 }],
      250
    );

    expect(res.allPassed).toBe(false);
    expect(res.timedOut).toBe(true);
    expect(res.runtimeError).toMatch(/Zaman aşımı/i);
  });
});
