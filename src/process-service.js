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
  }

  activeProcesses() {
    return [...this.active.keys()];
  }

  async run(process, action, operation) {
    const blockers = this.activeProcesses();
    if (blockers.length > 0) {
      this.logger.write(process, action, { status: "blocked", blockers });
      return { accepted: false, reason: "input-busy", blockers };
    }

    const startedAt = this.logger.clock();
    this.active.set(process, { action, startedAt });
    this.logger.write(process, action, { status: "started" });
    try {
      const result = await operation();
      this.logger.write(process, action, { status: "completed", durationMs: Math.max(0, this.logger.clock() - startedAt) });
      return { accepted: true, result };
    } catch (error) {
      this.logger.write(process, action, { status: "failed", durationMs: Math.max(0, this.logger.clock() - startedAt), error: error.message });
      throw error;
    } finally {
      this.active.delete(process);
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
