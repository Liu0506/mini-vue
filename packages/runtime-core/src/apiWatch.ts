import { ReactiveEffect } from "@mini-vue/reactivity";
import { queuePreFlushCbs } from "./scheduler";

export function watchEffect(source, options?) {
  function job() {
    effect.run();
  }

  let cleanup;
  const onCleanup = function (fn) {
    cleanup = effect.onStop = () => {
      fn();
    };
  };

  function getter() {
    if (cleanup) {
      cleanup();
    }

    source(onCleanup);
  }

  const effect = new ReactiveEffect(getter, () => {
    queuePreFlushCbs(job);
  });

  effect.run();

  return () => {
    effect.stop();
  };
}
