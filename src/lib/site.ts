import { getCollection, getEntry } from "astro:content";
import type { SiteData } from "../content/config";

// merge profundo: para arrays, usamos el override del idioma
function deepMerge<T extends Record<string, any>>(
  base: T,
  override: Partial<T>
): T {
  const out: any = { ...base };
  for (const [k, v] of Object.entries(override ?? {})) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      out[k] = v; // override arrays
    } else if (
      v &&
      typeof v === "object" &&
      typeof out[k] === "object" &&
      !Array.isArray(out[k])
    ) {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export async function getSite(lang: string) {
  const base = await getEntry("site", "base");
  const loc = await getEntry("site", lang);

  if (!base) throw new Error("Falta site/base.json");
  if (!loc) throw new Error(`Falta site/${lang}.json`);

  const data = deepMerge(base.data, loc.data) as SiteData;

  // Simulamos la forma de getEntry para que tu consumo no cambie (site.data.x)
  return { id: lang, slug: lang, body: "", collection: "site", data } as const;
}

export async function pageHref(
  lang: string,
  logicalSlug: string
): Promise<string> {
  const pages = await getCollection("pages");
  const target = pages.find((p) => p.id === `${logicalSlug}.${lang}`);
  if (!target) return `/${lang}`;
  if (logicalSlug === "home") return `/${lang}`;
  const seg = (target.data.route ?? logicalSlug).replace(/^\/+|\/+$/g, "");
  return `/${lang}/${seg}`;
}
