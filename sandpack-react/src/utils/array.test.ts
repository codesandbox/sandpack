import { shallowEqual } from "./array";

describe(shallowEqual, () => {
  it("should be different: when the first array is longer than the second one", () => {
    expect(shallowEqual(["1", "2"], ["1"])).toBe(false);
  });

  it("should be different: when the first array is shorter than the second one", () => {
    expect(shallowEqual(["1"], ["1", "2"])).toBe(false);
  });

  it("should be different: when an item is different", () => {
    expect(shallowEqual(["1", "2"], ["1", "3"])).toBe(false);
  });

  it("should be equal: when both are an empty array", () => {
    expect(shallowEqual([], [])).toBe(true);
  });
});
