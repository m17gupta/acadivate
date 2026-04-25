import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/src/lib/mongodb";
import { ObjectId } from "mongodb";

async function getCollection(collname: string) {
  const client = await clientPromise;
  const db = client.db("kalp_tenant_acadivate");
  return db.collection(collname);
}

function getObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_KEY_SECRET!;

  const body = await req.text();

  const signature = req.headers.get("x-razorpay-signature") || "";

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  // 🎯 Handle events
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    const orderId = payment.order_id;
    const paymentId = payment.id;

    const ordersCollection = await getCollection("orders");
    const updatedOrder = await ordersCollection.updateOne(
      { id: orderId },
      { $set: { status: "success", paymentId } },
    );

    // 🔥 Update your DB here
    console.log("Payment success:", orderId, paymentId);
  }

  if (event.event === "payment.failed") {
    console.log("Payment failed");
  }

  return NextResponse.json({ status: "ok" });
}
