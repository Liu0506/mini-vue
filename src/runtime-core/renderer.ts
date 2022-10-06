import { effect } from "../reactivity/effect";
import { createRendererIterFace } from "../runtime-dom";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, isSomeVNodeType, Text } from "./vnode";

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
    patch(null, vnode, container, null, null);
  }

  function patch(n1, n2, container, parentComponent, anchor) {
    // 去处理组件
    // 判断 n2 是不是一个 element
    const { shapeFlag, type } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor);
        }
        break;
    }
  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log("patchElement");
    console.log("container :>> ", container);
    // 对比 props
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    console.log("n1", n1);
    console.log("n2", n2);
    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
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
      // Text to Array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        // Array to Array ：后续需要改成双端算法
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }

  function patchKeyedChildren(
    c1: any[],
    c2: any[],
    container,
    parentComponent,
    parentAnchor
  ) {
    let i = 0; // 开始索引
    let e1 = c1.length - 1; // c1 结束的索引
    let e2 = c2.length - 1; // c2 结束的索引

    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];

      // 1. 左侧对比
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }

    // 2. 右侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];

      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    // 根据对比结果 i, e1, e2 判断元素怎么操作
    console.log(i, e1, e2);

    // 3. 新的节点比老的多，创建节点
    if (i > e1 && i <= e2) {
      const nextPos = e2 + 1;
      const anchor = nextPos < c2.length ? c2[nextPos].el : parentAnchor;
      while (i <= e2) {
        console.log(`需要新创建一个 vnode: ${c2[i].key}`);
        patch(null, c2[i], container, parentComponent, anchor);
        i++;
      }
    } else if (i > e2 && i <= e1) {
      // 4. 新的节点比老节点少，删除节点
      while (i <= e1) {
        console.log(`需要删除当前的 vnode: ${c1[i].key}`);
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      console.log("两边对比完，开始对比中间部分");
      // 两边对比完，开始对比中间部分
      let s1 = i;
      let s2 = i;

      const toBePatched = e2 - s2 + 1; // 中间部分需要对比的个数
      let patched = 0; // 对比的变化下标
      const keyToNewIndexMap = new Map(); // 将新的vnode的key和位置下标，保存到映射表，用于新旧vnode对比

      // 遍历新的
      for (let j = s2; j <= e2; j++) {
        const nextChild = c2[j];
        keyToNewIndexMap.set(nextChild.key, j);
      }

      for (let j = s1; j <= e1; j++) {
        const prevChild = c1[j];

        // 如果已经对比完了，或不需要对比，直接删除旧元素
        if (patched >= toBePatched) {
          hostRemove(prevChild.el);
          continue;
        }

        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (let k = 0; k <= e2; k++) {
            if (isSomeVNodeType(prevChild, c2[k])) {
              newIndex = k;
              break;
            }
          }
        }

        if (newIndex === undefined) {
          // 没有在新的 vnode 里面，也直接删除
          hostRemove(prevChild.el);
        } else {
          patch(prevChild, c2[newIndex], container, parentComponent, null);
          patched++;
        }
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

  function mountElement(vnode, container, parentComponent, anchor) {
    const el = (vnode.el = hostCreateElement(vnode.type));

    const { props, children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      // 绑定子元素
      mountChildren(vnode.children, el, parentComponent, anchor);
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
    hostInsert(el, container, anchor);
  }

  function mountChildren(children, el: any, parentComponent, anchor) {
    for (const child of children) {
      patch(null, child, el, parentComponent, anchor);
    }
  }

  function processComponent(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    mountComponent(n2, container, parentComponent, anchor);
  }

  function mountComponent(initnalVnode, container, parentComponent, anchor) {
    const instance = createComponentInstance(initnalVnode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, initnalVnode, container, anchor);
  }

  function setupRenderEffect(instance, initnalVnode, container, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("初始化");

        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        instance.subTree = subTree;

        // vnode -> patch
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance, anchor);
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
        patch(prevSubTree, subTree, container, instance, anchor);
      }
    });
  }

  function processFragment(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    mountChildren(n2.children, container, parentComponent, anchor);
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
