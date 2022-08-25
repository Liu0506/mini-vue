const publicPropertiesMap = {
  $el: (instance) => Reflect.get(instance.vnode, "el"),
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance;
    if (key in setupState) {
      return Reflect.get(setupState, key);
    }

    // 获取节点上绑定的代理数据
    const publicGetter = Reflect.get(publicPropertiesMap, key);
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
