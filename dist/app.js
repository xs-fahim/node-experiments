import {
  __require,
  __toESM
} from "./chunk-WOUPKHLL.js";

// app.js
(async () => {
  const { add } = await Promise.resolve().then(() => __toESM(__require("./math-P3GFYD3L.js"), 1));
  const { hello } = await Promise.resolve().then(() => __toESM(__require("./react-RSTELOHT.js"), 1));
  add(5, 6);
  hello();
})();
