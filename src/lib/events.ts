import { ObjectId } from 'mongodb';
import clientPromise from '@/src/lib/mongodb';

export type EventDocument = {
  _id?: ObjectId | string;
  slug?: string;
  title?: string;
  description?: string;
  eventDate?: string;
  imageUrl?: string | string[];
  [key: string]: any;
};

async function getEventsCollection() {
  const client = await clientPromise;
  return client.db('kalp_tenant_acadivate').collection('events');
}

function toObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function getEventByIdOrSlug(id: string) {
  const collection = await getEventsCollection();
  const objectId = toObjectId(id);

  if (objectId) {
    const item = await collection.findOne({ _id: objectId });
    if (item) {
      return item as EventDocument;
    }
  }

  const item = await collection.findOne({ slug: id });
  return (item as EventDocument | null) ?? null;
}
