import { readonly } from "../reactive";

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
});
