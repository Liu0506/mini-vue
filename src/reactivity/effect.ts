import { extend } from "../shared";

let targetMap = new WeakMap();
let activeEffect;
/**
 * 收集依赖
 */
class ReactiveEffect {
  private _fn: any;
  active = true;
  deps: any[] = [];
  onStop?: () => void;

  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    return this._fn();
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

  // 防止添加 undefined 和重复的数据
  if (!activeEffect || dep.has(activeEffect)) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  // 获取所有依赖
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);

  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
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
}
