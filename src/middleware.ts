import type { MiddlewareHandler } from "astro";
import { getSupportedLangs, DEFAULT_LANG, isLang } from "./lib/i18n";

function pickLang(accept = "", supported: string[]): string {
  const lowered = accept.toLowerCase();
  for (const l of supported) {
    if (lowered.includes(l.toLowerCase())) return l;
  }
  return DEFAULT_LANG;
}

// function stripTrailingSlash(pathname: string) {
//   return pathname.length > 1 && pathname.endsWith("/")
//     ? pathname.replace(/\/+$/, "")
//     : pathname;
// }

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const { url, request } = ctx;
  const pathname = url.pathname;

  // Skip middleware for static files or common extensions
  if (
    pathname.includes(".") || 
    pathname.startsWith("/api/") || 
    pathname.startsWith("/_image") ||
    pathname.includes("_astro")
  ) {
    return next();
  }

  const supported = await getSupportedLangs(); // p.ej. ["es","en","pt"]

  // 1) raíz -> idioma detectado
  if (pathname === "/") {
    const pref = request.headers.get("accept-language") || "";
    const lang = pickLang(pref, supported);
    return ctx.redirect(`/${lang}`, 307);
  }

  // 2) normaliza: quita slash final (Astro ya lo hace con trailingSlash: 'never')
  // if (pathname.length > 1 && pathname.endsWith("/")) {
  //   const normalized = stripTrailingSlash(pathname);
  //   return ctx.redirect(`${normalized}${url.search}`, 308);
  // }

  // 3) /{lang}/home -> /{lang}
  const m = pathname.match(/^\/([^/]+)\/home$/i);
  if (m) {
    const l = m[1].toLowerCase();
    if (isLang(l, supported)) {
      return ctx.redirect(`/${l}`, 301);
    }
  }

  return next();
};
