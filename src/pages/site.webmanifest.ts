import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { getSite } from "../lib/site";

function pickBestLang(accept = "", supported: string[], fallback = "es") {
  const al = accept.toLowerCase();
  for (const l of supported) {
    if (al.includes(l.toLowerCase())) return l;
  }
  return fallback;
}

export const GET: APIRoute = async ({ request }) => {
  // idiomas soportados vienen de content/site/*
  const siteEntries = await getCollection("site"); // [{id:'es'...}, {id:'en'...}]
  const supported = siteEntries.map((e) => e.id);
  const fallback = supported.includes("es") ? "es" : supported[0] ?? "es";

  const lang = pickBestLang(
    request.headers.get("accept-language") || "",
    supported,
    fallback
  );
  const site = await getSite(lang);

  const siteName = site?.data.siteName ?? "Site";
  const theme = site?.data.themeColor ?? "#0B0B0B";
  const locale = site?.data.locale ?? (lang === "es" ? "es" : "en");

  // OJO: trailingSlash: "never" => sin "/" final
  const startUrl = `/${lang}`;
  const scope = "/"; // si tu app sólo vive bajo /{lang}, puedes usar `scope: "/"`
  // id ayuda a instalar múltiples PWA si cambias dominio/path
  const id = `/site.webmanifest?lang=${lang}`;

  const manifest = {
    id,
    name: siteName,
    short_name: siteName,
    description: site?.data.defaultDescription ?? undefined,
    start_url: startUrl,
    scope,
    display: "standalone",
    background_color: theme,
    theme_color: theme,
    lang: locale,
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    // opcionales útiles:
    // orientation: "portrait",
    // categories: ["business","productivity"],
    // shortcuts: [{ name: "...", url: `/${lang}/contacto`, icons: [...] }]
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
