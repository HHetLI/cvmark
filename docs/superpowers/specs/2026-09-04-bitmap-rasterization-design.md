# Bitmap Rasterization Mode — Design

> **Note:** This spec is written retroactively. It documents the design and
> implementation that was committed (see `feature/add-bitmap-mode`). The
> canonical superpowers flow (brainstorm → spec → plan → implement) was not
> followed for this change; this document records the design that was implemented.

## Goal

Add an optional **bitmap rasterization layer** to the cvmark canvas: when
enabled, all annotation objects are drawn onto a single canvas as a binary
"black background + white shapes" preview. This mirrors the `Show bitmap`
feature in the latest `cvat-canvas`.

## Background

cvmark was extracted from an old `cvat-canvas`. The latest cvat-canvas added a
`bitmap(enabled)` API plus a `redrawBitmap()` path that rasterizes all shapes
into one `HTMLCanvasElement` for a fast per-object-less visualization. cvmark
lacked the wiring (the `.scss` for `#cvat_canvas_bitmap` was already present).

## Approach

Two candidate designs were considered:

1. **Inline `redrawBitmap()` on `CanvasViewImpl`** (cvat's exact structure).
   Pro: faithful port. Con: hard to unit-test — `CanvasViewImpl` depends on
   `fabric`, `svg.js`, and native canvas, none usable in jsdom.
2. **Pure, injectable renderer + thin view wrapper** (chosen).
   The shape→canvas geometry lives in a pure function `renderBitmap(ctx, states,
   width, height, drawMask)` that takes a `CanvasRenderingContext2D` and an
   injected mask callback. `CanvasViewImpl.redrawBitmap()` becomes a thin wrapper
   that obtains the context and calls it. The mask RLE→`drawImage` path stays as
   an injected callback because it relies on `OffscreenCanvas`/`URL`/`Image`
   browser APIs unavailable in jsdom.

**Recommended/selected: Option 2.** It keeps the feature cvat-faithful at the API
level while isolating the testable geometry logic. `rotate2DPoints`,
`expandChannels`, and `imageDataToDataURL` already exist in cvmark and are reused.

## Architecture

```
canvas.ts  public bitmap(enable) ──────▶ model.bitmap(enable)
canvasModel.ts  bitmap() sets data.imageBitmap → notify(UpdateReasons.BITMAP)
                readonly imageBitmap
canvasView.ts  #cvat_canvas_bitmap HTMLCanvasElement (z-index 4, hidden by default)
               ─ BITMAP reason: show/hide + redrawBitmap()
               ─ OBJECTS_UPDATED + imageBitmap: redrawBitmap()
               redrawBitmap() ──▶ renderBitmap(ctx, objects, w, h, drawMaskCallback)
bitmapRenderer.ts  renderBitmap(): pure geometry → canvas 2D calls
                   (rectangle/polygon/cuboid/ellipse/mask, skips hidden/outside)
```

Routing follows cvat: `canvas.bitmap → model.bitmap`, and the view reads
`model.imageBitmap`. The controller is **not** involved.

## Data Flow

1. UI calls `canvas.bitmap(true)`.
2. `model.bitmap(true)` sets `data.imageBitmap = true` and dispatches
   `UpdateReasons.BITMAP`.
3. View's `notify` handles `BITMAP`: shows `#cvat_canvas_bitmap`, calls
   `redrawBitmap()`.
4. `redrawBitmap()` snapshots the background size, gets the 2D context, and
   calls `renderBitmap(ctx, this.controller.objects, ...)`.
5. `renderBitmap` clears the canvas and draws each object:
   - `rectangle` → 6 rotated points → fill
   - `polygon`  → polyline → fill
   - `cuboid`   → front face + 5 projected faces
   - `ellipse`  → `ctx.ellipse` with rotation
   - `mask`     → injected `drawMask` (RLE → `ImageData` → `drawImage`)
   - `hidden`/`outside` objects are skipped
6. On later object changes (`OBJECTS_UPDATED`) while bitmap is on, the canvas
   re-rasterizes.

## Error Handling & Resource Safety

- **Async race guard:** `redrawBitmap` increments `bitmapUpdateReqId` and the
  mask callback checks it before `drawImage`; stale frame data is dropped.
- **URL cleanup:** cvmark's `imageDataToDataURL` already `revokeObjectURL`s the
  data URL in a `.finally()`, so the mask callback only resolves its promise —
  no double release.
- **No 2D context:** `redrawBitmap` returns early if `getContext('2d')` is null.

## Testing

- `canvasModel.test.ts` — `bitmap(true/false)` sets `imageBitmap` and notifies
  `BITMAP`; defaults to false. (test-first)
- `bitmapRenderer.test.ts` — `renderBitmap` clears + disables smoothing, skips
  hidden/outside, draws polygon/rectangle/ellipse/cuboid/mask via a mock context.
  (test-first for the core geometry; cuboid branch ported from cvat and its test
  added after)

## Files Touched

- **New:** `src/core/bitmapRenderer.ts`, `src/core/bitmapRenderer.test.ts`,
  `src/core/canvasModel.test.ts`, `vitest.config.ts`
- **Modified:** `src/core/canvas.ts`, `src/core/canvasModel.ts`,
  `src/core/canvasView.ts`, `package.json`, `package-lock.json`, `README.md`
- **Already present (reused):** `#cvat_canvas_bitmap` style in `canvas.scss`,
  `expandChannels`, `imageDataToDataURL`, `rotate2DPoints` in `shared.ts`
