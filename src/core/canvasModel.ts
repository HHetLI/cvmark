import consts from "../consts/consts";
import { MasterImpl } from "../events/master";

// #region models definition

/**
 * 尺寸接口，定义宽度和高度
 */
export interface Size {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
}

/**
 * 帧缩放枚举，定义帧缩放的最小和最大值
 */
export enum FrameZoom {
  /** 最小缩放值 */
  MIN = 0.1,
  /** 最大缩放值 */
  MAX = 10,
}

/**
 * 媒体接口，定义媒体的渲染属性
 */
export interface Media {
  /** 渲染宽度 */
  renderWidth: number;
  /** 渲染高度 */
  renderHeight: number;
  /** 媒体类型 */
  mediaType: "image" | "video";
  /** 图像数据 */
  imageData?: ImageBitmap;
  /** 视频URL */
  videoUrl?: string;
}

export interface FrameData {
  /** 图像ID */
  imageID: number;
  // 帧名称
  filename: string;
  // 图像高度
  height: number;
  // 图像宽度
  width: number;
  // 获取图像数据的异步方法
  data(): Promise<Media>;
}

/**
 * 交互数据接口，定义交互操作的相关数据
 */
export interface InteractionData {
  /** 是否启用交互 */
  enabled: boolean;
  /** 图形类型 */
  shapeType?: string;
  /** 是否显示十字准线 */
  crosshair?: boolean;
  /** 正顶点最小数量 */
  minPosVertices?: number;
  /** 负顶点最小数量 */
  minNegVertices?: number;
  /** 是否从框开始 */
  startWithBox?: boolean;
  /** 是否启用滑动 */
  enableSliding?: boolean;
  /** 是否只允许删除最后一个点 */
  allowRemoveOnlyLast?: boolean;
  /** 中间图形 */
  intermediateShape?: {
    /** 图形类型 */
    shapeType: string;
    /** 点坐标数组 */
    points: number[];
  };
}

/**
 * 交互结果接口，定义交互操作的结果数据
 */
export interface InteractionResult {
  /** 点坐标数组 */
  points: number[];
  /** 图形类型 */
  shapeType: string;
  /** 按钮编号 */
  button: number;
}

/**
 * 掩码编辑数据接口，定义掩码编辑的相关数据
 */
export interface MasksEditData {
  /** 是否启用掩码编辑 */
  enabled: boolean;
  /** 编辑状态 */
  state?: any;
  /** 画笔工具 */
  brushTool?: BrushTool;
  /** 配置更新回调函数 */
  onUpdateConfiguration?: (configuration: {
    brushTool?: Pick<BrushTool, "size">;
  }) => void;
}

/**
 * 颜色依据枚举，定义图形颜色的依据
 */
export enum ColorBy {
  /** 按实例着色 */
  INSTANCE = "Instance",
  /** 按组着色 */
  GROUP = "Group",
  /** 按标签着色 */
  LABEL = "Label",
}

/**
 * 模式枚举，定义画布的各种操作模式
 */
export enum Mode {
  /** 空闲模式 */
  IDLE = "idle",
  /** 拖动模式 */
  DRAG = "drag",
  /** 调整大小模式 */
  RESIZE = "resize",
  /** 绘制模式 */
  DRAW = "draw",
  /** 编辑模式 */
  EDIT = "edit",
  /** 合并模式 */
  MERGE = "merge",
  /** 分割模式 */
  SPLIT = "split",
  /** 组模式 */
  GROUP = "group",
  /** 连接模式 */
  JOIN = "join",
  /** 切片模式 */
  SLICE = "slice",
  /** 交互模式 */
  INTERACT = "interact",
  /** 区域选择模式 */
  SELECT_REGION = "select_region",
  /** 拖动画布模式 */
  DRAG_CANVAS = "drag_canvas",
  /** 缩放画布模式 */
  ZOOM_CANVAS = "zoom_canvas",
}

/**
 * 多边形编辑数据接口，定义多边形编辑的相关数据
 */
export interface PolyEditData {
  /** 是否启用多边形编辑 */
  enabled: boolean;
  /** 编辑状态 */
  state?: any;
  /** 点ID */
  pointID?: number;
}

/**
 * 配置接口，定义画布的各种配置选项
 */
export interface Configuration {
  /** 是否平滑图像显示 */
  smoothImage?: boolean;
  /** 文本位置：自动或居中 */
  textPosition?: "auto" | "center";
  /** 文本字体大小 */
  textFontSize?: number;
  /** 未定义属性的显示值 */
  undefinedAttrValue?: string;
  /** 是否显示冲突 */
  showConflicts?: boolean;
  /** 文本内容 */
  textContent?: string;
  /** 图形的不透明度 */
  shapeOpacity?: number;
  /** CSS图像滤镜 */
  CSSImageFilter?: string;
  /** 是否显示所有文本 */
  displayAllText?: boolean;
  /** 是否自动显示边框 */
  autoborders?: boolean;
  /** 是否启用自适应缩放 */
  adaptiveZoom?: boolean;
  /** 是否显示投影 */
  showProjections?: boolean;
  /** 是否强制禁用编辑 */
  forceDisableEditing?: boolean;
  /** 颜色依据：按实例、组或标签 */
  colorBy?: ColorBy;
  /** 选中图形的不透明度 */
  selectedShapeOpacity?: number;
  /** 控制点大小 */
  controlPointsSize?: number;
  /** 轮廓边框样式或false表示不显示 */
  outlinedBorders?: string | false;
  /** 是否重置缩放 */
  resetZoom?: boolean;
  /** 是否启用智能多边形裁剪 */
  intelligentPolygonCrop?: boolean;
  /** 是否强制更新帧 */
  forceFrameUpdate?: boolean;
  /** 是否隐藏正在编辑的对象 */
  hideEditedObject?: boolean;
  /** 视频自动播放 */
  videoAutoPlay?: boolean;
  /** 视频循环播放 */
  videoLoop?: boolean;
}

/**
 * 聚焦数据接口，定义聚焦对象的信息
 */
export interface FocusData {
  /** 元素ID */
  clientID: number;
  /** 内边距 */
  padding: number;
}

/**
 * 分割数据接口，定义分割操作的相关数据
 */
export interface SplitData {
  /** 是否启用分割操作 */
  enabled: boolean;
}

/**
 * 连接数据接口，定义连接操作的相关数据
 */
export interface JoinData {
  /** 是否启用连接操作 */
  enabled: boolean;
}

/**
 * 切片数据接口，定义切片操作的相关数据
 */
export interface SliceData {
  /** 是否启用切片操作 */
  enabled: boolean;
  /** 元素ID */
  clientID?: number;
  /** 获取轮廓的回调函数 */
  getContour?: (state: any) => Promise<number[]>;
}

/**
 * 合并数据接口，定义合并操作的相关数据
 */
export interface MergeData {
  /** 是否启用合并操作 */
  enabled: boolean;
}

/**
 * 组数据接口，定义组操作的相关数据
 */
export interface GroupData {
  /** 是否启用组操作 */
  enabled: boolean;
}

/**
 * 更新原因枚举，定义画布更新的各种原因
 */
export enum UpdateReasons {
  /** 图像已更改 */
  IMAGE_CHANGED = "image_changed",
  /** 图像已缩放 */
  IMAGE_ZOOMED = "image_zoomed",
  /** 图像已适应 */
  IMAGE_FITTED = "image_fitted",
  /** 图像已移动 */
  IMAGE_MOVED = "image_moved",
  /** 图像已旋转 */
  IMAGE_ROTATED = "image_rotated",
  /** 网格已更新 */
  GRID_UPDATED = "grid_updated",

