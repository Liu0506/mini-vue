// 老的是 array
// 新的是 text

import { h, ref } from "../../lib/guide-mini-vue.esm.js";

const nextChildren = "newChildren";
const prevChildren = [h("div", {}, "A"), h("div", {}, "B")];

export default {
  name: "ArrayToText",
  setup() {
    const isChange = ref(false);
    window.isChange1 = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;

    return self.isChange
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
