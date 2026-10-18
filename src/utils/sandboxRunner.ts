import type { ExecutionResult, TestCase } from '../types/challenge';

export const DEFAULT_TIMEOUT_MS = 2000;

/**
 * Generates the isolated Web Worker script.
 * Note: Web Workers provide thread-level and DOM/localStorage isolation,
 * not OS-level process virtualization. Network and storage APIs inside
 * the worker scope are explicitly disabled before running user code.
 */
export function buildWorkerSource(): string {
  return `
"use strict";

// 1. Lock down network, external script, and storage APIs inside Worker scope
const blockedApis = [
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "EventSource",
  "importScripts",
  "indexedDB",
  "caches",
  "BroadcastChannel"
];

for (const api of blockedApis) {
  try {
    Object.defineProperty(self, api, {
      configurable: false,
      writable: false,
      value: function () {
        throw new Error("Güvenlik kısıtlaması: '" + api + "' API erişimi test ortamında devre dışı bırakılmıştır.");
      }
    });
  } catch (_) {
    // Ignore if property is non-configurable in environment
  }
}

function formatVal(val) {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  if (typeof val === "number" && Number.isNaN(val)) return "NaN";
  if (typeof val === "function") return "[Function]";
  try {
    return JSON.stringify(val);
  } catch (_) {
    return String(val);
  }
}

function deepClone(val) {
  if (val === null || typeof val !== "object") return val;
  if (Array.isArray(val)) return val.map(deepClone);
  const copy = {};
  for (const key of Object.keys(val)) {
    copy[key] = deepClone(val[key]);
  }
  return copy;
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null || typeof a !== "object") return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

self.onmessage = async function (event) {
  const { code, functionName, testCases } = event.data;
  const logs = [];
  const startTotal = Date.now();

  const pushLog = (prefix, args) => {
    if (logs.length >= 50) return;
    const text = args.map((item) => (typeof item === "string" ? item : formatVal(item))).join(" ");
    logs.push(prefix ? "[" + prefix + "] " + text : text);
  };

  const customConsole = {
    log: (...args) => pushLog("", args),
    info: (...args) => pushLog("INFO", args),
    warn: (...args) => pushLog("WARN", args),
    error: (...args) => pushLog("ERROR", args)
  };

  let targetFn;
  try {
    // Compile inside the isolated Worker thread only
    const factory = self.Function(
      "console",
      "window",
      "document",
      "localStorage",
      "sessionStorage",
      '"use strict";\\n' +
        code +
        "\\n;return typeof " +
        functionName +
        ' !== "undefined" ? ' +
        functionName +
        " : undefined;"
    );
    targetFn = factory(customConsole, undefined, undefined, undefined, undefined);
  } catch (err) {
    self.postMessage({
      success: false,
      allPassed: false,
      results: [],
      logs,
      runtimeError: "Sözdizimi / Derleme Hatası: " + (err && err.message ? err.message : String(err)),
      totalDurationMs: Date.now() - startTotal
    });
    return;
  }

  if (typeof targetFn !== "function") {
    self.postMessage({
      success: false,
      allPassed: false,
      results: [],
      logs,
      runtimeError:
        "'" +
        functionName +
        "' isimli fonksiyon bulunamadı. Lütfen fonksiyon adını değiştirmeyin.",
      totalDurationMs: Date.now() - startTotal
    });
    return;
  }

  const results = [];
  let allPassed = true;

  for (const tc of testCases) {
    const tcStart = Date.now();
    const clonedInput = deepClone(tc.input);
    const inputFormatted = clonedInput.map(formatVal).join(", ");
    const expectedFormatted = formatVal(tc.expected);

    try {
      const rawOutput = targetFn(...clonedInput);
      const actual = rawOutput && typeof rawOutput.then === "function" ? await rawOutput : rawOutput;
      const passed = deepEqual(actual, tc.expected);
      if (!passed) allPassed = false;

      results.push({
        testCaseId: tc.id,
        description: tc.description,
        passed,
        inputFormatted,
        expectedFormatted,
        actualFormatted: formatVal(actual),
        durationMs: Date.now() - tcStart
      });
    } catch (err) {
      allPassed = false;
      results.push({
        testCaseId: tc.id,
        description: tc.description,
        passed: false,
        inputFormatted,
        expectedFormatted,
        actualFormatted: "Hata fırlatıldı",
        error: err && err.message ? err.message : String(err),
        durationMs: Date.now() - tcStart
      });
    }
  }

  self.postMessage({
    success: true,
    allPassed,
    results,
    logs,
    totalDurationMs: Date.now() - startTotal
  });
};
`;
}

/**
 * Runs user code against test cases inside a short-lived Web Worker
 * with a strict execution timeout.
 */
export function runCodeInSandbox(
  code: string,
  functionName: string,
  testCases: TestCase[],
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const workerSource = buildWorkerSource();
    const blob = new Blob([workerSource], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);

    let worker: Worker;
    try {
      worker = new Worker(workerUrl);
    } catch (err) {
      URL.revokeObjectURL(workerUrl);
      resolve({
        success: false,
        allPassed: false,
        results: [],
        logs: [],
        runtimeError:
          'Web Worker başlatılamadı: ' + (err instanceof Error ? err.message : String(err)),
        totalDurationMs: Date.now() - startTime,
      });
      return;
    }

    let settled = false;

    const cleanup = () => {
      try {
        worker.terminate();
      } catch (_) {
        // Ignore termination errors
      }
      try {
        URL.revokeObjectURL(workerUrl);
      } catch (_) {
        // Ignore URL revoke errors
      }
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({
        success: false,
        allPassed: false,
        results: [],
        logs: [],
        timedOut: true,
        runtimeError: `Zaman aşımı (${timeoutMs}ms): Kodunuz sonsuz döngüye girmiş veya izin verilen süreyi aşmış olabilir.`,
        totalDurationMs: Date.now() - startTime,
      });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<ExecutionResult>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve(event.data);
    };

    worker.onerror = (event: ErrorEvent) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve({
        success: false,
        allPassed: false,
        results: [],
        logs: [],
        runtimeError: event.message || 'Çalışma zamanı hatası oluştu.',
        totalDurationMs: Date.now() - startTime,
      });
    };

    worker.postMessage({
      code,
      functionName,
      testCases,
    });
  });
}