  /** 问题区域已更新 */
  ISSUE_REGIONS_UPDATED = "issue_regions_updated",
  /** 对象已更新 */
  OBJECTS_UPDATED = "objects_updated",
  /** 图形已激活 */
  SHAPE_ACTIVATED = "shape_activated",
  /** 图形已聚焦 */
  SHAPE_FOCUSED = "shape_focused",
  /** 图形已高亮 */
  SHAPE_HIGHLIGHTED = "shape_highlighted",

  /** 画布已适应 */
  FITTED_CANVAS = "fitted_canvas",

  /** 交互操作 */
  INTERACT = "interact",
  /** 绘制操作 */
  DRAW = "draw",
  /** 编辑操作 */
  EDIT = "edit",
  /** 合并操作 */
  MERGE = "merge",
  /** 分割操作 */
  SPLIT = "split",
  /** 组操作 */
  GROUP = "group",
  /** 连接操作 */
  JOIN = "join",
  /** 切片操作 */
  SLICE = "slice",
  /** 选择操作 */
  SELECT = "select",
  /** 取消操作 */
  CANCEL = "cancel",
  /** 位图操作 */
  BITMAP = "bitmap",
  /** 区域选择操作 */
  SELECT_REGION = "select_region",
  /** 拖动画布操作 */
  DRAG_CANVAS = "drag_canvas",
  /** 缩放画布操作 */
  ZOOM_CANVAS = "zoom_canvas",
  /** 配置已更新 */
  CONFIG_UPDATED = "config_updated",
  /** 数据加载失败 */
  DATA_FAILED = "data_failed",
  /** 销毁操作 */
  DESTROY = "destroy",
}

/**
 * 位置接口，定义二维坐标
 */
export interface Position {
  /** X坐标 */
  x: number;
  /** Y坐标 */
  y: number;
}

/**
 * 矩形绘制方法枚举，定义矩形的绘制方式
 */
export enum RectDrawingMethod {
  /** 经典方法：通过2个点绘制矩形 */
  CLASSIC = "By 2 points",
  /** 极值点方法：通过4个点绘制矩形 */
  EXTREME_POINTS = "By 4 points",
}

/**
 * 画布提示接口，定义提示的显示内容和样式
 */
export interface CanvasHint {
  /** 提示类型：文本或列表 */
  type: "text" | "list";
  /** 提示内容：字符串或字符串数组 */
  content: string | string[];
  /** 可选的CSS类名 */
  className?: string;
  /** 可选的图标类型：信息或加载 */
  icon?: "info" | "loading";
}

/**
 * 几何信息接口，定义画布的几何属性
 */
export interface Geometry {
  /** 图像尺寸 */
  image: Size;
  /** 画布尺寸 */
  canvas: Size;
  /** 顶部偏移量 */
  top: number;
  /** 左侧偏移量 */
  left: number;
  /** 缩放比例 */
  scale: number;
  /** 偏移量 */
  offset: number;
  /** 旋转角度 */
  angle: number;
}

/**
 * 画笔工具接口，定义画笔工具的属性和行为
 */
export interface BrushTool {
  /** 工具类型：画笔、橡皮擦、多边形加、多边形减 */
  type: "brush" | "eraser" | "polygon-plus" | "polygon-minus";
  /** 工具颜色 */
  color: string;
  /** 工具图形：圆形或方形 */
  form: "circle" | "square";
  /** 工具大小 */
  size: number;
  /** 工具阻塞状态更新回调函数 */
  onBlockUpdated: (blockedTools: Record<"eraser" | "polygon-minus", boolean>) => void;
}

/**
 * 绘制数据接口，定义绘制操作的相关数据
 */
export interface DrawData {
  /** 是否启用绘制 */
  enabled: boolean;
  /** 是否继续绘制 */
  continue?: boolean;
  /** 图形类型 */
  shapeType?: string;
  /** 矩形绘制方法 */
  rectDrawingMethod?: RectDrawingMethod;
  /** 骨架SVG */
  skeletonSVG?: string;
  /** 点的数量 */
  numberOfPoints?: number;
  /** 初始状态 */
  initialState?: any;
  /** 是否显示十字准线 */
  crosshair?: boolean;
  /** 画笔工具 */
  brushTool?: BrushTool;
  /** 重绘图形ID */
  redraw?: number;
  /** 绘制完成回调函数 */
  onDrawDone?: (data: object | null) => void;
  /** 配置更新回调函数 */
  onUpdateConfiguration?: (configuration: {
    brushTool?: Pick<BrushTool, "size">;
  }) => void;
}

/**
 * 激活元素接口，定义当前激活的元素信息
 */
export interface ActiveElement {
  /** 元素ID，null表示无激活元素 */
  clientID: number | null;
  /** 属性ID，null表示无激活属性 */
  attributeID: number | null;
}

/**
 * 高亮严重程度枚举，定义高亮显示的严重级别
 */
export enum HighlightSeverity {
  /** 错误级别 */
  ERROR = "error",
  /** 警告级别 */
  WARNING = "warning",
}

/**
 * 高亮元素接口，定义高亮显示的元素集合
 */
export interface HighlightedElements {
  /** 元素ID数组 */
  elementsIDs: number[];
  /** 高亮严重程度，null表示默认级别 */
  severity: HighlightSeverity | null;
}

/**
 * 默认数据对象，定义各种操作模式的默认状态
 * 所有操作默认禁用
 */
const defaultData = {
  /** 绘制数据默认禁用 */
  drawData: {
    enabled: false,
  },
  /** 编辑数据默认禁用 */
  editData: {
    enabled: false,
  },
  /** 交互数据默认禁用 */
  interactionData: {
    enabled: false,
  },
  /** 合并数据默认禁用 */
  mergeData: {
    enabled: false,
  },
  /** 组数据默认禁用 */
  groupData: {
    enabled: false,
  },
  /** 分割数据默认禁用 */
  splitData: {
    enabled: false,
  },
  /** 连接数据默认禁用 */
  joinData: {
    enabled: false,
  },
  /** 切片数据默认禁用 */
  sliceData: {
    enabled: false,
  },
};

// #endregion

/**
 * 检查是否有图形正在绘制中
 * @returns 如果有图形正在绘制则返回true，否则返回false
 */
function hasShapeIsBeingDrawn(): boolean {
  // 获取正在绘制的图形元素
  const [element] = window.document.getElementsByClassName("cvat_canvas_shape_drawing");
  if (element) {
    // 检查元素是否有绘制处理器
    return !!(element as any).instance.remember("_paintHandler");
  }

  return false;
}

/**
 * 检查是否需要禁用内部SVG绘制
 * 用于处理掩码绘制/编辑时的特殊情况
 *
 * 注意：这是意大利面条代码，可能需要大量重构以找到更好的解决方案
 * 当使用多边形填充进行掩码绘制/编辑时，用户需要关闭绘制/编辑两次
 * 第一次关闭停止使用svg.js的内部绘制/编辑
 * 第二次关闭停止掩码本身的绘制/编辑
 *
 * @param data 新的绘制/编辑数据
 * @param currentData 当前的绘制/编辑数据
 * @returns 如果需要禁用内部SVG绘制则返回true，否则返回false
 */
function disableInternalSVGDrawing(
  data: DrawData | MasksEditData,
  currentData: DrawData | MasksEditData
): boolean {
  // 检查是否从启用状态切换到禁用状态，且当前是掩码操作，使用多边形工具，且正在绘制
  return (
    (!data.enabled &&
      currentData.enabled &&
      (("shapeType" in currentData && currentData.shapeType === "mask") ||
        ("state" in currentData && currentData.state.shapeType === "mask")) &&
      currentData.brushTool?.type?.startsWith("polygon-") &&
      hasShapeIsBeingDrawn()) ??
    false
  );
}

