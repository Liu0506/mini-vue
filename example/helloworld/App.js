import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "App");
    const foo = h(
      Foo,
      {},
      {
        default: () => h("div", {}, "content"),
        header: (text) => h("p", {}, "头部" + text),
        footer: (text) => h("p", {}, "尾部" + text),
      }
    );

    return h("div", {}, [app, foo]);
  },
  setup() {
    return {};
  },
};
