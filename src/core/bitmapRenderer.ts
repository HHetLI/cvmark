import { rotate2DPoints } from "../utils/shared";

/**
 * 位图栅格化所需的标注对象状态最小子集
 */
export interface BitmapDrawState {
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否在视图外 */
  outside?: boolean;
  /** 图形类型 */
  shapeType: string;
  /** 点数据 */
  points: number[];
  /** 旋转角度（度） */
  rotation?: number;
}

/**
 * 掩码绘制回调。掩码需要 RLE 解码并经由 OffscreenCanvas 处理，
 * 属于浏览器专用逻辑，通过该回调注入以便单元测试。
 */
export type MaskDrawHandler = (
  ctx: CanvasRenderingContext2D,
  state: BitmapDrawState
) => void;

/**
 * 把一组标注对象栅格化为二值位图（黑底 + 白色轮廓）。
 * 对应 cvat-canvas 的 redrawBitmap 逻辑：一次性批量光栅化，
 * 避免为每个对象创建一个 SVG 节点。
 *
 * @param ctx 画布 2D 上下文
 * @param states 标注对象状态列表
 * @param width 画布宽度
 * @param height 画布高度
 * @param drawMask 掩码绘制回调
 */
export function renderBitmap(
  ctx: CanvasRenderingContext2D,
  states: BitmapDrawState[],
  width: number,
  height: number,
  drawMask: MaskDrawHandler
): void {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height);

  for (const state of states) {
    if (state.hidden || state.outside) continue;
    ctx.fillStyle = "white";

    if (["rectangle", "polygon", "cuboid"].includes(state.shapeType)) {
      let points = [...state.points];
      if (state.shapeType === "rectangle") {
        points = rotate2DPoints(
          points[0] + (points[2] - points[0]) / 2,
          points[1] + (points[3] - points[1]) / 2,
          state.rotation || 0,
          [
            points[0],
            points[1],
            points[2],
            points[1],
            points[2],
            points[3],
            points[0],
            points[3],
          ]
        );
      } else if (state.shapeType === "cuboid") {
        points = [
          points[0],
          points[1],
          points[4],
          points[5],
          points[8],
          points[9],
          points[12],
          points[13],
        ];
      }

      ctx.beginPath();
      ctx.moveTo(points[0], points[1]);
      for (let i = 0; i < points.length; i += 2) {
        ctx.lineTo(points[i], points[i + 1]);
      }
      ctx.closePath();
      ctx.fill();
    }

    if (state.shapeType === "ellipse") {
      const [cx, cy, rightX, topY] = state.points;
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        rightX - cx,
        cy - topY,
        ((state.rotation || 0) * Math.PI) / 180.0,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();
    }

    if (state.shapeType === "mask") {
      drawMask(ctx, state);
    }

    if (state.shapeType === "cuboid") {
      for (let i = 0; i < 5; i++) {
        const points = [
          state.points[(0 + i * 4) % 16],
          state.points[(1 + i * 4) % 16],
          state.points[(2 + i * 4) % 16],
          state.points[(3 + i * 4) % 16],
          state.points[(6 + i * 4) % 16],
          state.points[(7 + i * 4) % 16],
          state.points[(4 + i * 4) % 16],
          state.points[(5 + i * 4) % 16],
        ];
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        for (let j = 0; j < points.length; j += 2) {
          ctx.lineTo(points[j], points[j + 1]);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}
