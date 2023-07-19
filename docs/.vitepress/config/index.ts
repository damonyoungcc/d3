import { defineConfig } from "vitepress";
import enConfig from "./en";
import zhConfig from "./zh-CN";

export default defineConfig({

  locales: {
    root: { label: "English", lang: "en-US", link: "/", ...enConfig },
    "zh-CN": { label: "简体中文", lang: "zh-CN", link: "/zh-CN/", ...zhConfig },
  },
});
