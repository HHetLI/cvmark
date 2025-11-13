/** 基础描边宽度，用于绘制形状轮廓 */
const BASE_STROKE_WIDTH = 1.25;
/** 基础网格线宽度 */
const BASE_GRID_WIDTH = 2;
/** 基础点大小，用于绘制控制点 */
const BASE_POINT_SIZE = 4;
/** 文本边距，控制文本与形状之间的间距 */
const TEXT_MARGIN = 10;
/** 大小阈值，用于判断形状是否太小而需要特殊处理 */
const SIZE_THRESHOLD = 1;
/** 点集描边宽度，用于绘制多边形等点集形状 */
const POINTS_STROKE_WIDTH = 1;
/** 选中状态下点集的描边宽度 */
const POINTS_SELECTED_STROKE_WIDTH = 4;
/** 最小边长，用于限制形状的最小尺寸 */
const MIN_EDGE_LENGTH = 3;
/** 激活状态下立方体边缘的描边宽度 */
const CUBOID_ACTIVE_EDGE_STROKE_WIDTH = 2.5;
/** 非激活状态下立方体边缘的描边宽度 */
const CUBOID_UNACTIVE_EDGE_STROKE_WIDTH = 1.75;
/** 未定义属性值的占位符 */
const UNDEFINED_ATTRIBUTE_VALUE = "__undefined__";
/** 箭头形状的SVG路径定义 */
const ARROW_PATH =
  "M13.162 6.284L.682.524a.483.483 0 0 0-.574.134.477.477 0 " +
  "0 0-.012.59L4.2 6.72.096 12.192a.479.479 0 0 0 .585.724l12.48-5.76a.48.48 0 0 0 0-.872z";
/** 基础图案大小，用于填充图案 */
const BASE_PATTERN_SIZE = 5;
/** 默认角度捕捉精度（调整大小时） */
const SNAP_TO_ANGLE_RESIZE_DEFAULT = 0.1;
/** 按住Shift键时的角度捕捉精度（调整大小时） */
const SNAP_TO_ANGLE_RESIZE_SHIFT = 15;
/** 最小文本字体大小 */
const MINIMUM_TEXT_FONT_SIZE = 8;
/** 骨架矩形的边距 */
const SKELETON_RECT_MARGIN = 20;

/** 默认形状文本大小 */
const DEFAULT_SHAPE_TEXT_SIZE = 12;
/** 默认形状文本内容，定义显示哪些信息 */
const DEFAULT_SHAPE_TEXT_CONTENT = "id"; // "id,label,attributes,source,descriptions";
/** 默认形状文本位置：自动或居中 */
const DEFAULT_SHAPE_TEXT_POSITION: "auto" | "center" = "auto";
/** 默认未定义属性值占位符 */
const DEFAULT_UNDEFINED_ATTR_VALUE = "__undefined__";

/** 冲突状态的颜色 */
const CONFLICT_COLOR = "#ff4800";
/** 警告状态的颜色 */
const WARNING_COLOR = "#ff7301";
/** 阴影状态的颜色 */
const SHADED_COLOR = "#808080";

export default {
  BASE_STROKE_WIDTH,
  BASE_GRID_WIDTH,
  BASE_POINT_SIZE,
  TEXT_MARGIN,
  SIZE_THRESHOLD,
  POINTS_STROKE_WIDTH,
  POINTS_SELECTED_STROKE_WIDTH,
  MIN_EDGE_LENGTH,
  CUBOID_ACTIVE_EDGE_STROKE_WIDTH,
  CUBOID_UNACTIVE_EDGE_STROKE_WIDTH,
  UNDEFINED_ATTRIBUTE_VALUE,
  ARROW_PATH,
  BASE_PATTERN_SIZE,
  SNAP_TO_ANGLE_RESIZE_DEFAULT,
  SNAP_TO_ANGLE_RESIZE_SHIFT,
  DEFAULT_SHAPE_TEXT_SIZE,
  DEFAULT_SHAPE_TEXT_CONTENT,
  DEFAULT_SHAPE_TEXT_POSITION,
  DEFAULT_UNDEFINED_ATTR_VALUE,
  MINIMUM_TEXT_FONT_SIZE,
  SKELETON_RECT_MARGIN,
  CONFLICT_COLOR,
  WARNING_COLOR,
  SHADED_COLOR,
};
