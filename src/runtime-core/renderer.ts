import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode, container) {
  // 去处理组件
  // 判断 vnode 是不是一个 element
  const { shapeFlag, type } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
      break;
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.type);
  vnode.el = el;

  const { props, children, shapeFlag } = vnode;

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
    // 绑定子元素
    mountChildren(children, el);
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

function processFragment(vnode: any, container: any) {
  const { children } = vnode;
  mountChildren(children, container);
}
function processText(vnode: any, container: HTMLElement) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
