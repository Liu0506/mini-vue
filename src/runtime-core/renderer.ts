import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode, container) {
  // 去处理组件
  // 判断 vnode 是不是一个 element
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
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

  const { props, children, shapeFlag } = vnode;

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
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