/**
 * 画布模型接口，定义画布的状态和行为
 * 包含画布的所有属性、状态和操作方法
 */
export interface CanvasModel {
  //#region 接口属性定义

  /** 媒体数据，null表示无数据 */
  readonly media: Media | null;
  /** 配置数据 */
  readonly configuration: Configuration;
  /** 聚焦数据 */
  readonly focusData: FocusData;
  /** 绘制数据 */
  readonly drawData: DrawData;
  /** 编辑数据：掩码编辑或多边形编辑 */
  readonly editData: MasksEditData | PolyEditData;
  /** 合并数据 */
  readonly mergeData: MergeData;
  /** 分割数据 */
  readonly splitData: SplitData;
  /** 组数据 */
  readonly groupData: GroupData;
  /** 连接数据 */
  readonly joinData: JoinData;
  /** 切片数据 */
  readonly sliceData: SliceData;
  /** 交互数据 */
  readonly interactionData: InteractionData;
  /** 画布上的所有对象 */
  readonly objects: any[];
  /** Z层级，null表示无特定层级 */
  readonly zLayer: number | null;
  /** 激活元素数据 */
  readonly activeElement: ActiveElement;
  /** 高亮元素数据 */
  readonly highlightedElements: HighlightedElements;
  /** 选中的对象 */
  readonly selected: any;
  /** 几何信息 */
  geometry: Geometry;
  /** 当前模式 */
  mode: Mode;
  /** 异常信息，null表示无异常 */
  exception: Error | null;

  //#endregion

  //#region 接口方法-视图操作

  /**
   * 缩放画布
   * @param x 水平坐标
   * @param y 垂直坐标
   * @param deltaY 滚动量，正值放大，负值缩小
   */
  zoom(x: number, y: number, deltaY: number): void;

  /**
   * 移动画布
   * @param topOffset 顶部偏移量
   * @param leftOffset 左侧偏移量
   */
  move(topOffset: number, leftOffset: number): void;

  //#endregion

  //#region 接口方法-数据设置
  /**
   * 设置帧数据和对象状态
   * @param frameData 帧数据
   * @param objectStates 对象状态数组
   * @param zLayer Z层级
   */
  setup(frameData: FrameData, objectStates: any[], zLayer: number): void;
  /**
   * 激活指定对象
   * @param clientID 元素ID，null表示取消激活
   * @param attributeID 属性ID，null表示无特定属性
   */
  activate(clientID: number | null, attributeID: number | null): void;
  /**
   * 适应画布大小
   */
  fit(): void;
  /**
   * 高亮显示指定对象
   * @param clientIDs 元素ID数组
   * @param severity 高亮严重程度
   */
  highlight(clientIDs: number[], severity: HighlightSeverity | null): void;
  /**
   * 旋转画布
   * @param rotationAngle 旋转角度
   */
  rotate(rotationAngle: number): void;
  /**
   * 聚焦到指定对象
   * @param clientID 元素ID
   * @param padding 内边距
   */
  focus(clientID: number, padding: number): void;

  //#endregion

  // #region 接口方法-编辑操作
  /**
   * 启用编辑模式
   * @param editData 编辑数据：掩码编辑或多边形编辑
   */
  edit(editData: MasksEditData | PolyEditData): void;

  /**
   * 启用绘制模式
   * @param drawData 绘制数据
   */
  draw(drawData: DrawData): void;

  /**
   * 启用分割操作
   * @param splitData 分割数据
   */
  split(splitData: SplitData): void;

  /**
   * 启用组操作
   * @param groupData 组数据
   */
  group(groupData: GroupData): void;

  /**
   * 启用连接操作
   * @param joinData 连接数据
   */
  join(joinData: JoinData): void;

  /**
   * 启用切片操作
   * @param sliceData 切片数据
   */
  slice(sliceData: SliceData): void;

  /**
   * 启用合并操作
   * @param mergeData 合并数据
   */
  merge(mergeData: MergeData): void;

  /**
   * 选择对象
   * @param objectState 对象状态
   */
  select(objectState: any): void;
  //#endregion

  // #region 接口方法-画布控制
  /**
   * 适应画布到指定尺寸
   * @param width 宽度
   * @param height 高度
   */
  fitCanvas(width: number, height: number): void;

  /**
   * 启用区域选择模式
   * @param enabled 是否启用
   */
  selectRegion(enabled: boolean): void;

  /**
   * 启用画布拖动模式
   * @param enable 是否启用
   */
  dragCanvas(enable: boolean): void;

  /**
   * 启用画布缩放模式
   * @param enable 是否启用
   */
  zoomCanvas(enable: boolean): void;

  /**
   * 启用交互模式
   * @param interactionData 交互数据
   */
  interact(interactionData: InteractionData): void;
  //#endregion

  // #region 接口方法-状态查询

  /** 检查是否能够切换帧 */
  isAbleToChangeFrame(): boolean;

  /**
   * 配置画布
   * @param configuration 配置数据
   */
  configure(configuration: Configuration): void;

  /** 取消当前操作 */
  cancel(): void;

  /** 销毁画布 */
  destroy(): void;
  //#endregion
}

/**
 * 画布模型实现类
 * 继承自MasterImpl基类，实现了CanvasModel接口，提供了画布状态管理和操作功能
 * 负责管理画布的所有状态数据、对象操作、用户交互和配置设置
 */
export class CanvasModelImpl extends MasterImpl implements CanvasModel {
  //#region 属性定义

  /**
   * 画布模型的数据存储
   * 包含画布的所有状态信息，包括媒体信息、视图状态、交互数据等
   */
  private data: {
    /** 当前激活的元素信息 */
    activeElement: ActiveElement;
    /** 高亮显示的元素集合 */
    highlightedElements: HighlightedElements;
    /** 画布旋转角度 */
    angle: number;
    /** 画布尺寸 */
    canvasSize: Size;
    /** 画布配置选项 */
    configuration: Configuration;
    /** 画布上的所有对象 */
    objects: any[];
    /** Z层级 */
    zLayer: number | null;
    /** 当前媒体对象 */
    media: Media | null;
    /** 当前图像ID */
    imageID: number | null;
    /** 图像偏移量 */
    imageOffset: number;
    /** 图像原始尺寸 */
    imageSize: Size;
    /** 交互数据 */
    interactionData: InteractionData;
    /** 焦点数据 */
    focusData: FocusData;
    /** 缩放比例 */
    scale: number;
    /** 画布顶部位置 */
    top: number;
    /** 画布左侧位置 */
    left: number;
    /** 适应屏幕的缩放比例 */
    fittedScale: number;
    /** 绘制数据 */
    drawData: DrawData;
    /** 分割数据 */
    splitData: SplitData;
    /** 分组数据 */
    groupData: GroupData;
    /** 连接数据 */
    joinData: JoinData;
    /** 切片数据 */
    sliceData: SliceData;
    /** 合并数据 */
    mergeData: MergeData;
    /** 当前选中的对象 */
    selected: any;
    /** 当前操作模式 */
    mode: Mode;
    /** 异常信息 */
    exception: Error | null;
    /** 编辑数据（掩码或多边形） */
    editData: MasksEditData | PolyEditData;
  };

  //#endregion

  //#region getters and setters

  /**
   * 获取当前选中的对象
   * @returns 当前选中的对象
   */
  public get selected(): any {
    return this.data.selected;
  }

  /**
   * 获取合并数据
   * @returns 合并数据的副本
   */
  public get mergeData(): MergeData {
    return { ...this.data.mergeData };
  }

  /**
   * 获取分割数据
   * @returns 分割数据的副本
   */
  public get splitData(): SplitData {
    return { ...this.data.splitData };
  }

