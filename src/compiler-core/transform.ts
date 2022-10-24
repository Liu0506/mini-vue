export function transform(root, options) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
}

function createTransformContext(root: any, options: any) {
  return {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };
}

/**
 * 遍历 ast 内部节点
 */
function traverseNode(node, context) {
  traversePlugin(context, node);
  traverseChildren(node, context);
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
  if (children) {
    for (const child of children) {
      traverseNode(child, context);
    }
  }
}
