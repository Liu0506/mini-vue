export * from "@mini-vue/runtime-dom";

import { baseCompile } from "@mini-vue/compiler-core";
import * as runtimeDom from "@mini-vue/runtime-dom";
import { registerRuntimeCompiler } from "@mini-vue/runtime-dom";

export function comoileToFunction(template) {
  const { code } = baseCompile(template);

  const render = new Function("Vue", code)(runtimeDom);
  return render;
}

registerRuntimeCompiler(comoileToFunction);

/**
                                    +---------------------+
                                    |                     |
                                    |  @vue/compiler-sfc  |
                                    |                     |
                                    +-----+--------+------+
                                          |        |
                                          v        v
                      +---------------------+    +----------------------+
                      |                     |    |                      |
        +------------>|  @vue/compiler-dom  +--->|  @vue/compiler-core  |
        |             |                     |    |                      |
   +----+----+        +---------------------+    +----------------------+
   |         |
   |   vue   |
   |         |
   +----+----+        +---------------------+    +----------------------+    +-------------------+
        |             |                     |    |                      |    |                   |
        +------------>|  @vue/runtime-dom   +--->|  @vue/runtime-core   +--->|  @vue/reactivity  |
                      |                     |    |                      |    |                   |
                      +---------------------+    +----------------------+    +-------------------+
 */
