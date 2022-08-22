export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance;
    if (key in setupState) {
      return Reflect.get(setupState, key);
    }

    // 获取节点上的el
    if (key === "$el") {
      return Reflect.get(instance.vnode, "el");
    }
  },
};
