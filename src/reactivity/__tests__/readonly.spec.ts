import { isReactive, isReadonly, reactive, readonly } from "../reactive";

describe("readonly", () => {
  it("readonly fn", () => {
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
});
