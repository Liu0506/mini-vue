import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("effect fn", () => {
    const objRective = reactive({
      num: 1,
    });
    let nextNum;
    effect(() => {
      nextNum = objRective.num + 1;
    });

    expect(nextNum).toBe(2);
    objRective.num++;
    expect(nextNum).toBe(3);
  });

  it("effect fn return", () => {
    // effect 返回传入的 fn 函数
    let foo = 10;
    const fn = effect(() => {
      foo++;
      return "hello foo";
    });
    expect(foo).toBe(11);
    expect(fn()).toBe("hello foo");
    expect(foo).toBe(12);
  });
});
