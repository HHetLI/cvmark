import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CanvasControllerImpl } from "./canvasController";
import { CanvasModelImpl, UpdateReasons } from "./canvasModel";
import { CanvasViewImpl } from "./canvasView";

function buildView() {
  const model = new CanvasModelImpl();
  const controller = new CanvasControllerImpl(model);
  const view = new CanvasViewImpl(model, controller);
  return { model, controller, view };
}

describe("CanvasViewImpl transform coalescing", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("defers move/zoom transform to the next animation frame", () => {
    const { model, controller, view } = buildView();
    const content = view.html().querySelector("#cvat_canvas_content") as SVGElement;
    expect(content).toBeTruthy();

    controller.geometry = {
      ...controller.geometry,
      scale: 2,
      angle: 0,
      top: 100,
      left: 100,
    };

    // 同一帧内多次更新
    view.notify(model, UpdateReasons.IMAGE_ZOOMED);
    view.notify(model, UpdateReasons.IMAGE_MOVED);
    view.notify(model, UpdateReasons.IMAGE_ZOOMED);

    // 合并后不应立即同步应用到 DOM
    expect(content.style.transform).toBe("");
    expect((content.parentElement as HTMLElement).children.length).toBeGreaterThan(0);

    vi.advanceTimersByTime(16);

    // 下一帧一次性应用最终几何
    expect(content.style.transform).toBe("scale(2) rotate(0deg)");
  });

  it("still applies the zoom transform when a move arrives last in the same frame", () => {
    const { model, controller, view } = buildView();
    const content = view.html().querySelector("#cvat_canvas_content") as SVGElement;

    controller.geometry = {
      ...controller.geometry,
      scale: 3,
      angle: 0,
      top: 40,
      left: 90,
    };

    // IMAGE_ZOOMED 先到，IMAGE_MOVED 后到——move 不能把 zoom 的 transform 吞掉
    view.notify(model, UpdateReasons.IMAGE_ZOOMED);
    view.notify(model, UpdateReasons.IMAGE_MOVED);

    vi.advanceTimersByTime(16);

    expect(content.style.transform).toBe("scale(3) rotate(0deg)");
  });
});
