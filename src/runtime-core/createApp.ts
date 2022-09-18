import { createVNode } from "./vnode";

export function createAppApi(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 先转换成虚拟节点 component -> vnode
        // 后续所有操作，都是基于虚拟节点
        const vnode = createVNode(rootComponent);

        render(vnode, rootContainer);
      },
    };
  };
}
