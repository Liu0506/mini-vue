import { NodeTypes } from "../ast";
import { baseParse } from "../parse";

describe("Parse", () => {
  describe("interpolation", () => {
    test("simple interpolation", () => {
      const ast = baseParse("{{ message }}");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "message",
        },
      });
    });
  });

  describe("element", () => {
    test("simple element div", () => {
      const ast = baseParse("<div></div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [],
      });
    });
  });

  describe("Text", () => {
    test("simple Text", () => {
      const ast = baseParse("simple Text");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "simple Text",
      });
    });
  });

  describe("mix", () => {
    test("hello world_1", () => {
      const ast = baseParse("<p>hello,{{message}}</p>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "p",
        children: [
          {
            type: NodeTypes.TEXT,
            content: "hello,",
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });

    test("hello world_2", () => {
      const ast = baseParse("<div><span>hello,</span>{{message}}</div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: "span",
            children: [
              {
                type: NodeTypes.TEXT,
                content: "hello,",
              },
            ],
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });

    test("toThrow", () => {
      expect(() => {
        baseParse("<div><span></div>");
      }).toThrow("缺少结束标签:span");
    });
  });
});
