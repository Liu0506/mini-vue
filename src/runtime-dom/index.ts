import { createRenderer } from "../runtime-core";
export * from "../runtime-core";

function createElement(type: string) {
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

function insert(el: HTMLElement, container: HTMLElement) {
  container.append(el);
}

function setElementText(el: HTMLElement, text: string) {
  el.textContent = text;
}

function remove(child: HTMLElement) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  setElementText,
  remove,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

export interface createRendererIterFace {
  createElement: typeof createElement;
  patchProp: typeof patchProp;
  insert: typeof insert;
  setElementText: typeof setElementText;
  remove: typeof remove;

  [key: string]: any;
}
