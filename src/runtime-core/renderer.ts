import { effect } from "../reactivity/effect";
import { createRendererIterFace } from "../runtime-dom";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options: createRendererIterFace) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode, container) {
    // patch
    patch(null, vnode, container, null);
  }

  function patch(n1, n2, container, parentComponent) {
    // 去处理组件
    // 判断 n2 是不是一个 element
    const { shapeFlag, type } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container, parentComponent);
    }
  }

  function patchElement(n1, n2, container, parentComponent) {
    console.log("patchElement");
    console.log("container :>> ", container);
    // 对比 props
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    console.log("n1", n1);
    console.log("n2", n2);
    patchChildren(n1, n2, el, parentComponent);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag;
    const c1 = n1.children;
    const shapeFlag = n2.shapeFlag;
    const c2 = n2.children;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // to Text
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // Array to Text：解除挂载元素
        unmountChildren(n1.children);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      // to Array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent)
      }
    }
  }

  function unmountChildren(children: any[]) {
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      hostRemove(element.el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];
      if (prevProp !== nextProp) {
        // 触发更新 prop
        hostPatchProp(el, key, prevProp, nextProp);
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            const prevProp = oldProps[key];
            hostPatchProp(el, key, prevProp, null);
          }
        }
      }
    }
  }

  function mountElement(vnode, container, parentComponent) {
    const el = (vnode.el = hostCreateElement(vnode.type));

    const { props, children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      // 绑定子元素
      mountChildren(vnode.children, el, parentComponent);
    }

    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
      // const isOn = /^on[A-Z]/.test(key);
      // if (isOn) {
      //   el.addEventListener(key.slice(2).toLowerCase(), val);
      // } else {
      //   el.setAttribute(key, val);
      // }
    }
    // container.append(el);
    hostInsert(el, container);
  }

  function mountChildren(children, el: any, parentComponent) {
    for (const child of children) {
      patch(null, child, el, parentComponent);
    }
  }

  function processComponent(n1, n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(initnalVnode, container, parentComponent) {
    const instance = createComponentInstance(initnalVnode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, initnalVnode, container);
  }

  function setupRenderEffect(instance, initnalVnode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("初始化");

        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        instance.subTree = subTree;

        // vnode -> patch
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance);
        initnalVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("更新");

        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;

        // vnode -> patch
        // vnode -> element -> mountElement
        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2.children, container, parentComponent);
  }
  function processText(n1, n2: any, container: HTMLElement) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  return {
    createApp: createAppApi(render),
  };
}
