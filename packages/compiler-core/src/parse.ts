import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  const ctx = createParserContext(content);
  return createRoot(parseChildren(ctx, []));
}

function createParserContext(content: string) {
  return {
    source: content,
  };
}

function parseChildren(context, ancestors): any {
  const nodes: any = [];

  while (!isEnd(context, ancestors)) {
    let node;
    if (context.source.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (context.source[0] === "<") {
      if (/[a-z]/i.test(context.source[1])) {
        node = parseElement(context, ancestors);
      }
    } else {
      node = parseText(context);
    }
    nodes.push(node);
  }

  return nodes;
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );

  advanceBy(context, openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;

  const rawContent = parseTextData(context, rawContentLength);
  const content = rawContent.trim();

  advanceBy(context, closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function parseElement(context: any, ancestors) {
  // 1. 解析 tag
  const element: any = parseTag(context, TagType.Start);
  ancestors.push(element)
  element.children = parseChildren(context, ancestors);
  ancestors.pop();

  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  }else {
    throw new Error(`缺少结束标签:${element.tag}`);
  }

  return element;
}

function parseTag(context: any, type: TagType) {
  const match = /^<\/?([a-z]+)/i.exec(context.source) as RegExpExecArray;
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
  let endIndex = context.source.length;
  const endTokens = ["<", "{{"];

  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }
  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context: any, length: number) {
  const content = context.source.slice(0, length);
  advanceBy(context, length);
  return content;
}

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

function createRoot(children) {
  return {
    children,
    type: NodeTypes.ROOT,
  };
}

function isEnd(context, ancestors: any[]) {
  const s = context.source
  if (s.startsWith('</')) {
    for (let i = ancestors.length - 1; i>=0; i--) {
      const tag = ancestors[i].tag;
      if (startsWithEndTagOpen(s, tag)) {
        return true
      }
     }
  }

  return !s;
}

function startsWithEndTagOpen(source, tag) {
  return (
    source.startsWith("</") &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  );
}
