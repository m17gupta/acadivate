import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/src/lib/mongodb';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db('kalp_tenant_acadivate');
  return db.collection('events');
}

function getObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function processEventData(data: any) {
  const processed = { ...data };

  const processValues = (target: any) => {
    // Convert date fields to Date objects
    const dateFields = [
      "startDate",
      "endDate",
      "registrationDeadline",
      "saleStartDate",
      "saleEndDate",
    ];

    dateFields.forEach((field) => {
      if (target[field] && typeof target[field] === "string") {
        const date = new Date(target[field]);
        if (!isNaN(date.getTime())) {
          target[field] = date;
        }
      }
    });

    // Handle start/end date-time combination
    if (target.startDate && target.startTime) {
      const combinedStart = new Date(
        `${target.startDate}T${target.startTime}`
      );
      if (!isNaN(combinedStart.getTime())) {
        target.startDateTime = combinedStart;
      }
    }
    if (target.endDate && target.endTime) {
      const combinedEnd = new Date(`${target.endDate}T${target.endTime}`);
      if (!isNaN(combinedEnd.getTime())) {
        target.endDateTime = combinedEnd;
      }
    }

    // Handle related award reference
    if (target.relatedAward && typeof target.relatedAward === "string") {
      const awardId = getObjectId(target.relatedAward);
      if (awardId) {
        target.relatedAward = awardId;
      }
    }
  };

  // Process root level
  processValues(processed);

  // Process nested sections
  Object.keys(processed).forEach((key) => {
    const value = processed[key];
    if (value && typeof value === "object" && "label" in value) {
      processValues(value);
    }
  });

  // Ensure _id is an ObjectId if present at root
  if (processed._id && typeof processed._id === "string") {
    const objectId = getObjectId(processed._id);
    if (objectId) {
      processed._id = objectId;
    }
  }

  return processed;
}

async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const collection = await getCollection();
     console.log("slug ----->", slug)
     console.log("id ----->", id)
    if (id) {
      const objectId = getObjectId(id);
      if (!objectId) {
        return NextResponse.json({ success: false, error: 'Event ID is invalid' }, { status: 400 });
      }

      const item = await collection.findOne({ _id: objectId });
      if (!item) {
        return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
      }
    console.log("item ----->", item)
      return NextResponse.json({ success: true, item });
    }

    if (slug) {
      const item = await collection.findOne({ slug });
      if (!item) {
        return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, item });
    }

    const items = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

async function POST(req: NextRequest) {
  try {
    const collection = await getCollection();
    const payload = await req.json();
    const processedData = processEventData(payload);
    
    const now = new Date();
    const document = {
      ...processedData,
      createdAt: processedData.createdAt || now,
      updatedAt: now,
    };

    if (document._id) {
      const result = await collection.updateOne(
        { _id: document._id },
        { $set: document },
        { upsert: true }
      );
      const item = await collection.findOne({ _id: document._id });
      return NextResponse.json({ success: true, item }, { status: 200 });
    }

    const result = await collection.insertOne(document);
    const item = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
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
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    const objectId = getObjectId(documentId);
    if (!objectId) {
      return NextResponse.json(
        { success: false, error: "Event ID is invalid" },
        { status: 400 }
      );
    }

    const processedUpdate = processEventData(updateData);

    const result = await collection.updateOne(
      { _id: objectId },
      {
        $set: {
          ...processedUpdate,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    const item = await collection.findOne({ _id: objectId });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, error: 'Failed to update event' }, { status: 500 });
  }
}

async function DELETE(req: NextRequest) {
  try {
    const collection = await getCollection();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const objectId = getObjectId(id);
    if (!objectId) {
      return NextResponse.json({ success: false, error: 'Event ID is invalid' }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete event' }, { status: 500 });
  }
}

export { GET, POST, PUT, DELETE };
