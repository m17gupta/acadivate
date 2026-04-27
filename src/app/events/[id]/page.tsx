import { notFound } from "next/navigation";
import { getEventByIdOrSlug } from "@/src/lib/events";
import { Events } from "@/src/components/sections/Events";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Tag,
  Share2,
  Award,
  ChevronRight,
  Info,
  Star,
  FileCheck,
} from "lucide-react";
import { EventTabs } from "@/src/components/sections/EventTabs";
import { EventRegistrationModal } from "@/src/components/sections/EventRegistrationModal";
import clientPromise from "@/src/lib/mongodb";
import { ObjectId } from "mongodb";
import { Button } from "@/src/components/ui/Button";

function normalizeEventRouteId(id: string) {
  return id.trim().toLowerCase().replace(/\s+/g, "-");
}

function formatEventDate(eventDate?: string) {
  if (!eventDate) return "Date not available";

  const parsed = new Date(eventDate);
  if (Number.isNaN(parsed.getTime())) return eventDate;

  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function resolveImage(imageUrl?: string | string[]) {
  if (Array.isArray(imageUrl)) {
    return imageUrl[0] || "/assets/Image/event1.jpeg";
  }

  return imageUrl || "/assets/Image/event1.jpeg";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (normalizeEventRouteId(id) === "all-events") {
    return {
      title: "All Events",
      description: "Browse all upcoming academic events and conferences.",
    };
  }

  const event = await getEventByIdOrSlug(id);

  if (!event) {
    return {
      title: "Event not found",
      description: "The requested event could not be found.",
    };
  }

  const title = event?.basic?.title || event.title || "Event Details";
  const desc =
    event?.basic?.shortDescription ||
    event?.basic?.description ||
    event.description ||
    "View the full event details.";

  return {
    title: title,
    description: desc,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (normalizeEventRouteId(id) === "all-events") {
    return <Events />;
  }

  const event = await getEventByIdOrSlug(id);

  if (!event) {
    notFound();
  }

  const imageUrl = event?.media?.bannerImage || event.imageUrl;
  const image = resolveImage(imageUrl);
  const eventDate = event?.datetime?.startDate || event.eventDate;
  const dateLabel = formatEventDate(eventDate);

  const timeLabel = event?.datetime?.startTime || event.startTime || "10:00 AM";

  const title = event?.basic?.title || event.title || "Untitled Event";
  const desc =
    event?.basic?.description ||
    event.description ||
    "No description available for this event.";
  const type = event?.basic?.type || event.type || "Conference";
  const location = event?.location?.city
    ? `${event.location.city}, ${event.location.country}`
    : typeof event.location === "string"
      ? event.location
      : "Online / TBD";
  const relatedAward = event?.basic?.relatedAward;

  let awardData: any = null;
  let relatedAwardIdStr: string | null = null;

  console.log("Related Award:", relatedAward);

  if (relatedAward) {
    // Handle both string, ObjectId object formats, and JSON $oid format
    if (typeof relatedAward === "object") {
      if (relatedAward.$oid) {
        relatedAwardIdStr = relatedAward.$oid;
      } else if (relatedAward.toString) {
        relatedAwardIdStr = relatedAward.toString();
      }
    } else {
      relatedAwardIdStr = String(relatedAward);
    }

    try {
      const client = await clientPromise;
      const db = client.db("kalp_tenant_acadivate");
      const objId = new ObjectId(String(relatedAwardIdStr));
      awardData = await db
        .collection("award-categories")
        .findOne({ _id: objId });
    } catch (error) {
      console.error("Error fetching related award:", error);
    }
  }

  console.log(awardData);

  // Generate fallback images array for gallery
  const images =
    Array.isArray(imageUrl) && imageUrl.length >= 5
      ? imageUrl.slice(0, 5)
      : Array(5).fill(image);

  return (
    <main className="bg-app-bg pb-24">
      {/* Image Gallery Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-sh-sm">
          <div className="md:col-span-2 md:row-span-2 h-full relative group cursor-pointer">
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="hidden md:block h-full relative group cursor-pointer overflow-hidden">
            <img
              src={images[1]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="hidden md:block h-full relative group cursor-pointer overflow-hidden">
            <img
              src={images[2]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="hidden md:block h-full relative group cursor-pointer overflow-hidden">
            <img
              src={images[3]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="hidden md:block h-full relative group cursor-pointer overflow-hidden">
            <img
              src={images[4]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-navy/40 flex items-center justify-center backdrop-blur-[2px] transition-all group-hover:backdrop-blur-none group-hover:bg-black/20">
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/40 backdrop-blur-md px-5 py-2.5 rounded-full text-white text-sm font-bold transition-colors">
                View All Images
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-4">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
          {/* Main Content (Left Column) */}
          <div className="space-y-12">
            {/* Title & Badges */}
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-8">
                {title}
              </h1>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 bg-gold/10 text-gold px-5 py-2.5 rounded-xl border border-gold/20">
                  <span className="text-2xl font-extrabold leading-none">
                    01
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gold/80">
                      Day Event
                    </span>
                    <span className="text-sm font-bold">
                      {location.split(",")[0]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-primary/5 text-primary px-5 py-3.5 rounded-xl border border-primary/10">
                  <Tag size={18} />
                  <span className="text-sm font-bold">{type}</span>
                </div>
                <button className="ml-auto w-10 h-10 rounded-full border border-border-light flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border-light">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-text-muted shrink-0" />
                <span className="text-sm font-medium text-navy">
                  Date Included
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-text-muted shrink-0" />
                <span className="text-sm font-medium text-navy">
                  Venue Included
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-text-muted shrink-0" />
                <span className="text-sm font-medium text-navy">
                  Meals Included
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Award size={20} className="text-text-muted shrink-0" />
                <span className="text-sm font-medium text-navy">
                  Certificate Included
                </span>
              </div>
            </div>

            {/* Event Highlights Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-navy">Event Highlights</h2>
              <div className="prose prose-lg text-text-muted max-w-none prose-p:leading-relaxed prose-headings:text-navy prose-strong:text-navy">
                <div dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            </div>

            {/* Navigation Tabs & Content Box */}
            <EventTabs
              event={JSON.parse(JSON.stringify(event))}
              title={title}
            />
          </div>

          {/* Sticky Sidebar (Right Column) */}
          <div className="sticky top-24 space-y-6">
            <div className="bg-white border-1.5 border-border-light rounded-[2rem] p-8 shadow-sh-md">
              {/* Pricing Header */}
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-border-light">
                <div>
                  <div className="text-3xl font-extrabold text-navy">Free</div>
                  <div className="text-sm font-medium text-text-muted mt-1">
                    Registration per Delegate
                  </div>
                </div>
                <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-green-200">
                  <Star size={12} className="fill-green-700" /> 4.9 (120)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <EventRegistrationModal
                  customForm={event?.attendees?.customRegistrationForm}
                  eventTitle={title}
                />
                <button className="w-full bg-bg-soft hover:bg-gray-100 text-navy font-bold py-4 rounded-xl border border-border-light transition-colors duration-300">
                  Send Enquiry
                </button>

                <Button
                  variant="gold"
                  className="w-full py-4 rounded-xl shadow-sh-md"
                >
                  Download Brochure <FileCheck size={16} />
                </Button>
              </div>

              {/* Conditional Nomination Button */}
              {relatedAward && (
                <div className="pt-6 border-t border-border-light mb-8">
                  <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 border border-gold/20 shadow-sh-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <Award size={24} className="text-gold" />
                      <h4 className="font-bold text-navy text-lg">
                        {awardData?.basic?.title ||
                          awardData?.title ||
                          "Academic Awards"}
                      </h4>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed mb-6">
                      {awardData?.basic?.shortDescription ||
                        awardData?.description ||
                        "This event is associated with an academic award. Submit your nomination to be recognized globally."}
                    </p>
                    <Link
                      href={`/nomination-form?id=${relatedAwardIdStr}`}
                      className="block"
                    >
                      <button className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-3.5 rounded-xl shadow-sh-sm transition-all duration-300 text-sm flex items-center justify-center gap-2 group">
                        Fill Nomination{" "}
                        <ChevronRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Summary Details */}
              <div className="space-y-4 bg-app-bg rounded-2xl p-6 border border-border-light">
                <div className="text-sm font-bold text-navy mb-4">
                  Event Summary
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Date</span>
                  <span className="font-bold text-navy text-right">
                    {dateLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Time</span>
                  <span className="font-bold text-navy text-right">
                    {timeLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Location</span>
                  <span
                    className="font-bold text-navy text-right max-w-[150px] truncate"
                    title={location}
                  >
                    {location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
