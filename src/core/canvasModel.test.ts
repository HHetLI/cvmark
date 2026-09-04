import { describe, expect, it } from "vitest";
import type { Listener, Master } from "../events/master";
import { CanvasModelImpl, UpdateReasons } from "./canvasModel";

function subscribeToReasons(model: Master): string[] {
  const reasons: string[] = [];
  const listener: Listener = {
    notify(_master: Master, reason: string): void {
      reasons.push(reason);
    },
  };
  model.subscribe(listener);
  return reasons;
}

describe("CanvasModelImpl.bitmap", () => {
  it("enables bitmap and notifies BITMAP reason", () => {
    const model = new CanvasModelImpl();
    const reasons = subscribeToReasons(model);

    model.bitmap(true);

    expect(model.imageBitmap).toBe(true);
    expect(reasons).toContain(UpdateReasons.BITMAP);
  });

  it("disables bitmap and notifies BITMAP reason", () => {
    const model = new CanvasModelImpl();
    const reasons = subscribeToReasons(model);

    model.bitmap(false);

    expect(model.imageBitmap).toBe(false);
    expect(reasons).toContain(UpdateReasons.BITMAP);
  });

  it("defaults to bitmap disabled", () => {
    const model = new CanvasModelImpl();
    expect(model.imageBitmap).toBe(false);
  });
});
