import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";

describe("transform", () => {
  // it("happy path", () => {
  //   const ast = baseParse("<div>hi</div>");
  //   transform(ast);
  //   expect(ast.children[0].children[0].content).toEqual("hi mini-vue");
  // });

  it("happy path", () => {
    const ast = baseParse("<div>hi</div>");

    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content += " mini-vue";
      }
    };
    transform(ast, {
      nodeTransforms: [plugin],
    });

    expect(ast.children[0].children[0].content).toEqual("hi mini-vue");
  });
});
