import { isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetting();

const readonlyGet = createGetter(true);

function createGetter(isReadonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);

    // 依赖收集
    if (!isReadonly) {
      track(target, key);
    }

    if (isObject(res)) {
      // // 用来打断点，测试数组的每一项改变，会不会触发依赖收集
      // if (JSON.stringify(res) === JSON.stringify([1, 3, 5])) {
      //   res;
      // }
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

function createSetting() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);

    // 依赖触发
    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`警告：只读属性${String(key)}不能进行赋值`, target);
    return true;
  },
};
