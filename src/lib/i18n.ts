import { getCollection, getEntry } from "astro:content";

export const DEFAULT_LANG = "es";

/** Idiomas soportados (runtime) = ids en content/site/*.json */
export async function getSupportedLangs(): Promise<string[]> {
  // Excluye _base (y cualquier otro archivo "privado")
  const siteEntries = await getCollection(
    "site",
    ({ id }) => !id.startsWith("base")
  );

  // valida que parezcan códigos de idioma.
  const isLangId = (s: string) => /^[a-z]{2}(?:-[a-z]{2})?$/.test(s);

  const langs = siteEntries.map((e) => e.id.toLowerCase()).filter(isLangId);

  // Uniq + DEFAULT primero
  const uniq = Array.from(new Set(langs));
  return [DEFAULT_LANG, ...uniq.filter((l) => l !== DEFAULT_LANG)];
}

/** Valida si un valor es uno de los idiomas soportados */
export function isLang(v: unknown, supported: string[]): v is string {
  return typeof v === "string" && supported.includes(v);
}

/** Obtiene el diccionario de i18n para un idioma dado */
export async function getI18nDict(lang: string): Promise<Record<string, any>> {
  const dict = (await getEntry("i18n", lang))?.data ?? {};
  return dict;
}

/** Función de ayuda para obtener traducciones anidadas por notación de puntos */
export function t(key: string, dict: Record<string, any>): any {
  return key.split(".").reduce((o, i) => (o ? o[i] : undefined), dict);
}
