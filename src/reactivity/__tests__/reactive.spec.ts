import { isReactive, isReadonly, reactive, readonly } from "../reactive";

describe("reactive", () => {
  it("reactive fn", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });

  it("reactive/deep", () => {
    const original = {
      foo: {
        num: 1,
      },
      arr: [1, 3, 5],
    };
    const objReactive = reactive(original);

    expect(isReactive(objReactive.foo)).toBe(true);
    expect(isReactive(objReactive.arr)).toBe(true);

    expect(isReadonly(objReactive.foo)).toBe(false);
    expect(isReadonly(objReactive.arr)).toBe(false);
  });
});
