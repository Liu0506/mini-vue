import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode, container) {
  // 去处理组件
  // 判断 vnode 是不是一个 element
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else {
    processComponent(vnode, container);
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.type);
  vnode.el = el;

  const { props, children } = vnode;

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    // 绑定子元素
    mountChildren(children, el);
  }

  for (const propsKey in props) {
    if (props.hasOwnProperty(propsKey)) {
      const val = props[propsKey];
      el.setAttribute(propsKey, val);
    }
  }
  container.append(el);
}

function mountChildren(children: any[], el: any) {
  for (const child of children) {
    patch(child, el);
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(initnalVnode, container) {
  const instance = createComponentInstance(initnalVnode);

  setupComponent(instance);

  setupRenderEffect(instance, initnalVnode, container);
}

function setupRenderEffect(instance, initnalVnode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container);
  initnalVnode.el = subTree.el;
}
