import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    const hdText = "--start--";
    const ftText = "-- end --";
    return h("div", {}, [
      renderSlots(this.$slots, "header", hdText),
      renderSlots(this.$slots, "default"),
      foo,
      renderSlots(this.$slots, "footer", ftText),
    ]);
  },
};
