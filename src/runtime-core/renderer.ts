import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  // patch
  patch(vnode, container, null);
}

function patch(vnode, container, parentComponent) {
  // 去处理组件
  // 判断 vnode 是不是一个 element
  const { shapeFlag, type } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent);
      }
      break;
  }
}

function processElement(vnode, container, parentComponent) {
  mountElement(vnode, container, parentComponent);
}

function mountElement(vnode, container, parentComponent) {
  const el = document.createElement(vnode.type);
  vnode.el = el;

  const { props, children, shapeFlag } = vnode;

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
    // 绑定子元素
    mountChildren(children, el, parentComponent);
  }

  for (const key in props) {
    const val = props[key];
    const isOn = /^on[A-Z]/.test(key);
    if (isOn) {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else {
      el.setAttribute(key, val);
    }
  }
  container.append(el);
}

function mountChildren(children: any[], el: any, parentComponent) {
  for (const child of children) {
    patch(child, el, parentComponent);
  }
}

function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

function mountComponent(initnalVnode, container, parentComponent) {
  const instance = createComponentInstance(initnalVnode, parentComponent);

  setupComponent(instance);

  setupRenderEffect(instance, initnalVnode, container);
}

function setupRenderEffect(instance, initnalVnode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container, instance);
  initnalVnode.el = subTree.el;
}

function processFragment(vnode: any, container: any, parentComponent) {
  const { children } = vnode;
  mountChildren(children, container, parentComponent);
}
function processText(vnode: any, container: HTMLElement) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
