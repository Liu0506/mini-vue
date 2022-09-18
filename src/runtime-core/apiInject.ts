import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent.provides;

    if (currentInstance.provides === parentProvides) {
      // 只在初始化时创建原型
      provides = currentInstance.provides = Object.create(parentProvides);
    }

    provides[key] = value;
  }
}

export function inject(key, defaultVal) {
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    const provides = currentInstance.parent.provides;
    if (key in provides) {
      return provides[key];
    } else {
      if (typeof defaultVal === "function") {
        return defaultVal();
      }
      return defaultVal;
    }
  }
}
