import { describe, expect, it } from "vitest";
import { type ZOrderItem, zOrderSignature } from "./objectOrder";

describe("zOrderSignature", () => {
  it("produces the same signature for the same set of z-orders", () => {
    const a: ZOrderItem[] = [
      { clientID: 1, zOrder: 2 },
      { clientID: 2, zOrder: 1 },
    ];
    const b: ZOrderItem[] = [
      { clientID: 2, zOrder: 1 },
      { clientID: 1, zOrder: 2 },
    ];
    expect(zOrderSignature(a)).toBe(zOrderSignature(b));
  });

  it("produces a different signature when a z-order changes", () => {
    const a: ZOrderItem[] = [
      { clientID: 1, zOrder: 1 },
      { clientID: 2, zOrder: 2 },
    ];
    const b: ZOrderItem[] = [
      { clientID: 1, zOrder: 2 },
      { clientID: 2, zOrder: 2 },
    ];
    expect(zOrderSignature(a)).not.toBe(zOrderSignature(b));
  });

  it("produces a different signature when an object is added or removed", () => {
    const a: ZOrderItem[] = [{ clientID: 1, zOrder: 1 }];
    const b: ZOrderItem[] = [
      { clientID: 1, zOrder: 1 },
      { clientID: 2, zOrder: 2 },
    ];
    expect(zOrderSignature(a)).not.toBe(zOrderSignature(b));
  });

  it("is stable regardless of input order", () => {
    const a: ZOrderItem[] = [
      { clientID: 3, zOrder: 3 },
      { clientID: 1, zOrder: 1 },
    ];
    const b: ZOrderItem[] = [
      { clientID: 1, zOrder: 1 },
      { clientID: 3, zOrder: 3 },
    ];
    expect(zOrderSignature(a)).toBe(zOrderSignature(b));
  });
});
