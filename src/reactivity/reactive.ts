import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__is_reactive",
  IS_READONLY = "__is_readonly",
}

export function reactive<T extends object>(raw: T) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly<T extends object>(raw: T) {
  return createReactiveObject(raw, readonlyHandlers);
}

function createReactiveObject<T extends object>(raw: T, baseHandles) {
  return new Proxy(raw, baseHandles);
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}
