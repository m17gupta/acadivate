import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/src/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('kalp_tenant_acadivate');

    // Fetch counts for all relevant collections in parallel
    const [
      events,
      awards,
      nominations,
      rankings,
      leads,
      categories,
      users,
      orders,
      successfulPayments
    ] = await Promise.all([
      db.collection('events').countDocuments(),
      db.collection('awards').countDocuments(),
      db.collection('nominations').countDocuments(),
      db.collection('rankings').countDocuments(),
      db.collection('leads').countDocuments(),
      db.collection('categories').countDocuments(),
      db.collection('users').countDocuments(),
      db.collection('orders').countDocuments(),
      db.collection('orders').countDocuments({ status: 'success' }),
    ]);

    const stats = {
      events,
      awards,
      nominations,
      rankings,
      leads,
      categories,
      registrations: users, // Map users collection to registrations module ID
      orders,
      payments: successfulPayments
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
