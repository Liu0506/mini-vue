import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter: any;
  // 标记，没有缓存时为 true；或者数据改变了，也为 true
  private _dirty = true;
  private _value;
  private _effect: ReactiveEffect;

  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    // 当依赖响应对象值发生改变时 effect
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
