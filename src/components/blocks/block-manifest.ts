import type { AstroComponentFactory } from "astro/runtime/server/index.js";

interface BlockManifestEntry {
  type: string;
  import: () => Promise<{ default: AstroComponentFactory }>;
}

export const BLOCK_MANIFEST: BlockManifestEntry[] = [
  // SHARED
  {
    type: "block-contact",
    import: () => import("./shared/BlockContact.astro"),
  },
  {
    type: "steps",
    import: () => import("./home/HomeSteps.astro"),
  },
  // HOME
  {
    type: "home-hero",
    import: () => import("./home/HomeHero.astro"),
  },
  {
    type: "home-services",
    import: () => import("./home/HomeServices.astro"),
  },
  {
    type: "home-portfolio",
    import: () => import("./home/HomePortfolio.astro"),
  },
  {
    type: "home-phrase",
    import: () => import("./home/HomePhrase.astro"),
  },
  {
    type: "home-location",
    import: () => import("./home/HomeLocation.astro"),
  },
  {
    type: "home-latest-blog",
    import: () => import("./home/HomeLatestBlog.astro"),
  },
  // ABOUT
  {
    type: "about-hero",
    import: () => import("./about/AboutHero.astro"),
  },
  // CHATBOTS IA
  {
    type: "chatbots-ia-hero",
    import: () => import("./chatbots-ia/ChatbotsIaHero.astro"),
  },
  // DESARROLLO WEB
  {
    type: "web-development-hero",
    import: () => import("./desarrollo-web/WebDevelopmentHero.astro"),
  },
  // DESARROLLO DE APPS
  {
    type: "app-development-hero",
    import: () => import("./desarrollo-apps/AppDevelopmentHero.astro"),
  },
  // MARKETING DIGITAL
  {
    type: "digital-marketing-hero",
    import: () => import("./marketing-digital/DigitalMarketingHero.astro"),
  },
  // SEO
  {
    type: "seo-hero",
    import: () => import("./seo/SeoHero.astro"),
  },
  // TERMS
  {
    type: "terms-hero",
    import: () => import("./terms/TermsHero.astro"),
  },
  // PRIVACY
  {
    type: "privacy-hero",
    import: () => import("./privacy/PrivacyHero.astro"),
  },
  // PORTFOLIO
  {
    type: "projects-grid",
    import: () => import("./projects/ProjectsGrid.astro"),
  },
  {
    type: "project-detail",
    import: () => import("./projects/ProjectDetail.astro"),
  },
  // BLOG
  {
    type: "blog-grid",
    import: () => import("./blog/BlogGrid.astro"),
  },
  {
    type: "blog-post-detail",
    import: () => import("./blog/BlogPostDetail.astro"),
  },
  // CONVERSATIONAL
  {
    type: "conversational-wizard",
    import: () => import("./conversational/ConversationalWizard.astro"),
  },
];
