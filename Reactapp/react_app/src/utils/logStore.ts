type Listener = (msg: string) => void;

const logs: string[] = [];
const listeners: Listener[] = [];

function safeStringify(obj: any) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[circular]";
      seen.add(value);
    }
    return value;
  });
}

export function captureLogs() {
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    const msg = args.map(arg => {
      if (arg instanceof HTMLElement) return "[DOM Element]";
      if (typeof arg === "object") {
        try {
          return safeStringify(arg);
        } catch {
          return "[object]";
        }
      }
      return String(arg);
    }).join(" ");

    logs.push(msg);
    listeners.forEach(fn => fn(msg));
    originalLog(...args);
  };
}

export function subscribeToLogs(fn: Listener) {
  listeners.push(fn);
}

export function unsubscribeFromLogs(fn: Listener) {
  const idx = listeners.indexOf(fn);
  if (idx >= 0) listeners.splice(idx, 1);
}

export function getLogHistory() {
  return [...logs];
}
