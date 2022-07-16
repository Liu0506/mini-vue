import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  it("happy path", () => {
    // ref
    // .value
    // 1. 缓存
    const user = reactive({
      age: 1,
    });

    const age = computed(() => {
      return user.age;
    });

    expect(age.value).toBe(1);
  });

  it("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);

    // lazy 懒执行，没调用 cValue.value 前，不会执行函数
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // get 获取缓存，不会重复触发 getter
    cValue.value; // get
    expect(getter).toHaveBeenCalledTimes(1);

    // 值改变时，回调又执行一次, 计算属性也跟着改变
    value.foo = 2; // trigger 收集依赖 -> effect
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
