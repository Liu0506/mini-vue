let targetMap = new WeakMap();
let activeEffect;
/**
 * 收集依赖
 */
class ReactiveEffect {
  private _fn: any;

  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }
}

export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
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

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();

  // 把 _effect.run 这个方法返回
  // 让用户可以自行选择调用的时机（调用 fn）
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
