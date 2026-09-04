/**
 * 把高频请求合并到单个 requestAnimationFrame 帧内的调度器。
 *
 * 用于 pan/zoom/move 这类每个事件都会触发的更新：同一帧内的多次
 * 请求只保留最后一次回调，从而把 O(N) 的 transformCanvas 等操作
 * 从"每事件执行一次"降为"每帧最多一次"。
 */
export class RafCoalescer {
  private rafId: number | null = null;
  private pending: (() => void) | null = null;

  /** 请求在下一帧执行回调；若同一帧内已排定，则用最新回调替换。 */
  public request(callback: () => void): void {
    this.pending = callback;
    if (this.rafId !== null) return;

    this.rafId = window.requestAnimationFrame(() => {
      this.rafId = null;
      const fn = this.pending;
      this.pending = null;
      fn?.();
    });
  }

  /** 取消尚未执行的回调。 */
  public cancel(): void {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pending = null;
  }
}
