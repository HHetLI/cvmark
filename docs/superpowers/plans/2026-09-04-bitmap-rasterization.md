# Bitmap Rasterization Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use supo-subagent-driven-development (recommended) or supo-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Retroactive note:** This plan documents a change that was implemented via
> TDD and committed on `feature/add-bitmap-mode`. The task/step structure below
> reflects the TDD cycle that was/should be followed. Each Task is independently
> testable.

**Goal:** Add an optional bitmap rasterization layer that renders all annotation objects to a single canvas as a binary preview, with a public `bitmap(enable)` API.

**Architecture:** A pure `renderBitmap(ctx, states, width, height, drawMask)` handles all shape→canvas geometry; `CanvasViewImpl.redrawBitmap()` is a thin wrapper. `canvas.bitmap → model.bitmap` (model owns `imageBitmap` + `BITMAP` notify); view reads `model.imageBitmap`. The controller is not involved.

**Tech Stack:** TypeScript (ESM), Vitest + jsdom, Biome, svg.js / fabric (existing).

## Global Constraints

- TypeScript ESM project; `"type": "module"`.
- Public API additions must be declared on the `CanvasModel` interface, the
  `Canvas` class, and (if a getter) exposed readonly.
- Reuse existing helpers: `rotate2DPoints`, `expandChannels`,
  `imageDataToDataURL` from `src/utils/shared.ts`. Do not duplicate logic.
- Style: Biome, double quotes, line endings LF for new files.
- `#cvat_canvas_bitmap` CSS already exists in `src/styles/canvas.scss`
  (z-index 4, `background: black`, `image-rendering: pixelated`,
  `pointer-events: none`). Do not re-add.
- Update reason must be `UpdateReasons.BITMAP` (`"bitmap"`), already defined.
- Test runner: Vitest; config at `vitest.config.ts` (jsdom env,
  `include: ['src/**/*.test.ts']`).

---

### Task 1: Test infrastructure

**Files:**
- Modify: `package.json` (scripts)
- Create: `vitest.config.ts`

- [ ] **Step 1: Add vitest + jsdom dev dependencies** via `npm install -D vitest jsdom`.
- [ ] **Step 2: Wire the `test` script** to `vitest run` (replace the placeholder)
  and add `test:watch`.
- [ ] **Step 3: Create `vitest.config.ts`** with `environment: 'jsdom'`,
  `globals: true`, `include: ['src/**/*.test.ts']`.
- [ ] **Step 4: Verify** — run `npx vitest run`; expect "0 test files found /
  passWithNoTests" (no tests yet).

---

### Task 2: Model — `bitmap(enabled)` + `imageBitmap` + `BITMAP` notify

**Files:**
- Modify: `src/core/canvasModel.ts` (interface, `data` type, init, getter, method)
- Test: `src/core/canvasModel.test.ts`

**Interfaces:**
- Consumes: `CanvasModelImpl` (extends `MasterImpl`), `UpdateReasons.BITMAP`.
- Produces: `bitmap(enabled: boolean): void`; readonly `imageBitmap: boolean`.

- [ ] **Step 1: Write the failing test** `canvasModel.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { CanvasModelImpl, UpdateReasons } from './canvasModel';
import type { Listener, Master } from '../events/master';

function reasons(model: Master): string[] {
  const r: string[] = [];
  model.subscribe({ notify(_m: Master, reason: string): void { r.push(reason); } } as Listener);
  return r;
}

describe('CanvasModelImpl.bitmap', () => {
  it('enables bitmap and notifies BITMAP', () => {
    const m = new CanvasModelImpl();
    const r = reasons(m);
    m.bitmap(true);
    expect(m.imageBitmap).toBe(true);
    expect(r).toContain(UpdateReasons.BITMAP);
  });
  it('defaults to false', () => {
    expect(new CanvasModelImpl().imageBitmap).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/core/canvasModel.test.ts`
  Expected: FAIL — `m.bitmap is not a function`, `m.imageBitmap` undefined.

- [ ] **Step 3: Implement** — add `imageBitmap: boolean` to the `data` type and
  `imageBitmap: false` to the init; declare `bitmap(enabled)` + `readonly
  imageBitmap` on `CanvasModel`; add `get imageBitmap()` and
  `public bitmap(enabled): void` calling `this.notify(UpdateReasons.BITMAP)`.

