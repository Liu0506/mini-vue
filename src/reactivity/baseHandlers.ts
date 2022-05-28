import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetting();

const readonlyGet = createGetter(true);

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);

    // 依赖收集
    if (!isReadonly) {
      track(target, key);
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
}
