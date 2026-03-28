import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/src/lib/mongodb';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db('kalp_tenant_acadivate');
  return db.collection('awards');
}

function getObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const collection = await getCollection();

    if (id) {
      const objectId = getObjectId(id);
      if (!objectId) {
        return NextResponse.json({ success: false, error: 'Award ID is invalid' }, { status: 400 });
      }

      const item = await collection.findOne({ _id: objectId });
      if (!item) {
        return NextResponse.json({ success: false, error: 'Award not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, item });
    }

    if (slug) {
      const item = await collection.findOne({ slug });
      if (!item) {
        return NextResponse.json({ success: false, error: 'Award not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, item });
    }

    const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error fetching awards:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch awards' }, { status: 500 });
  }
}

async function POST(req: NextRequest) {
  try {
    const collection = await getCollection();
    const payload = await req.json();
    const now = new Date().toISOString();
    const document = {
      ...payload,
      createdAt: payload.createdAt ?? now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);
    const item = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error('Error creating award:', error);
    return NextResponse.json({ success: false, error: 'Failed to create award' }, { status: 500 });
  }
}

async function PUT(req: NextRequest) {
  try {
    const collection = await getCollection();
    const payload = await req.json();
    const { _id, id, ...updateData } = payload;
    const documentId = _id || id;

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Award ID is required' }, { status: 400 });
    }

    const objectId = getObjectId(documentId);
    if (!objectId) {
      return NextResponse.json({ success: false, error: 'Award ID is invalid' }, { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: objectId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Award not found' }, { status: 404 });
    }

    const item = await collection.findOne({ _id: objectId });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error updating award:', error);
    return NextResponse.json({ success: false, error: 'Failed to update award' }, { status: 500 });
  }
}

async function DELETE(req: NextRequest) {
  try {
    const collection = await getCollection();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Award ID is required' }, { status: 400 });
    }

    const objectId = getObjectId(id);
    if (!objectId) {
      return NextResponse.json({ success: false, error: 'Award ID is invalid' }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Award not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting award:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete award' }, { status: 500 });
  }
}

export { GET, POST, PUT, DELETE };
