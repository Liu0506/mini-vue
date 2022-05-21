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

  it("effect/scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);
  });
});
