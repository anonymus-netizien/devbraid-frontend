import { describe, it, expect } from "bun:test";
import { cn } from "../utils";

describe("cn", () => {
  it("merges class names using clsx", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional class names with objects", () => {
    expect(cn("base", { foo: true, bar: false })).toBe("base foo");
  });

  it("handles array of classes", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("handles mixed inputs (strings, objects, arrays)", () => {
    expect(cn("a", ["b", { c: true, d: false }], "e")).toBe("a b c e");
  });

  it("resolves tailwind class conflicts via twMerge", () => {
    // twMerge should keep the last conflicting utility
    expect(cn("px-4", "px-2")).toBe("px-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("resolves multiple tailwind conflicts in one call", () => {
    expect(cn("px-4 py-2", "px-2 py-4")).toBe("px-2 py-4");
  });

  it("preserves non-conflicting classes", () => {
    expect(cn("flex", "items-center", "gap-2")).toBe("flex items-center gap-2");
  });

  it("handles undefined and null values gracefully", () => {
    expect(cn("foo", undefined, "bar", null)).toBe("foo bar");
  });

  it("returns empty string for no valid inputs", () => {
    expect(cn()).toBe("");
    expect(cn(false, null, undefined)).toBe("");
  });

  it("handles boolean values correctly", () => {
    expect(cn(true && "visible", false && "hidden")).toBe("visible");
  });
});
