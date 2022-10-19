import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End,
}

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
  } else if (context.soruce[0] === "<") {
    if (/[a-z]/i.test(context.soruce[1])) {
      node = parseElement(context);
    }
  } else {
    node = parseText(context);
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

function parseElement(context: any) {
  // 1. 解析 tag
  const element = parseTag(context, TagType.Start);

  parseTag(context, TagType.End);

  return element;
}

function parseTag(context: any, type: TagType) {
  const match = /^<\/?([a-z]+)/i.exec(context.soruce) as RegExpExecArray;
  let tag = match[1];
  advanceBy(context, match[0].length);
  advanceBy(context, 1);

  if (type === TagType.End) return;

  // 2. 删除处理完成的代码
  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}

function parseText(context: any): any {
  const content = context.soruce.slice(0, context.soruce.length);
  advanceBy(context, content.length);

  return {
    type: NodeTypes.TEXT,
    content,
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
