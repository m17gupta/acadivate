import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";

import { ObjectId } from 'mongodb';
import clientPromise from '@/src/lib/mongodb';
import Razorpay from "razorpay";

let instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function getCollection() {
  const client = await clientPromise;
  const db = client.db('kalp_tenant_acadivate');
  return db.collection('nominations');
}

function getObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');
    const emailId = searchParams.get('emailId');
    const collection = await getCollection();

    if (id) {
      const objectId = getObjectId(id);
      if (!objectId) {
        return NextResponse.json(
          { success: false, error: 'Nomination ID is invalid' },
          { status: 400 }
        );
      }

      const item = await collection.findOne({ _id: objectId });
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Nomination not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, item });
    }

    if (slug) {
      const item = await collection.findOne({ slug });
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Nomination not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, item });
    }

    let query = {};
    if (role !== 'admin') {
      const orFilters: any[] = [];
      if (emailId) orFilters.push({ email: emailId });
      if (userId) orFilters.push({ submittedById: userId });

      if (orFilters.length > 0) {
        query = { $or: orFilters };
      } else {
        // If neither emailId nor userId is provided for a non-admin, return nothing
        return NextResponse.json({ success: true, items: [] });
      }
    }

    const items = await collection.find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error fetching nominations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nominations' },
      { status: 500 }
    );
  }
}

async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const collection = await getCollection();
    const findLastReceipt = await collection.countDocuments();
    const lastReceipt = findLastReceipt + 1;
    const order = await instance.orders.create({
      amount: Math.round(payload.totalAmount * 100),
      currency: "INR",
      receipt: `order_rcptid_${lastReceipt}`,
    });

    const now = new Date().toISOString();
    const document = {
      ...payload,
      order: order,
      createdAt: payload.createdAt ?? now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);
    const item = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error('Error creating nomination:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create nomination' },
      { status: 500 }
    );
  }
}

async function PUT(req: NextRequest) {
  try {
    const collection = await getCollection();
    const payload = await req.json();
    const { _id, id, ...updateData } = payload;
    const documentId = _id || id;

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: 'Nomination ID is required' },
        { status: 400 }
      );
    }

    const objectId = getObjectId(documentId);
    if (!objectId) {
      return NextResponse.json(
        { success: false, error: 'Nomination ID is invalid' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { success: false, error: 'Nomination not found' },
        { status: 404 }
      );
    }

    const item = await collection.findOne({ _id: objectId });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error updating nomination:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update nomination' },
      { status: 500 }
    );
  }
}

async function DELETE(req: NextRequest) {
  try {
    const collection = await getCollection();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Nomination ID is required' },
        { status: 400 }
      );
    }

    const objectId = getObjectId(id);
    if (!objectId) {
      return NextResponse.json(
        { success: false, error: 'Nomination ID is invalid' },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Nomination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting nomination:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete nomination' },
      { status: 500 }
    );
  }
}

export { GET, POST, PUT, DELETE };
