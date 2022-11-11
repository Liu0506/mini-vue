import { isString } from "../shared";
import { NodeTypes } from "./ast";
import {
  CREATE_ELEMENT_VNODE,
  helperMapName,
  TO_DISPLAY_STRING,
} from "./runtimeHelpers";

export function generate(ast) {
  const context = createCodegenContext();
  const { push } = context;

  genFunctionPreamble(ast, context);

  const functionName = "render";
  const args = ["_ctx", "_cache"];
  const signature = args.join(", ");

  push(`function ${functionName}(${signature}) {\n`);
  push("  return ");
  genNode(ast.codegenNode, context);
  push("\n}");

  return {
    code: context.code,
  };
}

function genFunctionPreamble(ast: any, context) {
  const { push } = context;

  const vueBingingIn = "Vue";
  const helpers = ast.helpers;
  const aliasHelper = (key) => `${helperMapName[key]}: _${helperMapName[key]}`;

  if (helpers.length) {
    push(
      `const { ${helpers.map(aliasHelper).join(", ")} } = ${vueBingingIn}\n`
    );
  }

  push("return ");
}

function createCodegenContext() {
  const context = {
    code: "",
    push(source) {
      context.code += source;
    },
    helper(key) {
      return `_${helperMapName[key]}`;
    },
  };
  return context;
}

function genNode(node, context) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context);
      break;

    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context);
      break;

    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;

    case NodeTypes.ELEMENT:
      genElement(node, context);
      break;
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context);
      break;

    default:
      break;
  }
}

function genElement(node: any, context: any) {
  const { push, helper } = context;
  const { tag, children, props } = node;
  push(`${helper(CREATE_ELEMENT_VNODE)}(`);
  genNodeList(genNullableArgs([tag, props, children]), context);
  // genNode(children, context);
  push(`)`);
}

function genNodeList(nodes: any[], context) {
  const { push } = context;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isString(node)) {
      push(node);
    } else {
      genNode(node, context);
    }

    if (i < nodes.length - 1) {
      push(", ");
    }
  }
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context;
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(`)`);
}

function genText(node, context) {
  context.push(`"${node.content}"`);
}

function genExpression(node: any, context: any) {
  const { push } = context;
  push(node.content);
}

function genCompoundExpression(node: any, context: any) {
  const { children } = node;
  const { push } = context;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isString(child)) {
      push(child);
    } else {
      genNode(child, context);
    }
  }
}

function genNullableArgs(args: any[]) {
  return args.map((arg) => arg || "null");
}
