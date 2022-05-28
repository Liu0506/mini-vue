import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export function reactive<T extends object>(raw: T) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly<T extends object>(raw: T) {
  return createReactiveObject(raw, readonlyHandlers);
}

function createReactiveObject<T extends object>(raw: T, baseHandles) {
  return new Proxy(raw, baseHandles);
}
