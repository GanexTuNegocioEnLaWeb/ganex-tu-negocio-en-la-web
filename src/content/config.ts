import { defineCollection, z } from "astro:content";

const siteSchema = z.object({
  siteName: z.string(),
  baseUrl: z.string().url(),
  locale: z.string(),
  themeColor: z.string().optional(),
  defaultTitle: z.string(),
  defaultDescription: z.string(),
  services: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
    })
  ),
  social: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
      icon: z.string(),
    })
  ),
  ogImage: z.string().optional(),
  ogImageAlt: z.string().optional(),
  noindex: z.boolean().optional(),
  nav: z
    .array(
      z.object({
        label: z.string(),
        href: z.string().optional(),
        slug: z.string().optional(),
        rel: z.string().optional(),
        target: z.string().optional(),
      })
    )
    .optional(),
  footer: z
    .object({
      copyright: z.string().optional(),
      menu: z
        .array(z.object({ label: z.string(), href: z.string() }))
        .optional(),
    })
    .optional(),
  company: z
    .object({
      email: z.string().optional(),
      phone: z.string().optional(),
      phoneLink: z.string().optional(),
    })
    .optional(),
});

// Importante: permitir parciales en los archivos por idioma
const site = defineCollection({
  type: "data",
  schema: siteSchema.partial(),
});

const pages = defineCollection({
  type: "data",
  schema: z.object({
    route: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
    ogImageAlt: z.string().optional(),
    noindex: z.boolean().optional(),
    layout: z.enum(["default", "minimal", "zero"]).default("default"),
    blocks: z
      .array(
        z.object({
          type: z
            .enum(["hero", "about", "features", "logos", "cta"])
            .or(z.string()),
          props: z.record(z.any()).optional(),
        })
      )
      .default([]),
  }),
});

const i18n = defineCollection({
  type: "data",
  schema: z.record(z.any()),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    image: z.string().optional(),
    link: z.string().url().optional(),
    lang: z.string(),
  }),
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().optional(),
    image: z.string().optional(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    keywords: z.array(z.string()).optional(),
    lang: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { site, pages, i18n, projects, blog };

// (opcional) exporta el tipo final que quieres tener tras merge:
export type SiteData = z.infer<typeof siteSchema>;
