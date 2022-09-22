import { createRenderer } from "../runtime-core";
export * from "../runtime-core";

function createElement(type) {
  return document.createElement(type);
}

function patchProp(el: HTMLElement, key, prevVal, nextVal) {
  const isOn = /^on[A-Z]/.test(key);
  if (isOn) {
    el.addEventListener(key.slice(2).toLowerCase(), nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}

function insert(el, container) {
  container.append(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}