  /**
   * 获取连接数据
   * @returns 连接数据的副本
   */
  public get joinData(): JoinData {
    return { ...this.data.joinData };
  }

  /**
   * 获取切片数据
   * @returns 切片数据的副本
   */
  public get sliceData(): SliceData {
    return { ...this.data.sliceData };
  }

  /**
   * 获取组合数据
   * @returns 组合数据的副本
   */
  public get groupData(): GroupData {
    return { ...this.data.groupData };
  }

  /**
   * 获取交互数据
   * @returns 交互数据的副本
   */
  public get interactionData(): InteractionData {
    return { ...this.data.interactionData };
  }

  /**
   * 获取编辑数据
   * @returns 编辑数据的副本
   */
  public get editData(): MasksEditData | PolyEditData {
    return { ...this.data.editData };
  }

  /**
   * 获取绘制数据
   * @returns 绘制数据的副本
   */
  public get drawData(): DrawData {
    return { ...this.data.drawData };
  }

  /**
   * 获取高亮显示的元素
   * @returns 高亮元素数据的副本
   */
  public get highlightedElements(): HighlightedElements {
    return { ...this.data.highlightedElements };
  }

  /**
   * 获取当前激活元素
   * @returns 激活元素的副本
   */
  public get activeElement(): ActiveElement {
    return { ...this.data.activeElement };
  }

  /**
   * 获取当前媒体信息
   * @returns 当前媒体对象，如果没有则返回null
   */
  public get media(): Media | null {
    return this.data.media;
  }

  /**
   * 获取画布上的对象列表
   * 如果设置了Z层级，则只返回小于等于当前Z层级的对象
   * @returns 对象数组
   */
  public get objects(): any[] {
    // 如果设置了Z层级，过滤出小于等于当前Z层级的对象
    if (this.data.zLayer !== null) {
      return this.data.objects.filter(
        (object: any): boolean =>
          this.data.zLayer !== null && object.zOrder <= this.data.zLayer
      );
    }

    // 返回所有对象
    return this.data.objects;
  }

  /**
   * 获取当前Z层级
   * @returns 当前Z层级，如果未设置则返回null
   */
  public get zLayer(): number | null {
    return this.data.zLayer;
  }

  /**
   * 获取画布的几何信息
   * @returns 包含画布尺寸、图像尺寸、旋转角度等几何信息的对象
   */
  public get geometry(): Geometry {
    return {
      angle: this.data.angle,
      canvas: { ...this.data.canvasSize },
      image: { ...this.data.imageSize },
      left: this.data.left,
      offset: this.data.imageOffset,
      scale: this.data.scale,
      top: this.data.top,
    };
  }

  /**
   * 设置画布的几何信息
   * @param geometry - 包含新几何信息的对象
   */
  public set geometry(geometry: Geometry) {
    // 更新各种几何参数
    this.data.angle = geometry.angle;
    this.data.canvasSize = { ...geometry.canvas };
    this.data.imageSize = { ...geometry.image };
    this.data.left = geometry.left;
    this.data.top = geometry.top;
    this.data.imageOffset = geometry.offset;
    this.data.scale = geometry.scale;

    // 计算并设置图像偏移量（基于最小缩放级别）
    this.data.imageOffset = Math.floor(
      Math.max(
        this.data.canvasSize.height / FrameZoom.MIN,
        this.data.canvasSize.width / FrameZoom.MIN
      )
    );
  }

  /**
   * 设置画布模式
   * @param value - 新的画布模式
   */
  public set mode(value: Mode) {
    this.data.mode = value;
  }

  /**
   * 获取当前画布模式
   * @returns 当前画布模式
   */
  public get mode(): Mode {
    return this.data.mode;
  }

  /**
   * 获取当前画布配置的副本
   * @returns 当前配置对象的副本
   */
  public get configuration(): Configuration {
    return { ...this.data.configuration };
  }

  /**
   * 获取当前异常信息
   * @returns 当前异常对象
   */
  public get exception(): Error | null {
    return this.data.exception;
  }

  //#endregion

  //#region 构造函数
  /**
   * 构造函数
   * 初始化画布模型的所有数据状态
   */
  public constructor() {
    super();

    // 初始化数据对象，设置所有属性的默认值
    this.data = {
      // 初始化激活元素为空
      activeElement: {
        clientID: null,
        attributeID: null,
      },
      // 初始化高亮元素集合为空
      highlightedElements: {
        elementsIDs: [],
        severity: null,
      },
      // 初始旋转角度为0度
      angle: 0,
      // 初始画布尺寸为0
      canvasSize: {
        height: 0,
        width: 0,
      },
      // 默认配置选项
      configuration: {
        smoothImage: true,
        autoborders: false,
        adaptiveZoom: true,
        displayAllText: false,
        showProjections: false,
        showConflicts: false,
        forceDisableEditing: false,
        intelligentPolygonCrop: false,
        forceFrameUpdate: false,
        CSSImageFilter: "",
        colorBy: ColorBy.LABEL,
        selectedShapeOpacity: 0.5,
        shapeOpacity: 0.2,
        outlinedBorders: false,
        resetZoom: true,
        textFontSize: consts.DEFAULT_SHAPE_TEXT_SIZE,
        controlPointsSize: consts.BASE_POINT_SIZE,
        textPosition: consts.DEFAULT_SHAPE_TEXT_POSITION,
        textContent: consts.DEFAULT_SHAPE_TEXT_CONTENT,
        undefinedAttrValue: consts.DEFAULT_UNDEFINED_ATTR_VALUE,
        hideEditedObject: false,
        videoAutoPlay: false,
        videoLoop: false,
      },
      // 初始媒体为空
      media: null,
      // 初始图像ID为空
      imageID: null,
      // 初始图像偏移为0
      imageOffset: 0,
      // 初始图像尺寸为0
      imageSize: {
        height: 0,
        width: 0,
      },
      // 初始焦点数据
      focusData: {
        clientID: 0,
        padding: 0,
      },
      // 初始对象列表为空
      objects: [],
      // 初始缩放比例为1（原始大小）
      scale: 1,
      // 初始顶部位置为0
      top: 0,
      // 初始左侧位置为0
      left: 0,
      // 初始适应屏幕缩放比例为0
      fittedScale: 0,
      // 初始Z层级为空
      zLayer: null,
      // 初始选中对象为空
      selected: null,
      // 初始模式为空闲
      mode: Mode.IDLE,
      // 初始无异常
      exception: null,
      // 合并默认数据（包含各种操作模式的默认状态）
      ...defaultData,
    };
  }
  //#endregion

