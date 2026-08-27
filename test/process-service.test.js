import assert from "node:assert/strict";
import test from "node:test";
import { InputCoordinator, InputService, ProcessLogger } from "../src/process-service.js";

function controlledServices() {
  let now = 100;
  const logger = new ProcessLogger({ clock: () => now, maxEntries: 8 });
  const coordinator = new InputCoordinator(logger);
  return { logger, coordinator, service: new InputService("etching", coordinator), advance: (ms) => { now += ms; } };
}

test("input services queue competing game input and preserve FIFO order", async () => {
  const { logger, coordinator, service, advance } = controlledServices();
  let release;
  const running = service.run("roll-loop", () => new Promise((resolve) => { release = resolve; }));
  const queued = new InputService("awakening", coordinator).run("ritual", async () => "runs after etching");

  assert.deepEqual(coordinator.activeProcesses(), ["etching"]);
  assert.deepEqual(coordinator.queuedProcesses(), ["awakening"]);
  release("done");
  advance(25);
  assert.deepEqual((await running).result, "done");
  assert.deepEqual((await queued).result, "runs after etching");
  assert.deepEqual(logger.read().map(({ process, action, status }) => ({ process, action, status })), [
    { process: "etching", action: "roll-loop", status: "started" },
    { process: "awakening", action: "ritual", status: "queued" },
    { process: "etching", action: "roll-loop", status: "completed" },
    { process: "awakening", action: "ritual", status: "started" },
    { process: "awakening", action: "ritual", status: "completed" },
  ]);
  assert.deepEqual(coordinator.activeProcesses(), []);
});

test("input services release ownership and log failures", async () => {
  const { logger, coordinator, service } = controlledServices();

  await assert.rejects(service.run("craft-loop", async () => { throw new Error("craft failed"); }), /craft failed/);
  assert.deepEqual(coordinator.activeProcesses(), []);
  assert.equal(logger.read().at(-1).status, "failed");
  assert.equal(logger.read().at(-1).error, "craft failed");
});

test("process logger keeps only the newest bounded entries", () => {
  const logger = new ProcessLogger({ maxEntries: 4 });
  for (let index = 0; index < 6; index += 1) logger.write("test", `action-${index}`);

  assert.deepEqual(logger.read().map((entry) => entry.action), ["action-2", "action-3", "action-4", "action-5"]);
});
