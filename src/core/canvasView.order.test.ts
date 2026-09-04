import { describe, expect, it, vi } from "vitest";
import { CanvasControllerImpl } from "./canvasController";
import { CanvasModelImpl } from "./canvasModel";
import { CanvasViewImpl } from "./canvasView";

function buildView() {
  const model = new CanvasModelImpl();
  const controller = new CanvasControllerImpl(model);
  const view = new CanvasViewImpl(model, controller);
  return { model, controller, view };
}

const states = [
  { clientID: 1, shapeType: "rectangle", points: [0, 0, 10, 10], zOrder: 1 },
  { clientID: 2, shapeType: "rectangle", points: [20, 20, 30, 30], zOrder: 2 },
];

describe("CanvasViewImpl.sortIfOrderChanged", () => {
  it("calls sortObjects only when the z-order signature changes", () => {
    const { view } = buildView();
    const sortSpy = vi.spyOn(
      view as unknown as { sortObjects: () => void },
      "sortObjects"
    );

    // 首次：初始签名不同 -> 触发排序
    (
      view as unknown as {
        sortIfOrderChanged: (s: { clientID: number; zOrder: number }[]) => void;
      }
    ).sortIfOrderChanged(states);
    expect(sortSpy).toHaveBeenCalledTimes(1);

    // 同一集合、同一 z-order -> 签名不变 -> 跳过
    (
      view as unknown as {
        sortIfOrderChanged: (s: { clientID: number; zOrder: number }[]) => void;
      }
    ).sortIfOrderChanged(states);
    expect(sortSpy).toHaveBeenCalledTimes(1);

    // 新增一个对象 -> 签名变化 -> 触发排序
    const changed = [
      ...states,
      { clientID: 3, shapeType: "rectangle", points: [0, 0, 5, 5], zOrder: 3 },
    ];
    (
      view as unknown as {
        sortIfOrderChanged: (s: { clientID: number; zOrder: number }[]) => void;
      }
    ).sortIfOrderChanged(changed);
    expect(sortSpy).toHaveBeenCalledTimes(2);
  });
});
