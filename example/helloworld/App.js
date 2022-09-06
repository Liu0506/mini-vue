import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    return h("div", { onAdd: this.onAdd }, [h("div", {}, "App"), h(Foo, {onAdd: this.onAdd})]);
  },
  setup(props) {
    return {
      onAdd(...args) {
        console.log(...args);
      },
    };
  },
};
