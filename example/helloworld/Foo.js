import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup(props, { emit }) {
    const emitAdd = () => {
      emit("add", "data", "data2");
      return;
    };
    return {
      emitAdd,
    };
  },
  render() {
    const Btn = h("button", { onClick: this.emitAdd }, "emitAdd");
    const Foo = h("p", {}, "Foo");
    return h("div", {}, [Foo, Btn]);
  },
};
