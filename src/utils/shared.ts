import * as SVG from "svg.js";

import consts from "../consts/consts";

export function intersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  // Check if none of the lines are of length 0
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const { x: x3, y: y3 } = p3;
  const { x: x4, y: y4 } = p4;

  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return null;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (Math.abs(denominator) < Number.EPSILON) {
    return null;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;

  // Return a object with the x and y coordinates of the intersection
  return { x: x1 + ua * (x2 - x1), y: y1 + ua * (y2 - y1) };
}

/**
 * 形状大小元素接口
 * 用于管理SVG形状的大小显示和更新
 */
export interface ShapeSizeElement {
  /** 大小显示元素，通常为文本对象 */
  sizeElement: any;
  /** 更新形状大小显示的方法 */
  update(shape: SVG.Shape): void;
  /** 移除大小显示元素的方法 */
  rm(): void;
}

/**
 * 边界框接口
 * 表示矩形区域的左上角和右下角坐标
 */
export interface Box {
  /** 左上角X坐标 */
  xtl: number;
  /** 左上角Y坐标 */
  ytl: number;
  /** 右下角X坐标 */
  xbr: number;
  /** 右下角Y坐标 */
  ybr: number;
}

/**
 * 边界框接口
 * 表示矩形区域的位置和尺寸
 */
export interface BBox {
  /** 矩形宽度 */
  width: number;
  /** 矩形高度 */
  height: number;
  /** 左上角X坐标 */
  x: number;
  /** 左上角Y坐标 */
  y: number;
}

/**
 * 点坐标接口
 * 表示二维空间中的一个点
 */
export interface Point {
  /** X坐标 */
  x: number;
  /** Y坐标 */
  y: number;
}

/**
 * 二维向量接口
 * 表示二维空间中的向量
 */
interface Vector2D {
  /** 向量在X轴方向的分量 */
  i: number;
  /** 向量在Y轴方向的分量 */
  j: number;
}

/**
 * 表示画布上绘制对象的状态信息
 * 包含对象的位置、外观、属性和元数据等完整信息
 */
export interface DrawnState {
  /** 客户端分配的唯一标识符，用于区分不同的绘制对象 */
  clientID: number;
  /** 标记对象是否在画布边界外，用于处理部分可见的对象 */
  outside?: boolean;
  /** 标记对象是否被其他对象遮挡，影响渲染优先级 */
  occluded?: boolean;
  /** 标记对象是否隐藏，控制对象的可见性 */
  hidden?: boolean;
  /** 标记对象是否被锁定，锁定后不可编辑 */
  lock: boolean;
  /** 对象来源：自动创建、半自动、手动、文件导入或共识结果 */
  source: "AUTO" | "SEMI-AUTO" | "MANUAL" | "FILE" | "CONSENSUS";
  /** 对象形状类型，如矩形、多边形、点等 */
  shapeType: string;
  /** 构成形状的点坐标数组，用于多边形、折线等形状 */
  points?: number[];
  /** 对象的旋转角度（度数） */
  rotation: number;
  /** 对象的属性集合，键为属性ID，值为属性值 */
  attributes: Record<number, string>;
  /** 对象的描述文本列表 */
  descriptions: string[];
  /** 对象的Z轴顺序，控制渲染层级 */
  zOrder?: number;
  /** 标记对象是否被固定，固定后不会被意外移动 */
  pinned?: boolean;
  /** 最后更新时间戳，用于同步和冲突检测 */
  updated: number;
  /** 对象所属的帧号，用于视频序列标注 */
  frame: number;
  /** 对象关联的标签信息 */
  label: any;
  /** 对象所属的组信息 */
  group: any;
  /** 对象显示的颜色 */
  color: string;
  /** 子元素列表，用于组合对象或复杂形状 */
  elements: DrawnState[] | null;
}

/**
 * 将点数组从SVG画布坐标系转换到客户端坐标系
 * @param svg SVG元素，用于获取坐标转换矩阵
 * @param points 点坐标数组，格式为[x1, y1, x2, y2, ...]
 * @returns 转换后的点坐标数组
 */
export function translateFromSVG(svg: SVGSVGElement, points: number[]): number[] {
  // 初始化输出数组
  const output = [];
  // 获取SVG元素的屏幕坐标转换矩阵
  const transformationMatrix = svg.getScreenCTM() as DOMMatrix;
  // 创建SVG点对象，用于坐标转换
  let pt = svg.createSVGPoint();
  // 遍历点数组，每次处理一对坐标(x, y)
  for (let i = 0; i < points.length - 1; i += 2) {
    // 设置点的坐标
    pt.x = points[i];
    pt.y = points[i + 1];
    // 应用坐标转换矩阵
    pt = pt.matrixTransform(transformationMatrix);
    // 将转换后的坐标添加到输出数组
    output.push(pt.x, pt.y);
  }

  return output;
}

