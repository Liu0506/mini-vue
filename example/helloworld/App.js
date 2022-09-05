import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        style: "color: red",
        onClick() {
          console.log("onClick");
        },
        onMousedown() {
          console.log("onMousedown");
        },
      },
      // "hi! mini-vue!",
      // "hi! mini-vue!" + this.msg
      [
        h("div", { style: "color: skyblue" }, "hi, " + this.msg),
        h(
          Foo,
          {
            count: 1,
          },
          "Foo: " + this.count + "!"
        ),
      ]
    );
  },
  setup() {
    return {
      msg: " mini-vue!!",
    };
  },
};
