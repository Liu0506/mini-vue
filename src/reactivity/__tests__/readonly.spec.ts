import { isReactive, isReadonly, reactive, readonly } from "../reactive";

describe("readonly", () => {
  it("readonly fn", () => {
    console.warn = jest.fn();
    const original = { foo: 1 };
    const obj = readonly(original);
    expect(original).not.toBe(obj);
    obj.foo++;
    expect(obj.foo).toBe(1);
  });

  it("readonly warn", () => {
    // 监听警告函数是否被调用了
    console.warn = jest.fn();

    const original = { foo: 1 };
    const obj = readonly(original);
    obj.foo++;
    expect(obj.foo).toBe(1);
    expect(console.warn).toHaveBeenCalled();
  });

  it("readonly/isReadonly", () => {
    const original = { foo: 1 };
    const obj = readonly(original);
    const obj2 = reactive(original);

    expect(isReadonly(original)).toBe(false);
    expect(isReadonly(obj)).toBe(true);

    expect(isReactive(obj2)).toBe(true);
    expect(isReadonly(obj2)).toBe(false);
  });

  it("readonly/deep", () => {
    console.warn = jest.fn();

    const original = {
      foo: {
        num: 1,
      },
      arr: [1, 3, 5],
    };
    const objReadonly = readonly(original);

    expect(isReadonly(objReadonly.foo)).toBe(true);
    expect(isReadonly(objReadonly.arr)).toBe(true);

    expect(isReactive(objReadonly.foo)).toBe(false);
    expect(isReactive(objReadonly.arr)).toBe(false);

    objReadonly.foo.num++;
    expect(console.warn).toHaveBeenCalled();
    expect(objReadonly.foo.num).toBe(1);
  });
});
