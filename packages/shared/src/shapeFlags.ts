export const enum ShapeFlags {
  ELEMENT = 1,                    // 00000001 元素节点
  FUNCTIONAL_COMPONENT = 1 << 1,  // 00000010 函数组件
  STATEFUL_COMPONENT = 1 << 2,    // 00000100 有状态组件
  TEXT_CHILDREN = 1 << 3,         // 00001000 文本子节点
  ARRAY_CHILDREN = 1 << 4,        // 00010000 数组子节点
  SLOTS_CHILDREN = 1 << 5,        // 00100000 slot 节点
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
