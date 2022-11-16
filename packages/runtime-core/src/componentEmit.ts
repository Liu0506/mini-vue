import { camelize } from "@mini-vue/shared";

export function emit(instance, event, ...args) {
  const { props } = instance;

  const toHandlerKey = (str: string) => {
    return str ? "on" + camelize(event, true) : "";
  };
  const HandleName = toHandlerKey(event);
  props[HandleName] && props[HandleName](...args);
}