  /**
   * 设置画布的帧数据和对象状态
   * 处理图像加载、更新对象状态，并管理画布的缩放和位置
   *
   * @param frameData - 包含帧数据的对象，包括帧号、图像数据、尺寸等
   * @param objectStates - 对象状态数组，包含当前帧中所有标注对象的信息
   * @param zLayer - Z层级，用于控制对象的显示层级
   * @throws {Error} - 当画布处于编辑、拖动或调整大小模式时抛出错误
   */
  public setup(frameData: FrameData, objectStates: any[], zLayer: number): void {
    // 检查是否正在切换到不同的帧
    if (this.data.imageID !== frameData.imageID) {
      // 如果画布处于忙碌状态（编辑、拖动或调整大小），则抛出错误
      if ([Mode.EDIT, Mode.DRAG, Mode.RESIZE].includes(this.data.mode)) {
        throw Error(`Canvas is busy. Action: ${this.data.mode}`);
      }
    }

    // 如果是同一帧且图像删除状态未改变，并且没有强制更新帧的配置
    if (
      frameData.imageID === this.data.imageID &&
      !this.data.configuration.forceFrameUpdate
    ) {
      // 更新Z层级和对象状态
      this.data.zLayer = zLayer;
      this.data.objects = objectStates;

      // 只有在图像已加载的情况下才显示对象
      // 如果图像未加载，会在图像设置后触发UpdateReasons.OBJECTS_UPDATED
      // 这覆盖了在图像从服务器接收期间标注更改的情况
      // 例如：使用UI按钮（锁定、解锁）、快捷键、删除/恢复帧，
      // 以及任何时候在cvat-ui中更新对象列表
      if (this.data.media) {
        this.notify(UpdateReasons.OBJECTS_UPDATED);
      }
      return;
    }

    // 更新当前帧ID
    this.data.imageID = frameData.imageID;

    // 开始加载媒体前，清空当前媒体并通知视图
    this.data.media = null;
    this.notify(UpdateReasons.IMAGE_CHANGED);

    // 保存当前的Z层级和对象状态，用于后续比较
    const { zLayer: prevZLayer, objects: prevObjects } = this.data;

    // 异步加载图像数据
    frameData
      .data()
      // 图像加载完成后的处理
      .then((data: Media): void => {
        // 检查请求是否仍然有效，防止异步操作期间切换到其他帧
        if (frameData.imageID !== this.data.imageID) {
          return;
        }

        // 保存当前缩放和位置信息，用于后续恢复
        const relativeScaling = this.data.scale / this.data.fittedScale;
        const prevImageLeft = this.data.left;
        const prevImageTop = this.data.top;
        const prevImageWidth = this.data.imageSize.width;
        const prevImageHeight = this.data.imageSize.height;

        // 更新图像尺寸信息
        this.data.imageSize = {
          height: frameData.height as number,
          width: frameData.width as number,
        };

        // 设置媒体数据并重置缩放
        this.data.media = data;
        this.resetScale();

        // 在切换到新帧后恢复正确的图像位置
        // 如果相应的选项被禁用
        // prevImageHeight和prevImageWidth默认初始化为0
        if (
          prevImageHeight !== 0 &&
          prevImageWidth !== 0 &&
          !this.data.configuration.resetZoom
        ) {
          // 计算偏移量以保持图像中心位置
          const leftOffset = Math.round((this.data.imageSize.width - prevImageWidth) / 2);
          const topOffset = Math.round(
            (this.data.imageSize.height - prevImageHeight) / 2
          );

          // 调整图像位置和缩放比例
          this.data.left = prevImageLeft - leftOffset;
          this.data.top = prevImageTop - topOffset;
          this.data.scale *= relativeScaling;
        }

        // 通知视图图像已更改
        this.notify(UpdateReasons.IMAGE_CHANGED);

        // 检查请求是否仍然相关，防止在promise解析期间调用其他setup()
        if (prevZLayer === this.data.zLayer && prevObjects === this.data.objects) {
          // 更新Z层级和对象状态
          this.data.zLayer = zLayer;
          this.data.objects = objectStates;
        }

        // 通知视图对象已更新
        this.notify(UpdateReasons.OBJECTS_UPDATED);
      })
      // 处理图像加载错误
      .catch((exception: unknown): void => {
        if (typeof exception !== "number") {
          // 只有当异常不是数字时才处理（数字异常表示帧不再需要）
          if (exception instanceof Error) {
            this.data.exception = exception;
          } else {
            this.data.exception = new Error(
              "Unknown error occurred when fetching image data"
            );
          }
          // 通知视图数据加载失败
          this.notify(UpdateReasons.DATA_FAILED);
        }
      });
  }

  /**
   * 更新画布配置
   * 根据提供的配置对象更新画布的各种显示和行为设置
   * @param configuration - 包含新配置值的配置对象
   */
  public configure(configuration: Configuration): void {
    // 更新是否显示所有文本的设置
    if (typeof configuration.displayAllText === "boolean") {
      this.data.configuration.displayAllText = configuration.displayAllText;
    }

    // 更新文本字体大小，确保不小于最小值
    if (
      typeof configuration.textFontSize === "number" &&
      configuration.textFontSize >= consts.MINIMUM_TEXT_FONT_SIZE
    ) {
      this.data.configuration.textFontSize = configuration.textFontSize;
    }

    // 更新控制点大小
    if (typeof configuration.controlPointsSize === "number") {
      this.data.configuration.controlPointsSize = configuration.controlPointsSize;
    }

    // 更新文本位置（自动或居中）
    if (
      configuration.textPosition &&
      ["auto", "center"].includes(configuration.textPosition)
    ) {
      this.data.configuration.textPosition = configuration.textPosition;
    }

    // 更新文本内容配置（显示哪些信息）
    if (typeof configuration.textContent === "string") {
      // 分割并过滤文本内容配置项
      const splitted = configuration.textContent
        .split(",")
        .filter((entry: string) => !!entry);
      // 验证所有配置项都是有效的
      if (
        splitted.every((entry: string) =>
          ["id", "label", "attributes", "source", "descriptions", "dimensions"].includes(
            entry
          )
        )
      ) {
        this.data.configuration.textContent = configuration.textContent;
      }
    }

    // 更新是否自动显示边框的设置
    if (typeof configuration.autoborders === "boolean") {
      this.data.configuration.autoborders = configuration.autoborders;
    }
    // 更新是否启用自适应缩放的设置
    if (typeof configuration.adaptiveZoom === "boolean") {
      this.data.configuration.adaptiveZoom = configuration.adaptiveZoom;
    }
    // 更新是否平滑图像的设置
    if (typeof configuration.smoothImage === "boolean") {
      this.data.configuration.smoothImage = configuration.smoothImage;
    }
    // 更新未定义属性值的显示文本
    if (typeof configuration.undefinedAttrValue === "string") {
      this.data.configuration.undefinedAttrValue = configuration.undefinedAttrValue;
    }
    // 更新是否强制禁用编辑的设置
    if (typeof configuration.forceDisableEditing === "boolean") {
      this.data.configuration.forceDisableEditing = configuration.forceDisableEditing;
    }
    // 更新是否启用智能多边形裁剪的设置
    if (typeof configuration.intelligentPolygonCrop === "boolean") {
      this.data.configuration.intelligentPolygonCrop =
        configuration.intelligentPolygonCrop;
    }
    // 更新是否重置缩放的设置
    if (typeof configuration.resetZoom === "boolean") {
      this.data.configuration.resetZoom = configuration.resetZoom;
    }
    // 更新选中图形的不透明度
    if (typeof configuration.selectedShapeOpacity === "number") {
      this.data.configuration.selectedShapeOpacity = configuration.selectedShapeOpacity;
    }
    // 更新图形的不透明度
    if (typeof configuration.shapeOpacity === "number") {
      this.data.configuration.shapeOpacity = configuration.shapeOpacity;
    }
    // 更新是否显示轮廓边框的设置
    if (["string", "boolean"].includes(typeof configuration.outlinedBorders)) {
      this.data.configuration.outlinedBorders = configuration.outlinedBorders;
    }
    // 更新颜色分类方式
    if (configuration.colorBy && Object.values(ColorBy).includes(configuration.colorBy)) {
      this.data.configuration.colorBy = configuration.colorBy;
    }

    // 更新是否显示冲突的设置
    if (typeof configuration.showConflicts === "boolean") {
      this.data.configuration.showConflicts = configuration.showConflicts;
    }

    // 更新CSS图像滤镜
    if (typeof configuration.CSSImageFilter === "string") {
      this.data.configuration.CSSImageFilter = configuration.CSSImageFilter;
    }

    // 更新是否隐藏正在编辑的对象
    if (typeof configuration.hideEditedObject === "boolean") {
      this.data.configuration.hideEditedObject = configuration.hideEditedObject;
    }

    // 更新视频自动播放设置
    if (typeof configuration.videoAutoPlay === "boolean") {
      this.data.configuration.videoAutoPlay = configuration.videoAutoPlay;
    }

    // 更新视频循环播放设置
    if (typeof configuration.videoLoop === "boolean") {
      this.data.configuration.videoLoop = configuration.videoLoop;
    }

    // 通知画布配置已更新
    this.notify(UpdateReasons.CONFIG_UPDATED);
  }

