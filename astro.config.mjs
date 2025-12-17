// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  site: "https://www.ganexbo.com",
  integrations: [sitemap(), icon()],
});
