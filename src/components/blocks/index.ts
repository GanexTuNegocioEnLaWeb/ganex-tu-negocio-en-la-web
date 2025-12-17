export const BLOCK_REGISTRY: Record<string, any> = {};

const modules = import.meta.glob("./**/*.astro");

function toKebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

Object.entries(modules).forEach(([p, loader]) => {
  const m = p.match(/\.\/([^\/]+)\/([^\/]+)\.astro$/);
  if (!m) return;
  const file = m[2];
  const base = file.replace(/\.astro$/i, "");
  const kebab = toKebab(base);
  const type = kebab;
  BLOCK_REGISTRY[type] = (loader as () => Promise<any>)();
});

if (BLOCK_REGISTRY["home-steps"]) {
  BLOCK_REGISTRY["steps"] = BLOCK_REGISTRY["home-steps"];
}