  /**
   * 检查是否能够切换到下一帧
   * 根据当前画布模式判断是否允许切换帧
   * @returns 如果可以切换帧返回true，否则返回false
   */
  public isAbleToChangeFrame(): boolean {
    // 检查当前模式是否不允许切换帧
    const isUnable =
      [Mode.SLICE, Mode.DRAG, Mode.EDIT, Mode.RESIZE, Mode.INTERACT].includes(
        this.data.mode
      ) ||
      // 如果正在绘制且是重新绘制模式，也不允许切换帧
      (this.data.mode === Mode.DRAW && typeof this.data.drawData.redraw === "number");

    // 返回是否能够切换帧
    return !isUnable;
  }

  /**
   * 移动画布
   * @param topOffset 垂直方向的偏移量
   * @param leftOffset 水平方向的偏移量
   */
  public move(topOffset: number, leftOffset: number): void {
    // 更新画布位置
    this.data.top += topOffset;
    this.data.left += leftOffset;
    // 通知画布已移动
    this.notify(UpdateReasons.IMAGE_MOVED);
  }

  /**
   * 设置或更新绘制模式
   * 控制画布上的图形绘制行为，包括验证图形类型、设置绘制参数等
   * @param drawData - 绘制数据配置，包含图形类型、绘制方法等参数
   */
  public draw(drawData: DrawData): void {
    // 支持的图形类型列表，“矩形”、“多边形”、“折线”、“点”、“椭圆”、“骨架”、“遮罩”
    const supportedShapes = [
      "rectangle",
      "polygon",
      "polyline",
      "points",
      "ellipse",
      "skeleton",
      "mask",
    ];

    // 检查画布是否处于空闲或绘制模式
    if (![Mode.IDLE, Mode.DRAW].includes(this.data.mode)) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 当启用绘制时，验证输入参数
    if (drawData.enabled) {
      // 骨架图形需要提供SVG模板
      if (drawData.shapeType === "skeleton" && !drawData.skeletonSVG) {
        throw new Error("Skeleton template must be specified when drawing a skeleton");
      }

      // 必须指定图形类型或初始状态
      if (!drawData.shapeType && !drawData.initialState) {
        throw new Error("A shape type is not specified");
      }

      // 检查图形类型是否受支持
      if (drawData.shapeType && !supportedShapes.includes(drawData.shapeType)) {
        throw new Error(
          `Drawing method for type "${drawData.shapeType}" is not implemented`
        );
      }

      // 验证特定图形的最小点数要求
      if (typeof drawData.numberOfPoints !== "undefined") {
        if (drawData.shapeType === "polygon" && drawData.numberOfPoints < 3) {
          throw new Error("A polygon consists of at least 3 points");
        } else if (drawData.shapeType === "polyline" && drawData.numberOfPoints < 2) {
          throw new Error("A polyline consists of at least 2 points");
        }
      }
    }

    // 处理重新绘制现有图形的情况
    if (typeof drawData.redraw === "number") {
      const clientID = drawData.redraw;
      // 查找要重新绘制的图形
      const [state] = this.data.objects.filter(
        (_state: any): boolean => _state.clientID === clientID
      );

      if (state) {
        // 设置绘制数据并使用现有图形的类型
        this.data.drawData = { ...drawData };
        this.data.drawData.shapeType = state.shapeType;
      } else {
        // 如果找不到图形，直接返回
        return;
      }
    } else {
      // 检查是否需要禁用内部SVG绘制（用于掩码等特殊情况）
      if (disableInternalSVGDrawing(drawData, this.data.drawData)) {
        this.notify(UpdateReasons.DRAW);
        return;
      }

      // 设置新的绘制数据
      this.data.drawData = { ...drawData };
      // 如果提供了初始状态，从中获取图形类型
      if (this.data.drawData.initialState) {
        this.data.drawData.shapeType = this.data.drawData.initialState.shapeType;
      }
    }

    // 为特定图形类型设置默认绘制方法
    if (drawData.enabled) {
      // 矩形默认使用经典绘制方法
      if (drawData.shapeType === "rectangle") {
        this.data.drawData.rectDrawingMethod =
          drawData.rectDrawingMethod || RectDrawingMethod.CLASSIC;
      }
    }

    // 通知画布绘制状态已更新
    this.notify(UpdateReasons.DRAW);
  }

  /**
   * 重置图像缩放比例和位置，使图像适应画布大小
   * 考虑图像旋转角度，确保图像在旋转后仍能正确适应画布
   *
   * @returns {boolean} - 如果缩放比例或位置发生变化返回true，否则返回false
   */
  private resetScale(): boolean {
    // 获取当前图像旋转角度
    const { angle } = this.data;

    // 初始化更新后的缩放比例为当前缩放比例
    let updatedScale = this.data.scale;

    // 根据图像旋转角度计算合适的缩放比例
    // 当图像被旋转90度或270度时，图像的宽高会互换
    if ((angle / 90) % 2) {
      // 90, 270度旋转情况：使用画布宽度与图像高度、画布高度与图像宽度的比例
      updatedScale = Math.min(
        this.data.canvasSize.width / this.data.imageSize.height,
        this.data.canvasSize.height / this.data.imageSize.width
      );
    } else {
      // 0度或180度旋转情况：正常比例计算
      updatedScale = Math.min(
        this.data.canvasSize.width / this.data.imageSize.width,
        this.data.canvasSize.height / this.data.imageSize.height
      );
    }

    // 确保缩放比例在允许的最小和最大值之间
    updatedScale = Math.min(Math.max(updatedScale, FrameZoom.MIN), FrameZoom.MAX);

    // 计算图像在画布中居中显示时的顶部和左侧位置
    const updatedTop = this.data.canvasSize.height / 2 - this.data.imageSize.height / 2;
    const updatedLeft = this.data.canvasSize.width / 2 - this.data.imageSize.width / 2;

    // 检查缩放比例或位置是否发生变化
    if (
      updatedScale !== this.data.scale ||
      updatedTop !== this.data.top ||
      updatedLeft !== this.data.left
    ) {
      // 更新缩放比例和位置
      this.data.scale = updatedScale;
      this.data.top = updatedTop;
      this.data.left = updatedLeft;

      // 保存当前缩放比例作为"适应画布"的缩放比例
      // 这在后续的缩放操作中用于计算相对缩放比例
      this.data.fittedScale = this.data.scale;
      return true;
    }

    // 没有变化时返回false
    return false;
  }

  /**
   * 启用或禁用区域选择模式
   * @param enable 是否启用区域选择模式
   */
  public selectRegion(enable: boolean): void {
    // 检查画布状态，如果启用区域选择但画布不是空闲状态，抛出错误
    if (enable && this.data.mode !== Mode.IDLE) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 检查画布状态，如果禁用区域选择但画布不是区域选择模式，抛出错误
    if (!enable && this.data.mode !== Mode.SELECT_REGION) {
      throw Error(
        `Canvas is not in the region selecting mode. Action: ${this.data.mode}`
      );
    }

    // 更新模式状态
    this.data.mode = enable ? Mode.SELECT_REGION : Mode.IDLE;
    // 通知区域选择模式已更改
    this.notify(UpdateReasons.SELECT_REGION);
  }

