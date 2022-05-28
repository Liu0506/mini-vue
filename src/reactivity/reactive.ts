import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export function reactive<T extends object>(raw: T) {
  return new Proxy(raw, mutableHandlers);
}

export function readonly<T extends object>(raw: T) {
  return new Proxy(raw, readonlyHandlers);
}

