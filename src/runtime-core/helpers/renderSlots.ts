import { createVNode } from "../vnode";

export function renderSlots(slots, name: string, props = {}) {
  const slot = slots[name];
  if (typeof slot === "function") {
    return createVNode("div", {}, slot(props));
  }
}
