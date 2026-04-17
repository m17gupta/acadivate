import { getPageBySlug } from "@/src/lib/pages";

export async function getSEO(slug: string) {
  const defaultSEO = {
    metaTitle: "Acadivate | Excellence in Academia",
    metaDescription: "Empowering researchers and institutions through global conferences, awards, and scholarly collaboration.",
  };

  try {
    const page = await getPageBySlug(slug);

    if (!page || !page.seo) {
      return defaultSEO;
    }

    return {
      metaTitle: page.seo.metaTitle || defaultSEO.metaTitle,
      metaDescription: page.seo.metaDescription || defaultSEO.metaDescription,
    };
  } catch (error: any) {
    // Log error but don't throw, return defaults to keep page working
    console.warn("SEO fallback in getSEO:", error?.message ?? error);
    return defaultSEO;
  }
}