- [ ] **Step 4: Run test to verify it passes**
  Expected: `2 passed`.

- [ ] **Step 5: Commit** — `git commit -m "feat(canvas): add bitmap flag to model"`.

---

### Task 3: Pure renderer — `renderBitmap`

**Files:**
- Create: `src/core/bitmapRenderer.ts`
- Test: `src/core/bitmapRenderer.test.ts`

**Interfaces:**
- Consumes: `rotate2DPoints` from `../utils/shared`.
- Produces:
  - `BitmapDrawState { hidden?; outside?; shapeType: string; points: number[]; rotation?: number }`
  - `MaskDrawHandler = (ctx: CanvasRenderingContext2D, state: BitmapDrawState) => void`
  - `renderBitmap(ctx, states, width, height, drawMask): void`

- [ ] **Step 1: Write the failing test** — update a mock 2D context that records
  calls (`clearRect/beginPath/moveTo/lineTo/closePath/fill/ellipse/drawImage`)
  and assert: clears + disables smoothing; skips hidden/outside; draws polygon
  (moveTo + 3 lineTo + closePath + fill); rectangle (6 rotated points); ellipse
  (center/radii/angle); mask via `drawMask` callback.
- [ ] **Step 2: Run to verify it fails** (module `./bitmapRenderer` unresolved).
- [ ] **Step 3: Implement** `renderBitmap` per spec (rectangle/polygon/cuboid/
  ellipse/mask, skip hidden/outside).
- [ ] **Step 4: Verify passes**.
- [ ] **Step 5: Commit** — `git commit -m "feat(canvas): add bitmap renderer"`.

---

### Task 4: View wiring + public API

**Files:**
- Modify: `src/core/canvasView.ts` (field, element, reason branch, OBJECTS_UPDATED
  hook, `redrawBitmap()`), `src/core/canvas.ts` (`bitmap(enable)`).

**Interfaces:**
- Consumes: `renderBitmap`, `expandChannels`, `imageDataToDataURL`; sets/reads
  `model.imageBitmap`.

- [ ] **Step 1: Add field** `private bitmap: HTMLCanvasElement` and
  `private bitmapUpdateReqId: number`.
- [ ] **Step 2: In constructor** create `#cvat_canvas_bitmap`
  (`document.createElement('canvas')`, `style.display='none'`), append between
  `masksContent` and `content`.
- [ ] **Step 3: Add `redrawBitmap()`** — size from background, get ctx, call
  `renderBitmap(ctx, this.controller.objects, width, height, drawMaskCallback)`.
  Mask callback returns a `Promise<void>` that resolves after the `<img>` loads;
  the URL is auto-released by `imageDataToDataURL`'s `.finally()`; drop stale
  draws via `bitmapUpdateReqId`.
- [ ] **Step 4: Wire reasons** — `else if (reason === UpdateReasons.BITMAP)` shows/
  hides the bitmap and calls `redrawBitmap()`; append
  `if (model.imageBitmap && reason === OBJECTS_UPDATED) this.redrawBitmap();` at
  the end of `notify`.
- [ ] **Step 5: Add bitmap to `moveCanvas`/`resizeCanvas`/`transformCanvas` loops.**
- [ ] **Step 6: Add public `bitmap(enable)` to `Canvas`** calling `this.model.bitmap`.
- [ ] **Step 7: Verify** — add the `bitmap` entry to README; run `npx vitest run`
  (all green) and `npx biome check` on the new files.
- [ ] **Step 8: Commit** — `git commit -m "feat(canvas): wire bitmap layer + public API"`.

---

## Self-Review

- **Spec coverage:** Task 2 → model bits; Task 3 → renderer; Task 4 → view wiring
  + API + README. No spec requirement is left without a task.
- **Placeholders:** None — steps contain concrete code/commands.
- **Type consistency:** `bitmap(enable: boolean)`, `imageBitmap: boolean`,
  `renderBitmap(ctx, states, width, height, drawMask)` are used consistently
  across all tasks.
