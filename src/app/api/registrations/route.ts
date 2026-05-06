import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/src/lib/mongodb';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db('kalp_tenant_acadivate');
  return db.collection('users');
}

function getObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const collection = await getCollection();

    if (id) {
      const objectId = getObjectId(id);
      if (!objectId) {
        return NextResponse.json({ success: false, error: 'Registration ID is invalid' }, { status: 400 });
      }

      const item = await collection.findOne({ _id: objectId });
      if (!item) {
        return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, item });
    }

    const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const collection = await getCollection();
    const payload = await req.json();
    const now = new Date().toISOString();
    
    // Basic validation
    if (!payload.email || !payload.fullName) {
       return NextResponse.json({ success: false, error: 'Email and Full Name are required' }, { status: 400 });
    }

    const existingUser = await collection.findOne({ email: payload.email });
    if (existingUser) {
      return NextResponse.json({ success: true, item: existingUser, alreadyExists: true }, { status: 200 });
    }

    const document = {
      ...payload,
      userName: payload.email, // Required for existing login system
      createdAt: payload.createdAt ?? now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);
    const item = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json({ success: false, error: 'Failed to create registration' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const collection = await getCollection();
    const payload = await req.json();
    const { _id, id, ...updateData } = payload;
    const documentId = _id || id;

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Registration ID is required' }, { status: 400 });
    }

    const objectId = getObjectId(documentId);
    if (!objectId) {
      return NextResponse.json({ success: false, error: 'Registration ID is invalid' }, { status: 400 });
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
      return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
    }

    const item = await collection.findOne({ _id: objectId });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json({ success: false, error: 'Failed to update registration' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const collection = await getCollection();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Registration ID is required' }, { status: 400 });
    }

    const objectId = getObjectId(id);
    if (!objectId) {
      return NextResponse.json({ success: false, error: 'Registration ID is invalid' }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete registration' }, { status: 500 });
  }
}
