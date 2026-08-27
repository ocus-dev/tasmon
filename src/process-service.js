const DEFAULT_MAX_ENTRIES = 200;

export class ProcessLogger {
  constructor({ clock = Date.now, maxEntries = DEFAULT_MAX_ENTRIES } = {}) {
    this.clock = clock;
    this.maxEntries = maxEntries;
    this.entries = [];
  }

  write(process, action, fields = {}) {
    const entry = {
      at: this.clock(),
      process,
      action,
      ...fields,
    };
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) this.entries.splice(0, this.entries.length - this.maxEntries);
    return entry;
  }

  read() {
    return this.entries.map((entry) => ({ ...entry }));
  }

  clear() {
    this.entries.length = 0;
  }
}

export class InputCoordinator {
  constructor(logger) {
    this.logger = logger;
    this.active = new Map();
    this.queue = [];
    this.jobs = new Map();
  }

  activeProcesses() {
    return [...this.active.keys()];
  }

  queuedProcesses() {
    return this.queue.map(({ process }) => process);
  }

  async run(process, action, operation) {
    const key = `${process}:${action}`;
    const existing = this.jobs.get(key);
    if (existing) return existing.promise;

    const queued = this.active.size > 0 || this.queue.length > 0;
    let resolveJob;
    let rejectJob;
    const promise = new Promise((resolve, reject) => {
      resolveJob = resolve;
      rejectJob = reject;
    });
    const job = { process, action, operation, resolve: resolveJob, reject: rejectJob, promise };
    this.jobs.set(key, job);
    this.queue.push(job);
    if (queued) this.logger.write(process, action, { status: "queued", ahead: this.queue.length - 1, active: this.activeProcesses() });
    this.#drain();
    return promise;
  }

  async #drain() {
    if (this.active.size > 0) return;
    const job = this.queue.shift();
    if (!job) return;
    const { process, action, operation, resolve, reject } = job;
    const startedAt = this.logger.clock();
    this.active.set(process, { action, startedAt });
    this.logger.write(process, action, { status: "started" });
    try {
      const result = await operation();
      this.logger.write(process, action, { status: "completed", durationMs: Math.max(0, this.logger.clock() - startedAt) });
      resolve({ accepted: true, result });
    } catch (error) {
      this.logger.write(process, action, { status: "failed", durationMs: Math.max(0, this.logger.clock() - startedAt), error: error.message });
      reject(error);
    } finally {
      this.active.delete(process);
      this.jobs.delete(`${process}:${action}`);
      this.#drain();
    }
  }
}

export class InputService {
  constructor(name, coordinator) {
    this.name = name;
    this.coordinator = coordinator;
  }

  run(action, operation) {
    return this.coordinator.run(this.name, action, operation);
  }
}