/**
 * 将点数组从客户端坐标系转换到SVG画布坐标系
 * @param svg SVG元素，用于获取坐标转换矩阵
 * @param points 点坐标数组，格式为[x1, y1, x2, y2, ...]
 * @returns 转换后的点坐标数组
 */
export function translateToSVG(svg: SVGSVGElement, points: number[]): number[] {
  // 初始化输出数组
  const output = [];
  // 获取SVG元素的屏幕坐标转换矩阵的逆矩阵
  const transformationMatrix = (svg.getScreenCTM() as DOMMatrix).inverse();
  // 创建SVG点对象，用于坐标转换
  let pt = svg.createSVGPoint();
  // 遍历点数组，每次处理一对坐标(x, y)
  for (let i = 0; i < points.length; i += 2) {
    // 设置点的坐标
    pt.x = points[i];
    pt.y = points[i + 1];
    // 应用逆坐标转换矩阵
    pt = pt.matrixTransform(transformationMatrix);
    // 将转换后的坐标添加到输出数组
    output.push(pt.x, pt.y);
  }

  return output;
}

/**
 * 组合形状尺寸信息为字符串
 * @param width 形状宽度
 * @param height 形状高度
 * @param rotation 形状旋转角度（度数），可为null
 * @returns 格式化的尺寸字符串，如"100.0x200.0px 45.0°"
 */
export function composeShapeDimensions(
  width: number,
  height: number,
  rotation: number | null
): string {
  // 创建基本尺寸文本
  const text = `${width.toFixed(1)}x${height.toFixed(1)}px`;
  // 创建可调整的旋转角度变量
  let adjustableRotation = rotation;
  // 如果有旋转角度
  if (adjustableRotation) {
    // 确保旋转角度在[0, 360]范围内
    while (adjustableRotation < 0) {
      adjustableRotation += 360;
    }
    // 使用模运算确保角度不超过360
    adjustableRotation %= 360;
    // 返回包含旋转角度的完整尺寸文本
    return `${text} ${adjustableRotation.toFixed(1)}\u00B0`;
  }

  // 如果没有旋转角度，只返回基本尺寸文本
  return text;
}

/**
 * 获取形状的旋转角度并进行四舍五入处理
 * @param shape SVG形状对象
 * @param defaultValue 默认旋转角度，当形状没有旋转时使用
 * @returns 四舍五入到小数点后5位的旋转角度
 */
export function getRoundedRotation(shape: SVG.Shape, defaultValue: number = 0): number {
  // 获取形状的旋转角度，如果没有则使用默认值
  const rotation = shape.transform().rotation ?? defaultValue;
  // 由于浮点数运算的精度问题，旋转值可能会被错误更新
  // 即使实际上没有旋转发生
  // 例如，一次调用可能是16.000000000000014
  // 下一次调用可能是16.00000000000003
  // 这可能导致其他问题，所以我们将该值四舍五入到小数点后5位
  return +rotation.toFixed(5);
}

/**
 * 创建并返回一个形状大小显示元素，用于在SVG画布上显示形状的尺寸信息
 * @param shapesContainer 形状容器，用于获取形状的坐标信息
 * @param textContainer 文本容器，用于显示尺寸文本
 * @returns 形状大小元素对象，包含更新和移除方法
 */
export function displayShapeSize(
  shapesContainer: SVG.Container,
  textContainer: SVG.Container
): ShapeSizeElement {
  // 创建形状大小元素对象
  const shapeSize: ShapeSizeElement = {
    // 创建文本元素并设置样式
    sizeElement: textContainer
      .text("") // 初始化为空文本
      .font({
        weight: "bolder", // 设置字体加粗
      })
      .fill("white") // 设置填充颜色为白色
      .addClass("cvat_canvas_text"), // 添加CSS类名
    // 更新形状大小显示的方法
    update(shape: SVG.Shape): void {
      // 获取形状的旋转角度，仅对矩形和椭圆形状有效
      const rotation =
        shape.type === "rect" || shape.type === "ellipse"
          ? getRoundedRotation(shape)
          : null;
      // 组合形状尺寸信息为文本
      const text = composeShapeDimensions(shape.width(), shape.height(), rotation);
      // 将形状坐标从形状容器坐标系转换到文本容器坐标系
      const [x, y, cx, cy]: number[] = translateToSVG(
        textContainer.node as any as SVGSVGElement,
        translateFromSVG(shapesContainer.node as any as SVGSVGElement, [
          shape.x(), // 形状左上角X坐标
          shape.y(), // 形状左上角Y坐标
          shape.cx(), // 形状中心X坐标
          shape.cy(), // 形状中心Y坐标
        ])
      ).map((coord: number): number => Math.round(coord)); // 四舍五入取整
      // 更新文本元素的内容、位置和旋转
      this.sizeElement
        .clear() // 清除现有内容
        .plain(text) // 设置新文本内容
        .move(x + consts.TEXT_MARGIN, y + consts.TEXT_MARGIN) // 移动到指定位置，添加边距
        .rotate(rotation ?? 0, cx, cy); // 应用旋转，以形状中心为旋转点
    },
    // 移除大小显示元素的方法
    rm(): void {
      // 如果大小元素存在
      if (this.sizeElement) {
        // 从DOM中移除元素
        this.sizeElement.remove();
        // 将引用设为null
        this.sizeElement = null;
      }
    },
  };

  return shapeSize;
}

