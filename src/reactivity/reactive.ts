import { isObject } from "../shared";
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_is_reactive",
  IS_READONLY = "__v_is_readonly",
}

export function reactive<T extends object>(raw: T) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly<T extends object>(raw: T) {
  return createReactiveObject(raw, readonlyHandlers);
}

export function shallowReadonly<T extends object>(raw: T) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}

function createReactiveObject<T extends object>(raw: T, baseHandles) {
  if (!isObject(raw)) {
    console.warn(`target ${raw} 必须是一个对象`);
  }
  return new Proxy(raw, baseHandles);
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isProxy(value) {
  return isReadonly(value) || isReactive(value);
}
