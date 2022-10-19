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
});