/**
 * 将二维点数组绕指定中心点旋转指定角度
 * @param cx 旋转中心点的X坐标
 * @param cy 旋转中心点的Y坐标
 * @param angle 旋转角度（度数）
 * @param points 点坐标数组，格式为[x1, y1, x2, y2, ...]
 * @returns 旋转后的点坐标数组
 */
export function rotate2DPoints(
  cx: number,
  cy: number,
  angle: number,
  points: number[]
): number[] {
  // 将角度转换为弧度
  const rad = (Math.PI / 180) * angle;
  // 计算余弦值
  const cos = Math.cos(rad);
  // 计算正弦值
  const sin = Math.sin(rad);
  // 初始化结果数组
  const result = [];
  // 遍历点数组，每次处理一对坐标(x, y)
  for (let i = 0; i < points.length; i += 2) {
    // 获取当前点的坐标
    const x = points[i];
    const y = points[i + 1];
    // 应用二维旋转公式并添加到结果数组
    result.push(
      (x - cx) * cos - (y - cy) * sin + cx, // 旋转后的X坐标
      (y - cy) * cos + (x - cx) * sin + cy // 旋转后的Y坐标
    );
  }

  return result;
}

/**
 * 将点数据转换为数字数组
 * @param points 点数据，可以是Point对象数组或字符串
 * @returns 数字数组，格式为[x1, y1, x2, y2, ...]
 */
export function pointsToNumberArray(points: string | Point[]): number[] {
  // 如果输入是Point对象数组
  if (Array.isArray(points)) {
    // 将Point对象数组转换为数字数组
    return points.reduce((acc: number[], point: Point): number[] => {
      // 将每个点的x和y坐标添加到累加器
      acc.push(point.x, point.y);
      return acc;
    }, []);
  }

  // 如果输入是字符串，按逗号或空白字符分割并转换为数字
  return points
    .trim() // 去除首尾空白
    .split(/[,\s]+/g) // 按逗号或空白字符分割
    .map((coord: string): number => +coord); // 将字符串转换为数字
}

/**
 * 将点数据解析为Point对象数组
 * @param source 点数据源，可以是数字数组或字符串
 * @returns Point对象数组
 */
export function parsePoints(source: string | number[]): Point[] {
  // 如果输入是数字数组
  if (Array.isArray(source)) {
    // 将数字数组转换为Point对象数组
    return source.reduce((acc: Point[], _: number, index: number): Point[] => {
      // 只处理偶数索引（每对坐标的第二个元素）
      if (index % 2) {
        // 创建Point对象并添加到累加器
        acc.push({
          x: source[index - 1], // 前一个元素是X坐标
          y: source[index], // 当前元素是Y坐标
        });
      }

      return acc;
    }, []);
  }

  // 如果输入是字符串，按空白字符分割并转换为Point对象
  return source
    .trim() // 去除首尾空白
    .split(/\s/) // 按空白字符分割
    .map((point: string): Point => {
      // 将每个点字符串按逗号分割并转换为数字
      const [x, y] = point.split(",").map((coord: string): number => +coord);
      // 返回Point对象
      return { x, y };
    });
}

/**
 * 从SVG形状中读取点数据并转换为数字数组
 * @param shape - SVG形状对象，可以是椭圆、矩形、圆形或其他形状
 * @returns 返回包含形状点坐标的数字数组
 */
export function readPointsFromShape(shape: SVG.Shape): number[] {
  // 初始化点数据变量
  let points = null;

  // 根据形状类型提取点数据
  if (shape.type === "ellipse") {
    // 对于椭圆，获取半径和中心点坐标
    const [rx, ry] = [+shape.attr("rx"), +shape.attr("ry")]; // 获取x和y半径
    const [cx, cy] = [shape.cx(), shape.cy()]; // 获取中心点坐标
    // 创建椭圆上的两个点：中心点和右上边缘点
    points = `${cx},${cy} ${cx + rx},${cy - ry}`;
  } else if (shape.type === "rect") {
    // 对于矩形，获取左上角和右下角坐标
    points =
      `${shape.attr("x")},${shape.attr("y")} ` + // 左上角坐标
      `${shape.attr("x") + shape.attr("width")},${shape.attr("y") + shape.attr("height")}`; // 右下角坐标
  } else if (shape.type === "circle") {
    // 对于圆形，获取中心点坐标
    points = `${shape.cx()},${shape.cy()}`;
  } else {
    // 对于其他形状，直接获取points属性
    points = shape.attr("points");
  }

  // 将点数据转换为数字数组并返回
  return pointsToNumberArray(points);
}

