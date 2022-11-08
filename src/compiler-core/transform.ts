import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

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
  traversePlugin(context, node);
  traverseImportModuleKey(node, context);
}

/**
 * 遍历执行插件
 */
function traversePlugin(context: any, node: any) {
  const { nodeTransforms } = context;

  for (const nodeTransform of nodeTransforms) {
    nodeTransform(node);
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
  root.codegenNode = root.children[0];
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
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;
    default:
      break;
  }
}
