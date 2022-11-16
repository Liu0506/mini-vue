import { createVNode, Fragment } from "../vnode";

export function renderSlots(slots, name: string, props = {}) {
  const slot = slots[name];
  if (typeof slot === "function") {
    return createVNode(Fragment, {}, slot(props));
  }
}