/**
 * 将点数据转换为字符串格式
 * 支持多种输入类型：数字数组、Point对象数组或混合数组
 * @param points - 点数据，可以是数字数组、Point对象数组或混合数组
 * @returns 返回格式化为"x1,y1 x2,y2 ..."的字符串
 */
export function stringifyPoints(points: number[]): string;
export function stringifyPoints(points: Point[]): string;
export function stringifyPoints(points: (Point | number)[]): string {
  // 检查第一个元素的类型以确定输入格式
  if (typeof points[0] === "number") {
    // 处理数字数组格式 [x1, y1, x2, y2, ...]
    return (points as number[]).reduce(
      (acc: string, val: number, idx: number): string => {
        // 如果是奇数索引（y坐标），添加逗号分隔符
        if (idx % 2) {
          return `${acc},${val}`;
        }
        // 如果是偶数索引（x坐标），添加空格分隔符
        return `${acc} ${val}`.trim();
      },
      ""
    );
  }
  // 处理Point对象数组格式 [{x: x1, y: y1}, {x: x2, y: y2}, ...]
  return (points as Point[])
    .map((point: Point): string => `${point.x},${point.y}`)
    .join(" ");
}

/**
 * 将数值限制在指定范围内
 * @param x - 要限制的数值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 返回被限制在min和max之间的值
 */
export function clamp(x: number, min: number, max: number): number {
  // 使用Math.max确保x不小于min，然后使用Math.min确保结果不大于max
  return Math.min(Math.max(x, min), max);
}

/**
 * 计算两个二维向量的标量积（点积）
 * @param a - 第一个二维向量
 * @param b - 第二个二维向量
 * @returns 返回两个向量的标量积
 */
export function scalarProduct(a: Vector2D, b: Vector2D): number {
  // 标量积公式：a·b = a.i * b.i + a.j * b.j
  return a.i * b.i + a.j * b.j;
}

/**
 * 计算二维向量的长度（模）
 * @param vector - 要计算长度的二维向量
 * @returns 返回向量的长度
 */
export function vectorLength(vector: Vector2D): number {
  // 计算各分量的平方
  const sqrI = vector.i ** 2; // i分量的平方
  const sqrJ = vector.j ** 2; // j分量的平方
  // 使用勾股定理计算向量长度：|v| = sqrt(i² + j²)
  return Math.sqrt(sqrI + sqrJ);
}

/**
 * 将点坐标转换为画布坐标系
 * 通过给所有坐标添加偏移量来实现坐标转换
 * @param offset - 坐标偏移量
 * @param points - 原始点坐标数组
 * @returns 返回转换后的点坐标数组
 */
export function translateToCanvas(offset: number, points: number[]): number[] {
  // 使用map函数遍历所有坐标点，给每个坐标添加偏移量
  return points.map((coord: number): number => coord + offset);
}

/**
 * 将画布坐标系中的点坐标转换为原始坐标系
 * 通过从所有坐标中减去偏移量来实现坐标转换
 * @param offset - 坐标偏移量
 * @param points - 画布坐标系中的点坐标数组
 * @returns 返回转换后的原始坐标系点坐标数组
 */
export function translateFromCanvas(offset: number, points: number[]): number[] {
  // 使用map函数遍历所有坐标点，从每个坐标中减去偏移量
  return points.map((coord: number): number => coord - offset);
}

/**
 * 计算包含所有点的最小包围框
 * 可以选择添加边距以扩大包围框
 * @param points - 点坐标数组，格式为[x1, y1, x2, y2, ...]
 * @param margin - 可选的边距值，默认为0
 * @returns 返回包含Box和BBox接口属性的对象
 */
