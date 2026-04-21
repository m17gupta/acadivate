import clientPromise from "@/src/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

let instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function getCollection(collname: string) {
  const client = await clientPromise;
  const db = client.db("kalp_tenant_acadivate");
  return db.collection(collname);
}

function getObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function POST(req: NextRequest) {
  try {
    const {
      address,
      agreeTerms,
      city,
      email,
      gstin,
      mobile,
      orgName,
      ownership,
      paymentMode,
      promoter,
      selectedCategories,
      state,
      website,
      totalAmount,
    } = await req.json();
    console.log(
      address,
      agreeTerms,
      city,
      email,
      gstin,
      mobile,
      orgName,
      ownership,
      paymentMode,
      promoter,
      selectedCategories,
      state,
      website,
      totalAmount,
    );
    const ordersCollection = await getCollection("orders");
    const findLastReceipt = await ordersCollection.countDocuments();
    const lastReceipt = findLastReceipt + 1;
    const order = await instance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `order_rcptid_${lastReceipt}`,
    });

    const finalOrderData = {
      ...order,
      address,
      agreeTerms,
      city,
      email,
      gstin,
      mobile,
      orgName,
      ownership,
      promoter,
      selectedCategories,
      state,
      website,
      paymentStatus: "pending",
    };

    const createdOrder = await ordersCollection.insertOne(finalOrderData);
    if (!createdOrder) {
      return NextResponse.json({
        success: false,
        error: "Failed to create order",
      });
    }

    return NextResponse.json({ success: true, order: finalOrderData });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
