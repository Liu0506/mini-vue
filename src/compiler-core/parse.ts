import { NodeTypes } from "./ast";

export function baseParse(content: string) {
  const ctx = createParserContext(content);
  return createRoot(parseChildren(ctx));
}

function createParserContext(content: string) {
  return {
    soruce: content,
  };
}

function parseChildren(context): any {
  const nodes: any = [];

  let node;
  if (context.soruce.startsWith("{{")) {
    node = parseInterpolation(context);
  }
  nodes.push(node);

  return nodes;
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.soruce.indexOf(
    closeDelimiter,
    openDelimiter.length
  );

  advanceBy(context, openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;

  const rawContent = context.soruce.slice(0, rawContentLength);
  const content = rawContent.trim();

  advanceBy(context, rawContentLength + closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function advanceBy(context: any, length: number) {
  context.soruce = context.soruce.slice(length);
}

function createRoot(children) {
  return {
    children,
  };
}
