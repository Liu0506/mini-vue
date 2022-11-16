import { extend } from "@mini-vue/shared";

let targetMap = new WeakMap();
let activeEffect;
let shouldTrack;
/**
 * 收集依赖
 */
export class ReactiveEffect {
  private _fn: any;
  active = true;
  deps: any[] = [];
  onStop?: () => void;

  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    if (!this.active) {
      return this._fn();
    }

    // this._fn(); 操作中，又可能要收集依赖，所以要先设置成 true
    shouldTrack = true;
    activeEffect = this;

    const result = this._fn();
    // reset
    shouldTrack = false;
    return result;
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

export function track(target, key) {
  // 防止添加 undefined 和 stop后继续收集依赖
  // if (!activeEffect || !shouldTrack) return;
  if (!isTracking()) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep: Set<any> = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  trackEffects(dep);
}

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  // 获取所有依赖
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);

  triggerEffects(dep);
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function stop(runner) {
  runner.effect.stop();
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();

  // 把 _effect.run 这个方法返回
  // 让用户可以自行选择调用的时机（调用 fn）
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}
