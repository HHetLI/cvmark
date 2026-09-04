import { describe, expect, it } from "vitest";
import { CanvasControllerImpl } from "./canvasController";
import { CanvasModelImpl } from "./canvasModel";
import { CanvasViewImpl } from "./canvasView";

function buildView(): {
  model: CanvasModelImpl;
  controller: CanvasControllerImpl;
  view: CanvasViewImpl;
} {
  const model = new CanvasModelImpl();
  const controller = new CanvasControllerImpl(model);
  const view = new CanvasViewImpl(model, controller);
  return { model, controller, view };
}

function bitmapEl(view: CanvasViewImpl): HTMLCanvasElement {
  const el = view.html().querySelector("#cvat_canvas_bitmap") as HTMLCanvasElement;
  expect(el).toBeTruthy();
  return el;
}

describe("CanvasViewImpl bitmap wiring", () => {
  it("creates a hidden bitmap canvas element", () => {
    const { view } = buildView();
    const el = bitmapEl(view);
    expect(el.tagName.toLowerCase()).toBe("canvas");
    expect(el.style.display).toBe("none");
  });

  it("shows the bitmap layer and re-rasterizes when bitmap is enabled", () => {
    const { model, view } = buildView();
    model.bitmap(true);
    const el = bitmapEl(view);
    expect(el.style.display).not.toBe("none");
    // 背景已被清空且处于可绘制状态
    expect(el.getContext("2d")).toBeTruthy();
  });

  it("hides the bitmap layer when bitmap is disabled", () => {
    const { model, view } = buildView();
    model.bitmap(true);
    model.bitmap(false);
    expect(bitmapEl(view).style.display).toBe("none");
  });
});
