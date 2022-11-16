const publicPropertiesMap = {
  $el: (instance) => Reflect.get(instance.vnode, "el"),
  $slots: (instance) => Reflect.get(instance, "slots"),
  $props: (instance) => Reflect.get(instance, "props"),
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;

    const hasOwn = (val, key) => {
      return Object.prototype.hasOwnProperty.call(val, key);
    };
    // debugger;
    if (hasOwn(setupState, key)) {
      return Reflect.get(setupState, key);
    } else if (hasOwn(props, key)) {
      return Reflect.get(props, key);
    }

    // 获取节点上绑定的代理数据
    const publicGetter = Reflect.get(publicPropertiesMap, key);
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