export function computeWrappingBox(points: number[], margin = 0): Box & BBox {
  // 初始化边界值为极值，确保任何实际点都会更新这些值
  let xtl = Number.MAX_SAFE_INTEGER; // 左上角x坐标初始值设为最大值
  let ytl = Number.MAX_SAFE_INTEGER; // 左上角y坐标初始值设为最大值
  let xbr = Number.MIN_SAFE_INTEGER; // 右下角x坐标初始值设为最小值
  let ybr = Number.MIN_SAFE_INTEGER; // 右下角y坐标初始值设为最小值

  // 遍历所有点，更新边界值
  for (let i = 0; i < points.length; i += 2) {
    // 提取当前点的x和y坐标
    const [x, y] = [points[i], points[i + 1]];
    // 更新最小值
    xtl = Math.min(xtl, x);
    ytl = Math.min(ytl, y);
    // 更新最大值
    xbr = Math.max(xbr, x);
    ybr = Math.max(ybr, y);
  }

  // 创建Box对象，考虑边距
  const box = {
    xtl: xtl - margin, // 左上角x坐标减去边距
    ytl: ytl - margin, // 左上角y坐标减去边距
    xbr: xbr + margin, // 右下角x坐标加上边距
    ybr: ybr + margin, // 右下角y坐标加上边距
  };

  // 返回同时包含Box和BBox属性的对象
  return {
    ...box,
    x: box.xtl, // BBox的x坐标等于Box的左上角x坐标
    y: box.ytl, // BBox的y坐标等于Box的左上角y坐标
    width: box.xbr - box.xtl, // 宽度等于右下角x坐标减去左上角x坐标
    height: box.ybr - box.ytl, // 高度等于右下角y坐标减去左上角y坐标
  };
}

/**
 * 获取骨架边缘的坐标
 * 根据连接的节点位置计算边缘线的起点和终点坐标
 * @param edge - SVG线条元素，表示骨架的边缘
 * @returns 返回包含起点和终点坐标的对象 {x1, y1, x2, y2}
 */
export function getSkeletonEdgeCoordinates(edge: SVG.Line): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} {
  // 初始化坐标变量
  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;

  // 获取边缘元素的父元素（应该是一个组元素）
  const parent = edge.parent() as any as SVG.G;
  // 验证父元素类型
  if (parent.type !== "g") {
    throw new Error("Edge parent must be a group");
  }

  // 获取边缘连接的起始节点和结束节点的ID
  const dataNodeFrom = edge.attr("data-node-from");
  const dataNodeTo = edge.attr("data-node-to");

  // 在父元素的子元素中查找对应的节点
  const nodeFrom = parent
    .children()
    .find(
      (element: SVG.Element): boolean => element.attr("data-node-id") === dataNodeFrom
    );
  const nodeTo = parent
    .children()
    .find((element: SVG.Element): boolean => element.attr("data-node-id") === dataNodeTo);

  // 验证节点是否存在
  if (!nodeFrom || !nodeTo) {
    throw new Error(
      `Edge's nodeFrom ${dataNodeFrom} or nodeTo ${dataNodeTo} do not to refer to any node`
    );
  }

  // 获取起始节点的中心坐标
  x1 = nodeFrom.cx();
  y1 = nodeFrom.cy();
  // 获取结束节点的中心坐标
  x2 = nodeTo.cx();
  y2 = nodeTo.cy();

  // 如果任一节点被隐藏，则隐藏边缘线
  if (nodeFrom.hasClass("cvat_canvas_hidden") || nodeTo.hasClass("cvat_canvas_hidden")) {
    edge.addClass("cvat_canvas_hidden");
  } else {
    edge.removeClass("cvat_canvas_hidden");
  }

  // 如果任一节点被遮挡，则标记边缘线为遮挡状态
  if (
    nodeFrom.hasClass("cvat_canvas_shape_occluded") ||
    nodeTo.hasClass("cvat_canvas_shape_occluded")
  ) {
    edge.addClass("cvat_canvas_shape_occluded");
  }

  // 验证坐标值是否为有效数字
  if ([x1, y1, x2, y2].some((coord: number): boolean => typeof coord !== "number")) {
    throw new Error(`Edge coordinates must be numbers, got [${x1}, ${y1}, ${x2}, ${y2}]`);
  }

  // 返回边缘线的起点和终点坐标
  return {
    x1,
    y1,
    x2,
    y2,
  };
}

/**
 * 从HTML模板创建SVG组元素
 * 使用提供的HTML字符串模板创建SVG.G元素
 * @param template - HTML字符串模板，包含SVG元素的定义
 * @returns 返回创建的SVG组元素
 */
export function makeSVGFromTemplate(template: string): SVG.G {
  // 创建一个新的SVG组元素
  const SVGElement = new SVG.G();
  // 将HTML模板内容设置为组元素的innerHTML
  // 注意：这里使用了no-unsanitized/property禁用ESLint规则，因为我们信任模板来源
  SVGElement.node.innerHTML = template;
  // 返回创建的SVG组元素
  return SVGElement;
}

/**
 * 设置骨架边缘
 * 根据参考SVG中的边缘定义，在骨架SVG中创建或更新对应的边缘线条
 * @param skeleton - 目标骨架SVG组元素，将在此元素中创建或更新边缘
 * @param referenceSVG - 参考SVG组元素，包含边缘定义的模板
 */
