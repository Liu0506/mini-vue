export const App = {
  render() {
    return h("div", "hi! mini-vue!" + this.msg);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
