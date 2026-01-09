import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import { DEFAULT_LANG } from "../lib/i18n";

export const GET: APIRoute = async () => {
  const isProd = import.meta.env.PROD;

  // lee baseUrl y noindex desde site/{lang}.json (es)
  const site = await getEntry("site", DEFAULT_LANG);
  const base =
    site?.data.baseUrl?.replace(/\/$/, "") ?? "https://www.ganexbo.com";
  const siteNoindex = !!site?.data.noindex;

  const body =
    (isProd && !siteNoindex) || !isProd
      ? [
          "User-agent: *",
          "Allow: /",
          `Sitemap: ${base}/sitemap-index.xml`,
          "", // newline final
        ].join("\n")
      : [
          "User-agent: *",
          "Disallow: /",
          "", // si es prod pero noindex=true, bloquea
        ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600", // 1h
    },
  });
};
