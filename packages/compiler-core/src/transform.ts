import { NodeTypes } from "./ast";
import { CREATE_ELEMENT_VNODE, TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
  createRootCodegen(root);
  root.helpers = Array.from(context.helpers);
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Set(),
    helper(importModule) {
      context.helpers.add(importModule);
    },
  };
  return context;
}

/**
 * 遍历 ast 内部节点
 */
function traverseNode(node, context) {
  // 收集transform，比如收集 transform 1 2 3，最后执行顺序 3 2 1
  const exitFns: Function[] = [];

  traversePlugin(node, context, exitFns);
  traverseImportModuleKey(node, context);

  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}

/**
 * 遍历执行插件
 */
function traversePlugin(node: any, context: any, exitFns: any[]) {
  const { nodeTransforms } = context;

  for (const nodeTransform of nodeTransforms) {
    const onExit = nodeTransform(node, context);
    if (onExit) {
      if (Array.isArray(onExit)) {
        exitFns.push(...onExit);
      } else {
        exitFns.push(onExit);
      }
    }
  }
}

/**
 * 引入的模块
 * 比如 const { toDisplayString: _toDisplayString } = Vue 中的 toDisplayString
 */
function traverseImportModuleKey(node: any, context: any) {
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
    case NodeTypes.ROOT:
      traverseChildren(node, context);
      break;
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;
    // case NodeTypes.COMPOUND_EXPRESSION:
    //   traverseChildren(node, context);
    //   break;
    default:
      break;
  }
}

/**
 * 递归函数
 */
function traverseChildren(node: any, context: any) {
  const { children } = node;
  for (const child of children) {
    traverseNode(child, context);
  }
}

function createRootCodegen(root: any) {
  const child = root.children[0];
  if (child.type === NodeTypes.ELEMENT) {
    root.codegenNode = child.codegenNode;
  } else {
    root.codegenNode = root.children[0];
  }
}
