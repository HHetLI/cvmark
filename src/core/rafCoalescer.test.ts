import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RafCoalescer } from "./rafCoalescer";

describe("RafCoalescer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("coalesces multiple requests in one frame, running only the last", () => {
    const c = new RafCoalescer();
    const runs: number[] = [];
    c.request(() => runs.push(1));
    c.request(() => runs.push(2));
    c.request(() => runs.push(3));
    // 同一帧内的多次请求不应立即执行
    expect(runs).toEqual([]);
    vi.advanceTimersByTime(16);
    expect(runs).toEqual([3]);
    expect(runs).toHaveLength(1);
  });

  it("runs a later request again on the following frame", () => {
    const c = new RafCoalescer();
    const runs: number[] = [];
    c.request(() => runs.push(1));
    vi.advanceTimersByTime(16);
    expect(runs).toEqual([1]);
    c.request(() => runs.push(2));
    expect(runs).toEqual([1]);
    vi.advanceTimersByTime(16);
    expect(runs).toEqual([1, 2]);
  });

  it("cancel() discards a pending request", () => {
    const c = new RafCoalescer();
    const runs: number[] = [];
    c.request(() => runs.push(1));
    c.cancel();
    vi.advanceTimersByTime(16);
    expect(runs).toEqual([]);
  });

  it("does nothing when cancel() is called with no pending request", () => {
    const c = new RafCoalescer();
    expect(() => c.cancel()).not.toThrow();
  });
});