  /**
   * 设置或更新合并模式
   * 控制将多个图形合并为一个图形的操作
   * @param mergeData - 合并数据配置，包含合并参数
   */
  public merge(mergeData: MergeData): void {
    // 检查画布是否处于空闲或合并模式
    if (![Mode.IDLE, Mode.MERGE].includes(this.data.mode)) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 如果状态没有变化（都启用或都禁用），则直接返回
    if (
      (this.data.mergeData.enabled && mergeData.enabled) ||
      (!this.data.mergeData.enabled && !mergeData.enabled)
    ) {
      return;
    }

    // 更新合并数据
    this.data.mergeData = { ...mergeData };
    // 通知画布合并状态已更新
    this.notify(UpdateReasons.MERGE);
  }

  /**
   * 设置或更新组合模式
   * 控制将多个图形组合为一个组的操作
   * @param groupData - 组合数据配置，包含组合参数
   */
  public group(groupData: GroupData): void {
    // 检查画布是否处于空闲或组合模式
    if (![Mode.IDLE, Mode.GROUP].includes(this.data.mode)) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 如果状态没有变化（都启用或都禁用），则直接返回
    if (
      (this.data.groupData.enabled && groupData.enabled) ||
      (!this.data.groupData.enabled && !groupData.enabled)
    ) {
      return;
    }

    // 更新组合数据
    this.data.groupData = { ...groupData };
    // 通知画布组合状态已更新
    this.notify(UpdateReasons.GROUP);
  }

  /**
   * 聚焦到指定对象
   * @param clientID 要聚焦的对象元素ID
   * @param padding 聚焦时的内边距
   */
  public focus(clientID: number, padding: number): void {
    // 更新焦点数据
    this.data.focusData = {
      clientID,
      padding,
    };

    // 通知图形已聚焦
    this.notify(UpdateReasons.SHAPE_FOCUSED);
  }

  /**
   * 启用或禁用画布拖拽模式
   * @param enable 是否启用画布拖拽模式
   */
  public dragCanvas(enable: boolean): void {
    // 检查画布状态，如果启用拖拽但画布不是空闲状态，抛出错误
    if (enable && this.data.mode !== Mode.IDLE) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 检查画布状态，如果禁用拖拽但画布不是拖拽模式，抛出错误
    if (!enable && this.data.mode !== Mode.DRAG_CANVAS) {
      throw Error(`Canvas is not in the drag mode. Action: ${this.data.mode}`);
    }

    // 更新模式状态
    this.data.mode = enable ? Mode.DRAG_CANVAS : Mode.IDLE;
    // 通知拖拽模式已更改
    this.notify(UpdateReasons.DRAG_CANVAS);
  }

  /**
   * 使图像适应画布大小，居中显示
   * 如果缩放或位置发生变化，会通知观察者
   */
  public fit(): void {
    // 调用resetScale重置缩放比例和位置
    // 如果有变化，则通知观察者图像已适应画布
    if (this.resetScale()) {
      this.notify(UpdateReasons.IMAGE_FITTED);
    }
  }

  /**
   * 设置或更新编辑模式
   * 控制对现有图形的编辑行为，包括多边形和掩码编辑
   * @param editData - 编辑数据配置，包含编辑状态和编辑参数
   */
  public edit(editData: MasksEditData | PolyEditData): void {
    // 检查画布是否处于空闲或编辑模式
    if (![Mode.IDLE, Mode.EDIT].includes(this.data.mode)) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 启用编辑时必须提供编辑状态
    if (editData.enabled && !editData.state) {
      throw Error("State must be specified when call edit() editing process");
    }

    // 防止在编辑过程中切换到编辑另一个图形
    if (
      this.data.editData.enabled &&
      editData.enabled &&
      editData.state.clientID !== this.data.editData.state.clientID
    ) {
      throw Error(
        "State cannot be updated during editing, need to finish current editing first"
      );
    }

    if (editData.enabled) {
      // 启用编辑并设置编辑数据
      this.data.editData = { ...editData };
    } else if (disableInternalSVGDrawing(editData, this.data.editData)) {
      // 检查是否需要禁用内部SVG绘制
      this.notify(UpdateReasons.EDIT);
      return;
    } else {
      // 禁用编辑模式
      this.data.editData = { enabled: false };
    }

    // 通知画布编辑状态已更新
    this.notify(UpdateReasons.EDIT);
  }

  /**
   * 设置或更新连接模式
   * 控制将多个图形连接为一个图形的操作
   * @param joinData - 连接数据配置，包含连接参数
   */
  public join(joinData: JoinData): void {
    // 检查画布是否处于空闲或连接模式
    if (![Mode.IDLE, Mode.JOIN].includes(this.data.mode)) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 如果状态没有变化（都启用或都禁用），则直接返回
    if (
      (this.data.joinData.enabled && joinData.enabled) ||
      (!this.data.joinData.enabled && !joinData.enabled)
    ) {
      return;
    }

    // 更新连接数据
    this.data.joinData = { ...joinData };
    // 通知画布连接状态已更新
    this.notify(UpdateReasons.JOIN);
  }

  /**
   * 临时选择对象并触发选择事件
   * 该方法用于临时选择对象，触发事件后立即清除选择状态
   * @param objectState - 要选择的对象状态
   */
  public select(objectState: any): void {
    // 设置选中的对象
    this.data.selected = objectState;
    // 通知画布对象已被选择
    this.notify(UpdateReasons.SELECT);
    // 立即清除选择状态（临时选择）
    this.data.selected = null;
  }

  /**
   * 设置或更新交互模式
   * 控制与画布上图形的交互行为，如选择、移动等
   * @param interactionData - 交互数据配置，包含交互类型和参数
   */
  public interact(interactionData: InteractionData): void {
    // 检查画布是否处于空闲或交互模式
    if (![Mode.IDLE, Mode.INTERACT].includes(this.data.mode)) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 启用交互时验证参数
    if (interactionData.enabled) {
      // 首次启用交互时必须指定图形类型
      if (!this.data.interactionData.enabled && !interactionData.shapeType) {
        throw new Error("A shape type was not specified");
      }
    }

    // 设置交互数据
    this.data.interactionData = interactionData;
    // 默认启用十字准线（如果未明确指定）
    if (typeof this.data.interactionData.crosshair !== "boolean") {
      this.data.interactionData.crosshair = true;
    }

    // 通知画布交互状态已更新
    this.notify(UpdateReasons.INTERACT);
  }

  /**
   * 设置或更新切片模式
   * 控制对图形进行切片操作，如沿路径切割图形
   * @param sliceData - 切片数据配置，包含切片参数和轮廓计算方法
   */
  public slice(sliceData: SliceData): void {
    // 检查画布是否处于空闲或切片模式
    if (![Mode.IDLE, Mode.SLICE].includes(this.data.mode)) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 如果状态没有变化（都启用或都禁用），则直接返回
    if (
      (this.data.sliceData.enabled && sliceData.enabled) ||
      (!this.data.sliceData.enabled && !sliceData.enabled)
    ) {
      return;
    }

    // 启用切片时必须提供轮廓计算方法
    if (sliceData.enabled && !sliceData.getContour) {
      throw Error("Contours computing method was not provided");
    }

    // 更新切片数据
    this.data.sliceData = { ...sliceData };
    // 通知画布切片状态已更新
    this.notify(UpdateReasons.SLICE);
  }

