import { getCollection, getEntry } from "astro:content";
import { getSite } from "./site";
import { getI18nDict } from "./i18n";

type Opts = {
  slug?: string;
  lang?: string;
  canonicalUrl?: string;
};

type SocialArray = Array<{ name?: string; url?: string; icon?: string }>;
type SocialObject = Record<string, string>;
type Social = SocialArray | SocialObject | undefined | null;

function socialToUrls(social: Social): string[] {
  if (!social) return [];
  if (Array.isArray(social)) {
    return social.map((s) => s.url).filter(Boolean) as string[];
  }
  // objeto soportado
  return Object.values(social).filter(Boolean);
}

export async function resolveMeta({
  slug = "home",
  lang = "es",
  canonicalUrl,
}: Opts) {
  const site = await getSite(lang);
  if (!site) throw new Error(`Falta site/${lang}.json`);
  const i18nDict = await getI18nDict(lang);

  // Buscar la página por su ID (slug.lang) o por su propiedad 'route'
  const candidates = await getCollection(
    "pages",
    (p) =>
      (p.id === `${slug}.${lang}` || p.data.route === slug) &&
      p.id.endsWith(lang)
  );
  const page = candidates[0];

  const i18nTitle = i18nDict?.pages?.[slug]?.title ?? undefined;
  const i18nDesc = i18nDict?.pages?.[slug]?.description ?? undefined;
  const title = i18nTitle ?? page?.data.title ?? site.data.defaultTitle;
  const description =
    i18nDesc ?? page?.data.description ?? site.data.defaultDescription;
  const ogImage = page?.data.ogImage ?? site.data.ogImage ?? "/og-image.jpg";
  const ogImageAlt = page?.data.ogImageAlt ?? site.data.ogImageAlt ?? title;
  const noindex = page?.data.noindex ?? site.data.noindex ?? false;

  const base = site.data.baseUrl?.replace(/\/$/, "");
  // Construir la ruta usando page.data.route si existe, o el slug actual si es home, sino el slug inferido
  const pagePathSegment = page?.data.route ?? (slug === "home" ? "" : slug);
  const path = `/${lang}${pagePathSegment ? `/${pagePathSegment}` : ""}`;
  const url = canonicalUrl || `${base}${path}`;

  const sameAs = socialToUrls(site.data.social as Social);

  const graph: any[] = [
    {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: site.data.siteName,
      url: base,
      logo: {
        "@type": "ImageObject",
        "@id": `${base}/#logo`,
        inLanguage: site.data.locale,
        url: site.data.ogImage ?? `${base}/og-image.jpg`,
        contentUrl: site.data.ogImage ?? `${base}/og-image.jpg`,
        width: 1200,
        height: 630,
        caption: site.data.siteName,
      },
      image: { "@id": `${base}/#logo` },
      sameAs,
      contactPoint: site.data.company
        ? [
            {
              "@type": "ContactPoint",
              telephone: site.data.company.phone,
              contactType: "customer service",
              email: site.data.company.email,
              availableLanguage: [site.data.locale],
            },
          ]
        : undefined,
    },
    {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      url: base,
      name: site.data.siteName,
      description: site.data.defaultDescription,
      publisher: { "@id": `${base}/#organization` },
      inLanguage: site.data.locale,
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      isPartOf: { "@id": `${base}/#website` },
      about: { "@id": `${base}/#organization` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": `${url}#primaryimage`,
        url: ogImage.startsWith("http") ? ogImage : `${base}${ogImage}`,
        width: 1200,
        height: 630,
      },
      image: { "@id": `${url}#primaryimage` },
      description,
      inLanguage: site.data.locale,
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: ((): any[] => {
        const segs = path.split("/").filter(Boolean);
        const acc: any[] = [];
        let hrefAcc = "";
        segs.forEach((s, i) => {
          hrefAcc += `/${s}`;
          acc.push({
            "@type": "ListItem",
            position: i + 1,
            name: s.charAt(0).toUpperCase() + s.slice(1),
            item: `${base}${hrefAcc}`,
          });
        });
        return acc;
      })(),
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return {
    siteName: site.data.siteName,
    locale: site.data.locale,
    themeColor: site.data.themeColor ?? "#FFFFFF",
    social: Array.isArray(site.data.social)
      ? site.data.social
      : Object.entries((site.data.social ?? {}) as SocialObject).map(
          ([name, url]) => ({ name, url })
        ),
    title,
    description,
    ogImage,
    ogImageAlt,
    noindex,
    canonicalUrl: url,
    jsonLd,
  };
}