export function setupSkeletonEdges(skeleton: SVG.G, referenceSVG: SVG.G): void {
  // 遍历参考SVG中的所有子元素
  for (const child of referenceSVG.children()) {
    // 搜索模板中的所有边缘
    const dataType = child.attr("data-type");
    // 检查是否为线条类型的边缘元素
    if (child.type === "line" && dataType === "edge") {
      // 获取边缘连接的起始节点和结束节点ID
      const dataNodeFrom = child.attr("data-node-from");
      const dataNodeTo = child.attr("data-node-to");
      // 验证节点ID是否为整数
      if (!Number.isInteger(dataNodeFrom) || !Number.isInteger(dataNodeTo)) {
        throw new Error(
          `Edge nodeFrom and nodeTo must be numbers, got ${dataNodeFrom}, ${dataNodeTo}`
        );
      }

      // 尝试在骨架中找到相同的边缘
      let edge = skeleton
        .children()
        .find(
          (_child: SVG.Element) =>
            _child.attr("data-node-from") === dataNodeFrom &&
            _child.attr("data-node-to") === dataNodeTo
        ) as SVG.Line;

      // 如果未找到，则创建新的边缘线条
      if (!edge) {
        edge = skeleton
          .line(0, 0, 0, 0)
          .attr({
            "data-node-from": dataNodeFrom,
            "data-node-to": dataNodeTo,
            "stroke-width": "inherit", // 继承父元素的线宽
          })
          .addClass("cvat_canvas_skeleton_edge") as SVG.Line;
      }

      // 将边缘线条添加到骨架的前面（确保在其他元素之下）
      skeleton.node.prepend(edge.node);
      // 获取边缘的坐标点
      const points = getSkeletonEdgeCoordinates(edge);
      // 更新边缘线条的坐标和线宽
      edge.attr({ ...points, "stroke-width": "inherit" });
    }
  }
}

/**
 * 将图像数据转换为数据URL
 * 创建一个临时canvas，将图像数据绘制到canvas上，然后转换为数据URL
 * @param imageBitmap - 图像位图数据，Uint8ClampedArray格式
 * @param width - 图像宽度
 * @param height - 图像高度
 * @param handleResult - 处理结果数据的回调函数，接收数据URL作为参数
 */
export function imageDataToDataURL(
  imageBitmap: Uint8ClampedArray,
  width: number,
  height: number,
  handleResult: (dataURL: string) => Promise<void>
): void {
  // 创建一个临时canvas元素
  const canvas = document.createElement("canvas");
  // 设置canvas的尺寸
  canvas.width = width;
  canvas.height = height;

  // 将图像数据绘制到canvas上
  const context = canvas.getContext("2d");
  if (context === null) throw new Error("Failed to get canvas 2d context");
  context.putImageData(
    new ImageData(new Uint8ClampedArray(imageBitmap), width, height),
    0,
    0
  );

  // 将canvas内容转换为blob对象
  canvas.toBlob((blob) => {
    // 从blob对象创建数据URL
    if (blob === null) throw new Error("Failed to create blob");
    const dataURL = URL.createObjectURL(blob);
    // 调用回调函数处理数据URL
    handleResult(dataURL).finally(() => {
      // 处理完成后释放数据URL资源
      URL.revokeObjectURL(dataURL);
    });
  }, "image/png"); // 指定输出格式为PNG
}

/**
 * 压缩图像通道数据
 * 使用游程编码(RLE)算法压缩图像的alpha通道数据
 * @param imageData - 图像数据，Uint8ClampedArray格式，包含RGBA四个通道
 * @returns 返回压缩后的RLE编码数组
 */
export function zipChannels(imageData: Uint8ClampedArray): number[] {
  // 初始化RLE编码数组
  const rle = [];

  // 初始化前一个alpha值和计数器
  let prev = 0; // 前一个alpha值，初始为0
  let summ = 0; // 计数器，记录相同alpha值的连续像素数

  // 遍历图像数据，每次处理一个像素(4个字节)
  for (let i = 3; i < imageData.length; i += 4) {
    // 获取当前像素的alpha通道值，大于0则为1，否则为0
    const alpha = imageData[i] > 0 ? 1 : 0;
    // 如果当前alpha值与前一个值不同
    if (prev !== alpha) {
      // 将当前计数器的值添加到RLE数组
      rle.push(summ);
      // 更新前一个alpha值
      prev = alpha;
      // 重置计数器为1（当前像素）
      summ = 1;
    } else {
      // 如果相同，增加计数器
      summ++;
    }
  }

  // 将最后一个计数器的值添加到RLE数组
  rle.push(summ);
  return rle;
}

