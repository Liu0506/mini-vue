import { isProxy, isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
  it("should shallowReadonly", () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
    expect(isProxy(props)).toBe(true);
    expect(isProxy(props.n)).toBe(false);
  });
});
