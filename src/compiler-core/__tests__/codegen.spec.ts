import { generate } from "../codegen";
import { baseParse } from "../parse";
import { transform } from "../transform";
import { transformElement } from "../transforms/transformElement";
import { transformExpression } from "../transforms/transformExpression";
import { transformText } from "../transforms/transformText";

describe("codegen", () => {
  it("string", () => {
    const ast = baseParse("hi");
    transform(ast);
    const { code } = generate(ast);

    expect(code).toMatchSnapshot();
  });

  it("interpolation", () => {
    const ast = baseParse("{{message}}");
    transform(ast, {
      nodeTransforms: [transformExpression],
    });
    const { code } = generate(ast);

    expect(code).toMatchSnapshot();
  });

  it("Element", () => {
    const ast = baseParse("<div>hi, {{message}}</div>");
    transform(ast, {
      nodeTransforms: [transformElement, transformExpression, transformText],
    });
    const { code } = generate(ast);

    expect(code).toMatchSnapshot();
  });
});
