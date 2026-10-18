import '@testing-library/jest-dom';
import { Worker as NodeWorker } from 'node:worker_threads';

const blobRegistry = new Map<string, string>();
let blobCounter = 0;

if (typeof URL.createObjectURL !== 'function' || process.env.VITEST) {
  URL.createObjectURL = (blob: Blob | MediaSource) => {
    const id = `blob:vitest-${++blobCounter}`;
    if (blob instanceof Blob) {
      // Synchronously read or store via private symbol if needed;
      // We also intercept Blob constructor below to capture text synchronously
      const text = (blob as unknown as { __rawText?: string }).__rawText ?? '';
      blobRegistry.set(id, text);
    }
    return id;
  };

  URL.revokeObjectURL = (url: string) => {
    blobRegistry.delete(url);
  };
}

const OriginalBlob = globalThis.Blob;
class TestBlob extends OriginalBlob {
  __rawText: string;
  constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
    super(parts, options);
    this.__rawText = (parts ?? []).map((p) => String(p)).join('');
  }
}
globalThis.Blob = TestBlob as typeof Blob;

class TestBrowserWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  private nodeWorker: NodeWorker;

  constructor(scriptUrl: string | URL) {
    const rawScript = blobRegistry.get(String(scriptUrl)) ?? '';
    const wrappedScript = `
      const { parentPort } = require('node:worker_threads');
      globalThis.self = globalThis;
      self.postMessage = (data) => parentPort.postMessage(data);
      ${rawScript}
      parentPort.on('message', (data) => {
        if (typeof self.onmessage === 'function') {
          Promise.resolve(self.onmessage({ data })).catch((err) => {
            throw err;
          });
        }
      });
    `;

    this.nodeWorker = new NodeWorker(wrappedScript, { eval: true });

    this.nodeWorker.on('message', (data) => {
      if (this.onmessage) {
        this.onmessage({ data } as MessageEvent);
      }
    });

    this.nodeWorker.on('error', (err: Error) => {
      if (this.onerror) {
        this.onerror({ message: err.message } as ErrorEvent);
      }
    });
  }

  postMessage(data: unknown) {
    this.nodeWorker.postMessage(data);
  }

  terminate() {
    void this.nodeWorker.terminate();
  }
}

globalThis.Worker = TestBrowserWorker as unknown as typeof Worker;
