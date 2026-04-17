import clientPromise from "@/src/lib/mongodb";

export type PageSeo = {
  metaTitle?: string;
  metaDescription?: string;
};

export type PageDocument = {
  slug: string;
  seo?: PageSeo;
  [key: string]: any;
};

async function getPagesCollection() {
  const client = await clientPromise;
  return client.db("kalp_tenant_acadivate").collection("pages");
}

export async function getAllPages() {
  const collection = await getPagesCollection();
  return collection.find({}).toArray();
}

export async function getPageBySlug(slug: string) {
  const collection = await getPagesCollection();
  return collection.findOne({ slug }) as Promise<PageDocument | null>;
}
