import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { isReactive, reactive } from "./reactive";

export function ref(value?: unknown) {
  return createRef(value);
}

function createRef(rawValue: unknown) {
  return new RefImpl(rawValue);
}

class RefImpl {
  private _value: any;
  private _rawValue: any;

  public dep;
  public readonly __v_isRef = true;

  constructor(value) {
    this._rawValue = value;
    this._value = conver(value);

    this.dep = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = conver(newValue);
      triggerEffects(this.dep);
    }
  }
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

/**
 * 将对象数据转换成 reactive，基本类型不转换
 */
function conver(value) {
  return isObject(value) ? reactive(value) : value;
}

export function isRef(ref) {
  return !!(ref && ref.__v_isRef === true);
}

/**
 * 如果参数是 ref，则返回内部值，否则返回参数本身。
 * 这是 val = isRef(val) ? val.value : val 计算的一个语法糖。
 */
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

const shallowUnwrapHandlers = {
  get(target, key) {
    return unRef(Reflect.get(target, key));
  },
  set(target, key, value) {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      return (target[key].value = value);
    } else {
      return Reflect.set(target, key, value);
    }
  },
};

/**
 * 这个函数的目的是
 * 帮助解构 ref
 * 比如在 template 中使用 ref 的时候，直接使用就可以了
 * 例如： const count = ref(0) -> 在 template 中使用的话 可以直接 count
 * 解决方案就是通过 proxy 来对 ref 做处理
 */
export function proxyRefs(objectWithRefs) {
  // ref 中的 reactive 已处理，reactive 中的 ref 未处理，
  // 后续会在 reactive中，判断 ref 类型，进行特殊处理
  // 现在先不添加
  console.log(isReactive(objectWithRefs));
  console.log(objectWithRefs);
  console.log(shallowUnwrapHandlers);
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
