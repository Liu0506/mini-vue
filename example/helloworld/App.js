import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  render() {
    window.self = this
    return h(
      "div",
      { id: "root", style: "color: red" },
      // "hi! mini-vue!",
      "hi! mini-vue!" + this.msg
      // [
      //   h("p", { style: "color: skyblue" }, "skyblue"),
      //   h("p", { class: "blue" }, "blue"),
      // ]
    );
  },
  setup() {
    return {
      msg: " mini-vue!!",
    };
  },
};
