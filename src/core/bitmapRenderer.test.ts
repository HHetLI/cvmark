import { describe, expect, it, vi } from "vitest";
import { renderBitmap } from "./bitmapRenderer";

interface DrawnCall {
  kind:
    | "beginPath"
    | "moveTo"
    | "lineTo"
    | "closePath"
    | "fill"
    | "ellipse"
    | "drawImage"
    | "clearRect";
  args: number[];
}

function mockContext(): { ctx: CanvasRenderingContext2D; calls: DrawnCall[] } {
  const calls: DrawnCall[] = [];
  const rec =
    (kind: DrawnCall["kind"]) =>
    (...args: number[]): void => {
      calls.push({ kind, args });
    };
  const ctx = {
    imageSmoothingEnabled: false,
    fillStyle: "",
    clearRect: rec("clearRect"),
    beginPath: rec("beginPath"),
    moveTo: rec("moveTo"),
    lineTo: rec("lineTo"),
    closePath: rec("closePath"),
    fill: rec("fill"),
    ellipse: rec("ellipse"),
    drawImage: rec("drawImage"),
  } as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
}

const drawMask = vi.fn();

function kinds(calls: DrawnCall[]): string[] {
  return calls.map((c) => c.kind);
}

describe("renderBitmap", () => {
  it("clears the canvas and disables image smoothing before drawing", () => {
    const { ctx, calls } = mockContext();
    renderBitmap(ctx, [], 100, 50, drawMask);
    expect(ctx.imageSmoothingEnabled).toBe(false);
    expect(calls[0]).toEqual({ kind: "clearRect", args: [0, 0, 100, 50] });
  });

  it("skips hidden and outside objects", () => {
    const { ctx, calls } = mockContext();
    const states = [
      {
        shapeType: "polygon",
        points: [0, 0, 10, 0, 10, 10],
        hidden: true,
        outside: false,
      },
      {
        shapeType: "polygon",
        points: [0, 0, 10, 0, 10, 10],
        hidden: false,
        outside: true,
      },
    ];
    renderBitmap(ctx, states, 100, 50, drawMask);
    // no shape should have been drawn
    expect(kinds(calls).filter((k) => k === "moveTo" || k === "beginPath")).toEqual([]);
  });

  it("draws a polygon as a filled closed path", () => {
    const { ctx, calls } = mockContext();
    renderBitmap(
      ctx,
      [{ shapeType: "polygon", points: [5, 6, 7, 8, 9, 10] }],
      100,
      50,
      drawMask
    );
    const moves = calls.filter((c) => c.kind === "moveTo").map((c) => c.args);
    expect(moves).toEqual([[5, 6]]);
    // moveTo 之后会对所有点（含起点）各调一次 lineTo
    const lines = calls.filter((c) => c.kind === "lineTo").map((c) => c.args);
    expect(lines).toEqual([
      [5, 6],
      [7, 8],
      [9, 10],
    ]);
    expect(kinds(calls)).toContain("closePath");
    expect(kinds(calls)).toContain("fill");
    expect(ctx.fillStyle).toBe("white");
  });

  it("draws a rotated rectangle using six rotated points", () => {
    const { ctx, calls } = mockContext();
    renderBitmap(
      ctx,
      [{ shapeType: "rectangle", points: [2, 3, 8, 9], rotation: 0 }],
      100,
      50,
      drawMask
    );
    // rectangle expanded to 6 points: xtl,ytl / xbr,ytl / xbr,ybr / xtl,ybr / xtl,ytl
    const moves = calls.filter((c) => c.kind === "moveTo")[0].args;
    expect(moves).toEqual([2, 3]);
    const lineCount = calls.filter((c) => c.kind === "lineTo").length;
    expect(lineCount).toBe(4); // xbr,ytl ; xbr,ybr ; xtl,ybr ; back to xtl,ytl
  });

  it("draws an ellipse with center, radii and rotation", () => {
    const { ctx, calls } = mockContext();
    renderBitmap(
      ctx,
      [{ shapeType: "ellipse", points: [10, 20, 15, 12], rotation: 45 }],
      100,
      50,
      drawMask
    );
    const ellipses = calls.filter((c) => c.kind === "ellipse");
    expect(ellipses).toHaveLength(1);
    const [cx, cy, rx, ry, angle] = ellipses[0].args;
    expect(cx).toBe(10);
    expect(cy).toBe(20);
    expect(rx).toBe(15 - 10);
    expect(ry).toBe(20 - 12);
    expect(angle).toBe((45 * Math.PI) / 180);
  });

  it("skips a malformed ellipse (negative radius) without drawing", () => {
    const { ctx, calls } = mockContext();
    renderBitmap(ctx, [{ shapeType: "ellipse", points: [10, 20, 15, 25] }], 100, 50, drawMask);
    expect(calls.filter((c) => c.kind === "ellipse")).toHaveLength(0);
  });

  it("skips a cuboid with too few points without drawing", () => {
    const { ctx, calls } = mockContext();
    renderBitmap(
      ctx,
      [{ shapeType: "cuboid", points: [0, 0, 20, 0, 20, 20, 0, 20] }],
      100,
      50,
      drawMask
    );
    expect(calls.filter((c) => c.kind === "fill")).toHaveLength(0);
  });

  it("draws a cuboid as one front face plus five projected faces", () => {
    const { ctx, calls } = mockContext();
    // 16 坐标（8 点）的 cuboid
    const state = {
      shapeType: "cuboid",
      points: [
        0,
        0,
        20,
        0,
        20,
        20,
        0,
        20, // 前脸
        30,
        10,
        50,
        10,
        50,
        30,
        30,
        30, // 后脸
      ],
    };
    renderBitmap(ctx, [state], 100, 50, drawMask);
    // 前脸 1 次 fill + 5 个投影面 fill = 6
    const fills = calls.filter((c) => c.kind === "fill");
    expect(fills).toHaveLength(6);
    // 每个面都 moveTo + 4 次 lineTo + closePath
    const moveTos = calls.filter((c) => c.kind === "moveTo");
    expect(moveTos).toHaveLength(6);
  });

  it("draws the mask via the injected drawMask callback", () => {
    const { ctx } = mockContext();
    const maskState = { shapeType: "mask", points: [1, 2, 3, 4] };
    renderBitmap(ctx, [maskState], 100, 50, drawMask);
    expect(drawMask).toHaveBeenCalledTimes(1);
    expect(drawMask).toHaveBeenCalledWith(ctx, maskState);
  });
});
