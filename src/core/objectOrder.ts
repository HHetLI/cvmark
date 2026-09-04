/**
 * z-order 签名项：一个对象的 clientID 及其 Z 序。
 */
export interface ZOrderItem {
  clientID: number;
  zOrder: number;
}

/**
 * 计算一组对象的 Z 序签名。
 *
 * 用于判断"对象之间的 Z 序排列"是否发生变化：同一次调用里对象集合
 * 相同且各自 zOrder 相同，则签名相等（无论输入顺序）。当签名相等时，
 * 说明无需对 SVG 容器里的全部 shape 做 O(N) 重排序。
 */
export function zOrderSignature(items: ZOrderItem[]): string {
  return items
    .map((item): string => `${item.clientID}:${item.zOrder}`)
    .sort()
    .join("|");
}