/**
 * 展开压缩的通道数据
 * 将RLE编码的alpha通道数据解码为完整的图像数据
 * @param r - 红色通道值 (0-255)
 * @param g - 绿色通道值 (0-255)
 * @param b - 蓝色通道值 (0-255)
 * @param encoded - RLE编码的alpha通道数据，最后四个元素为边界值[left, top, right, bottom]
 * @returns 返回解码后的图像数据，Uint8ClampedArray格式，包含RGBA四个通道
 */
export function expandChannels(
  r: number,
  g: number,
  b: number,
  encoded: number[]
): Uint8ClampedArray {
  /**
   * 内部函数：将RLE编码解码为图像掩码
   * @param rle - RLE编码数组
   * @param width - 图像宽度
   * @param height - 图像高度
   * @returns 返回解码后的图像数据
   */
  function rle2Mask(rle: number[], width: number, height: number): Uint8ClampedArray {
    // 创建并初始化解码后的图像数据数组，全部填充为0
    const decoded = new Uint8ClampedArray(width * height * 4).fill(0);
    const { length } = rle;
    let decodedIdx = 0; // 解码数组的当前索引
    let value = 0; // 当前alpha值 (0或1)
    let i = 0; // RLE数组的当前索引

    // 遍历RLE编码数组，最后4个元素是边界值，不需要处理
    while (i < length - 4) {
      // 获取当前RLE值，表示连续相同alpha值的像素数
      let count = rle[i];
      // 为每个像素设置颜色值
      while (count > 0) {
        // 设置RGB通道值
        decoded[decodedIdx + 0] = r; // 红色通道
        decoded[decodedIdx + 1] = g; // 绿色通道
        decoded[decodedIdx + 2] = b; // 蓝色通道
        // 设置alpha通道值 (0或255)
        decoded[decodedIdx + 3] = value * 255; // alpha通道
        // 移动到下一个像素
        decodedIdx += 4;
        count--;
      }
      // 移动到下一个RLE值
      i++;
      // 切换alpha值 (0变为1，1变为0)
      value = Math.abs(value - 1);
    }

    return decoded;
  }

  // 从编码数组中提取边界值 [left, top, right, bottom]
  const [left, top, right, bottom] = encoded.slice(-4);
  // 调用内部函数解码RLE数据，计算图像的宽度和高度
  return rle2Mask(encoded, right - left + 1, bottom - top + 1);
}

/**
 * 查找两条线段的交点
 * 使用行列式方法计算两条线段的交点，考虑平行、重合和相交等情况
 * @param seg1 - 第一条线段，由两个点组成的数组 [[x1, y1], [x2, y2]]
 * @param seg2 - 第二条线段，由两个点组成的数组 [[x3, y3], [x4, y4]]
 * @returns 返回交点坐标[x, y]，如果线段平行则返回null，如果重合则返回[NaN, NaN]
 */
export function findIntersection(seg1: Segment, seg2: Segment): [number, number] | null {
  // 计算二维行列式
  const determinant2D = (a: number, b: number, c: number, d: number): number =>
    a * d - b * c;
  // 检查数字是否在两个数之间
  const numberIsBetween = (a: number, b: number, c: number): boolean =>
    Math.min(a, b) <= c && c <= Math.max(a, b);
  // 检查两个投影区间是否相交
  const projectionIntersected = (a: number, b: number, c: number, d: number): boolean => {
    let [p1, p2] = [a, b];
    let [p3, p4] = [c, d];

    // 确保p1 <= p2
    if (p1 > p2) {
      [p1, p2] = [p2, p1];
    }

    // 确保p3 <= p4
    if (p3 > p4) {
      [p3, p4] = [p4, p3];
    }

    // 检查两个区间是否有重叠
    return Math.max(p1, p3) <= Math.min(p2, p4);
  };

  // 从线段中提取端点坐标
  const [[x1, y1], [x2, y2]] = seg1;
  const [[x3, y3], [x4, y4]] = seg2;

  // 计算线段的一般方程系数 Ax + By + C = 0
  const A1 = y1 - y2;
  const A2 = y3 - y4;
  const B1 = x2 - x1;
  const B2 = x4 - x3;
  const C1 = -A1 * x1 - B1 * y1;
  const C2 = -A2 * x3 - B2 * y3;

  // 计算系数矩阵的行列式
  const determinant = determinant2D(A1, B1, A2, B2);

  // 如果行列式为0，说明线段平行或重合
  if (determinant === 0) {
    // 检查是否重合
    if (
      determinant2D(A1, C1, A2, C2) === 0 &&
      determinant2D(B1, C1, B2, C2) === 0 &&
      projectionIntersected(x1, x2, x3, x4) &&
      projectionIntersected(y1, y2, y3, y4)
    ) {
      // 线段重合
      return [NaN, NaN];
    }

    // 线段平行但不重合
    return null;
  }

  // 计算交点坐标
  const x = -determinant2D(C1, B1, C2, B2) / determinant;
  const y = -determinant2D(A1, C1, A2, C2) / determinant;

  // 检查交点是否在两条线段上
  if (
    numberIsBetween(x1, x2, x) &&
    numberIsBetween(y1, y2, y) &&
    numberIsBetween(x3, x4, x) &&
    numberIsBetween(y3, y4, y)
  ) {
    return [x, y];
  }

  // 交点不在线段上
  return null;
}

