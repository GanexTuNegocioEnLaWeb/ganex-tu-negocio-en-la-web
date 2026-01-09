// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import vue from "@astrojs/vue";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  site: "https://www.ganexbo.com",
  trailingSlash: "never",
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/admin") && !page.includes("/login"),
    }),
    icon(),
    vue(),
  ],
});