  /**
   * 启用或禁用画布缩放模式
   * @param enable 是否启用画布缩放模式
   */
  public zoomCanvas(enable: boolean): void {
    // 检查画布状态，如果启用缩放但画布不是空闲状态，抛出错误
    if (enable && this.data.mode !== Mode.IDLE) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 检查画布状态，如果禁用缩放但画布不是缩放模式，抛出错误
    if (!enable && this.data.mode !== Mode.ZOOM_CANVAS) {
      throw Error(`Canvas is not in the zoom mode. Action: ${this.data.mode}`);
    }

    // 更新模式状态
    this.data.mode = enable ? Mode.ZOOM_CANVAS : Mode.IDLE;
    // 通知缩放模式已更改
    this.notify(UpdateReasons.ZOOM_CANVAS);
  }

  /**
   * 缩放画布
   * @param x 缩放中心的X坐标
   * @param y 缩放中心的Y坐标
   * @param deltaY 鼠标滚轮的滚动量，正值表示向上滚动（放大），负值表示向下滚动（缩小）
   */
  public zoom(x: number, y: number, deltaY: number): void {
    // 基础缩放系数，历史值
    const basicZoomCoef = 6 / 5; // historical value
    // 调整系数，值越小缩放越平滑，需要在速度和平滑度之间权衡
    const adjustCoef = 1 / 10;
    const oldScale: number = this.data.scale;
    // 计算缩放因子，基于滚轮滚动量
    let scaleFactor = basicZoomCoef ** (-deltaY * adjustCoef);

    // 如果未启用自适应缩放，使用旧算法
    if (!this.data.configuration.adaptiveZoom) {
      // 旧算法，直接乘以6/5或5/6
      scaleFactor = basicZoomCoef ** Math.sign(-deltaY);
    }
    // 计算新的缩放比例
    const newScale: number = oldScale * scaleFactor;
    // 限制缩放比例在最小值和最大值之间
    this.data.scale = Math.min(Math.max(newScale, FrameZoom.MIN), FrameZoom.MAX);

    const { angle } = this.data;

    // 计算旋转角度对缩放的影响因子
    const multiplier =
      Math.sin((angle * Math.PI) / 180) + Math.cos((angle * Math.PI) / 180);
    // 处理90度、270度等旋转角度的情况
    if ((angle / 90) % 2) {
      // 90, 270, ..
      // 计算顶部和左侧的偏移量
      const topMultiplier =
        (x - this.data.imageSize.width / 2) * (oldScale / this.data.scale - 1);
      const leftMultiplier =
        (y - this.data.imageSize.height / 2) * (oldScale / this.data.scale - 1);
      // 更新画布位置
      this.data.top += multiplier * topMultiplier * this.data.scale;
      this.data.left -= multiplier * leftMultiplier * this.data.scale;
    } else {
      // 处理0度、180度等旋转角度的情况
      const leftMultiplier =
        (x - this.data.imageSize.width / 2) * (oldScale / this.data.scale - 1);
      const topMultiplier =
        (y - this.data.imageSize.height / 2) * (oldScale / this.data.scale - 1);
      // 更新画布位置
      this.data.left += multiplier * leftMultiplier * this.data.scale;
      this.data.top += multiplier * topMultiplier * this.data.scale;
    }

    // 通知画布已缩放
    this.notify(UpdateReasons.IMAGE_ZOOMED);
  }

  /**
   * 激活指定对象
   * @param clientID 对象的元素ID，null表示取消激活
   * @param attributeID 属性ID，null表示无特定属性
   */
  public activate(clientID: number | null, attributeID: number | null): void {
    // 如果已经是激活状态，无需重复操作
    if (
      this.data.activeElement.clientID === clientID &&
      this.data.activeElement.attributeID === attributeID
    ) {
      return;
    }

    // 检查画布状态，如果画布不是空闲状态且要激活对象，抛出错误
    if (this.data.mode !== Mode.IDLE && clientID !== null) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 如果指定了元素ID，验证对象是否存在且不是标签类型
    if (typeof clientID === "number") {
      const [state] = this.objects.filter(
        (_state: any): boolean => _state.clientID === clientID
      );
      if (!state || state.objectType === "tag") {
        return;
      }
    }

    // 更新激活元素信息
    this.data.activeElement = {
      clientID,
      attributeID,
    };

    // 通知图形已激活
    this.notify(UpdateReasons.SHAPE_ACTIVATED);
  }

  /**
   * 高亮显示指定的对象
   * @param clientIDs 要高亮显示的对象元素ID数组
   * @param severity 高亮严重程度，null表示无特定严重程度
   */
  public highlight(clientIDs: number[], severity: HighlightSeverity | null): void {
    // 过滤出实际存在的对象ID
    const elementsIDs = clientIDs.filter((id: number): boolean =>
      this.objects.find((_state: any): boolean => _state.clientID === id)
    );

    // 更新高亮元素信息
    this.data.highlightedElements = {
      elementsIDs,
      severity,
    };

    // 通知图形已高亮
    this.notify(UpdateReasons.SHAPE_HIGHLIGHTED);
  }

  /**
   * 旋转图像
   * @param rotationAngle 旋转角度（度）
   */
  public rotate(rotationAngle: number): void {
    // 只有当角度发生变化且图像未被删除时才执行旋转
    if (this.data.angle !== rotationAngle) {
      // 将角度规范化为90度的倍数，并限制在0-360度范围内
      this.data.angle = (360 + Math.floor(rotationAngle / 90) * 90) % 360;
      // 通知图像已旋转
      this.notify(UpdateReasons.IMAGE_ROTATED);
    }
  }

  /**
   * 设置或更新分割模式
   * 控制将图形分割为多个部分的操作
   * @param splitData - 分割数据配置，包含分割参数
   */
  public split(splitData: SplitData): void {
    // 检查画布是否处于空闲或分割模式
    if (![Mode.IDLE, Mode.SPLIT].includes(this.data.mode)) {
      throw Error(`Canvas is busy. Action: ${this.data.mode}`);
    }

    // 如果状态没有变化（都启用或都禁用），则直接返回
    if (
      (this.data.splitData.enabled && splitData.enabled) ||
      (!this.data.splitData.enabled && !splitData.enabled)
    ) {
      return;
    }

    // 更新分割数据
    this.data.splitData = { ...splitData };
    // 通知画布分割状态已更新
    this.notify(UpdateReasons.SPLIT);
  }

  /**
   * 获取焦点数据
   * @returns 焦点数据的副本
   */
  public get focusData(): FocusData {
    return { ...this.data.focusData };
  }

  /**
   * 调整画布尺寸以适应容器
   * @param width 画布宽度
   * @param height 画布高度
   */
  public fitCanvas(width: number, height: number): void {
    // 更新画布尺寸
    this.data.canvasSize.height = height;
    this.data.canvasSize.width = width;

    // 计算图像偏移量，确保在最小缩放级别下图像能完全显示
    this.data.imageOffset = Math.floor(
      Math.max(
        this.data.canvasSize.height / FrameZoom.MIN,
        this.data.canvasSize.width / FrameZoom.MIN
      )
    );

    // 通知画布已适应容器
    this.notify(UpdateReasons.FITTED_CANVAS);
    // 通知对象已更新
    this.notify(UpdateReasons.OBJECTS_UPDATED);
    // 通知问题区域已更新
    this.notify(UpdateReasons.ISSUE_REGIONS_UPDATED);
  }

  /**
   * 取消当前操作并重置画布状态
   * 将画布恢复到默认状态，取消所有正在进行的操作
   */
  public cancel(): void {
    // 合并当前数据和默认数据，重置所有操作状态
    this.data = {
      ...this.data,
      ...defaultData,
    };
    // 通知画布操作已取消
    this.notify(UpdateReasons.CANCEL);
  }

  /**
   * 销毁画布模型
   * 发送销毁通知，清理资源
   */
  public destroy(): void {
    // 通知画布即将被销毁
    this.notify(UpdateReasons.DESTROY);
  }
}