/**
 * 查找点到线段上最近的点
 * 计算给定点到线段的最近点，可能是垂足点或线段端点
 * @param segment - 线段，由两个点组成的数组 [[x1, y1], [x2, y2]]
 * @param point - 点坐标 [x, y]
 * @returns 返回线段上离给定点最近的点坐标
 */
export function findClosestPointOnSegment(
  segment: [[number, number], [number, number]],
  point: [number, number]
): [number, number] {
  // 检查数字是否在两个数之间
  const numberIsBetween = (a: number, b: number, c: number): boolean =>
    Math.min(a, b) <= c && c <= Math.max(a, b);

  // 从线段中提取端点坐标
  const [[x1, y1], [x2, y2]] = segment;
  // 提取点坐标
  const [x3, y3] = point;

  // 计算点到线段的垂足点坐标
  // 使用向量投影公式计算垂足点
  const x =
    (x1 * x1 * x3 -
      2 * x1 * x2 * x3 +
      x2 * x2 * x3 +
      x2 * (y1 - y2) * (y1 - y3) -
      x1 * (y1 - y2) * (y2 - y3)) /
    ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  const y =
    (x2 * x2 * y1 +
      x1 * x1 * y2 +
      x2 * x3 * (y2 - y1) -
      x1 * (x3 * (y2 - y1) + x2 * (y1 + y2)) +
      (y1 - y2) * (y1 - y2) * y3) /
    ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

  // 检查垂足点是否在线段上
  if (numberIsBetween(x1, x2, x) && numberIsBetween(y1, y2, y)) {
    return [x, y];
  }

  // 垂足点不在线段上
  // 最短距离是到线段端点的距离
  const d1 = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
  const d2 = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);

  // 返回距离较近的端点
  if (d1 < d2) {
    return [x1, y1];
  }

  return [x2, y2];
}

/**
 * 从点数组创建线段数组
 * 将点数组转换为线段数组，每个线段由两个连续的点组成
 * @param points - 点数组，格式为 [x1, y1, x2, y2, ...]
 * @param circuit - 是否创建闭合路径，如果为true，则最后一个点会连接到第一个点
 * @returns 返回线段数组，每个线段由两个点组成
 */
export function segmentsFromPoints(points: number[], circuit = false): Segment[] {
  // 使用reduce方法将点数组转换为线段数组
  return points.reduce<Segment[]>((acc, val, idx, arr) => {
    // 只处理y坐标（奇数索引）
    if (idx % 2 !== 0) {
      // 如果是最后一个点
      if (idx === arr.length - 1) {
        // 如果需要闭合路径，连接最后一个点到第一个点
        if (circuit) {
          acc.push([
            [arr[idx - 1], val],
            [arr[0], arr[1]],
          ]);
        }
      } else {
        // 创建从当前点到下一个点的线段
        acc.push([
          [arr[idx - 1], val],
          [arr[idx + 1], arr[idx + 2]],
        ]);
      }
    }
    return acc;
  }, []);
}

/**
 * 返回数组的反转副本
 * 创建一个新数组，包含原数组的元素但顺序相反
 * 注意：toReversed已存在于ESMA规范中，但不是所有CVAT客户使用的浏览器都足够新
 * 因此使用reduceRight实现而不是使用带有polyfills的库
 * @param array - 要反转的数组
 * @returns 返回反转后的新数组
 */
export function toReversed<T>(array: Array<T>): Array<T> {
  // 实际上toReversed已经存在于ESMA规范中
  // 但不是所有CVAT客户使用的浏览器都足够新以使用它
  // 因此我更喜欢用reduceRight重写它，而不是使用带有polyfills的库
  return array.reduceRight<Array<T>>((acc, val: T) => {
    // 将元素添加到累加器数组的末尾
    acc.push(val);
    return acc;
  }, []);
}

/**
 * 线段类型定义
 * 表示二维空间中的一条线段，由两个端点坐标组成
 * 每个端点是一个包含x和y坐标的数组
 */
export type Segment = [[number, number], [number, number]];

/**
 * 属性类型提取工具类型
 * 用于从类型T中提取属性Prop的类型
 * @template T - 要提取属性的类型
 * @template Prop - 要提取的属性名，必须是T的键
 */
export type PropType<T, Prop extends keyof T> = T[Prop];
