import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/src/lib/mongodb';

async function getDb() {
  const client = await clientPromise;
  return client.db('kalp_tenant_acadivate');
}

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    const { paymentId, orderId, signature, amount, formId, status } = orderData;

    if (!formId) {
      return NextResponse.json(
        { success: false, error: 'Form ID (formId) is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const orderCollection = db.collection('orders');

    const orderDocument = {
      paymentId,
      orderId,
      signature,
      amount,
      formId,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orderResult = await orderCollection.insertOne(orderDocument);

    if (status === 'success') {
      const nominationsCollection = db.collection('nominations');
      const objectId = ObjectId.isValid(formId) ? new ObjectId(formId) : null;

      if (objectId) {
        await nominationsCollection.updateOne(
          { _id: objectId },
          {
            $set: {
              status: 'paid',
              paymentId: paymentId,
              razorpayOrderId: orderId,
              updatedAt: new Date().toISOString(),
            },
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order recorded successfully',
      id: orderResult.insertedId,
    });
  } catch (error) {
    console.error('Error recording order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record order' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const idsString = searchParams.get('ids');
    const ids = idsString ? idsString.split(',') : [];

    const db = await getDb();
    const orderCollection = db.collection('orders');

    let query = {};
    if (role !== 'admin') {
      // For non-admins, filter by nomination IDs (formId)
      query = { formId: { $in: ids } };
    }

    const orders = await orderCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      items: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
