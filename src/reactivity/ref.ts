import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

export function ref(value?: unknown) {
  return createRef(value);
}

function createRef(rawValue: unknown) {
  return new RefImpl(rawValue);
}

class RefImpl {
  public dep;
  private _value: any;
  private _rawValue: any;

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
