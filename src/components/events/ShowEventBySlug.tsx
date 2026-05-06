"use client"
import { fetchEventBySlugThunk, fetchEventThunk } from '@/src/hook/events/eventThunk'
import { AppDispatch, RootState } from '@/src/hook/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { Button } from "@/src/components/ui/Button";
import { useParams, usePathname } from "next/navigation";
import { formatEventDate, resolveImage } from "./util/util";
import GetEventBySlug from './GetEventBySlug'
import { fetchAwardCategoriesThunk, fetchAwardCategoryThunk } from '@/src/hook/awardCategories/awardCategoryThunk'
const ShowEventBySlug = () => {
  const dispatch = useDispatch<AppDispatch>()
  const pathName = usePathname()
  const slug = pathName?.split("/")?.pop() as string
  const isApiCall = React.useRef<boolean>(false)
  const { currentEvent, isLoading } = useSelector((state: RootState) => state.events)

  const { currentAwardCategory } = useSelector((state: RootState) => state.awardCategories)

  React.useEffect(() => {

    if (slug && (currentEvent == null)) {
      dispatch(fetchEventBySlugThunk(slug))
    }
  }, [slug, dispatch]) // Only depend on slug and dispatch to avoid infinite loops or missing updates
  // get Associatred category nominator get Nominattion and 
  useEffect(() => {

    if (currentEvent?.basic?.relatedAward &&
      currentEvent?.basic?.relatedAward?.toString() &&
      currentAwardCategory == null
    )


      dispatch(fetchAwardCategoryThunk(currentEvent?.basic?.relatedAward))
  }, [currentEvent, currentAwardCategory])

  const handleDownloadBrochure = () => {
    const brochureUrl = currentEvent?.media?.brochure;
    if (brochureUrl) {
      const link = document.createElement("a");
      link.href = brochureUrl;
      link.download = `${title.replace(/\s+/g, "-")}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  if ((!currentEvent)) {
    return (
      <div className="py-24 bg-app-bg flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-navy font-medium animate-pulse">Loading event details...</p>
        </div>
      </div>
    )
  }

  // if (error || (currentEvent && currentEvent.slug !== slug)) {
  //   return (
  //     <div className="py-24 bg-app-bg flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-navy mb-4">
  //           {error ? "Error Loading Event" : "Loading new event..."}
  //         </h2>
  //         {error && (
  //           <Link href="/events/all-events">
  //             <Button variant="primary">Back to Events</Button>
  //           </Link>
  //         )}
  //         {!error && <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto" />}
  //       </div>
  //     </div>
  //   )
  // }


  if (!currentEvent) return null;


  const imageUrl = currentEvent?.media?.bannerImage || currentEvent?.media?.thumbnailImage;
  const image = resolveImage(imageUrl);
  const rawEventDate = currentEvent?.datetime?.startDate;
  const eventDateStr = typeof rawEventDate === "object" && rawEventDate !== null && "$date" in rawEventDate
    ? rawEventDate.$date
    : rawEventDate as string | undefined;
  const dateLabel = formatEventDate(eventDateStr);

  const timeLabel = currentEvent?.datetime?.startTime || "10:00 AM";

  const title = currentEvent?.basic?.title || "Untitled Event";
  const desc = currentEvent?.basic?.description || "No description available for this event.";
  const type = currentEvent?.basic?.type || "Conference";

  // Calculate total days
  const rawEndDate = currentEvent?.datetime?.endDate;
  const endDateStr = typeof rawEndDate === "object" && rawEndDate !== null && "$date" in rawEndDate
    ? rawEndDate.$date
    : rawEndDate as string | undefined;

  const calculateDays = (start?: string, end?: string) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;

    s.setHours(0, 0, 0, 0);
    e.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const totalDays = calculateDays(eventDateStr, endDateStr);
  const dayDisplay = totalDays < 10 ? `0${totalDays}` : totalDays;
  const dayLabel = totalDays > 1 ? "Days Event" : "Day Event";


  let location = "Online / TBD";
  if (currentEvent?.location?.venueName) {
    location = currentEvent.location.venueName;
  } else if (currentEvent?.location?.city) {
    location = `${currentEvent.location.city}${currentEvent.location.country ? `, ${currentEvent.location.country}` : ""}`;
  }


  const images =
    currentEvent?.media?.bannerImage
      ? [currentEvent.media.bannerImage]
      : [];

  return (
    <>
      <GetEventBySlug />
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
                src={images[0]}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="hidden md:block h-full relative group cursor-pointer overflow-hidden">
              <img
                src={images[0]}
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
                      {dayDisplay}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gold/80">
                        {dayLabel}
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
                {/* <div className="flex items-center gap-3">
                <Calendar size={20} className="text-text-muted shrink-0" />
                <span className="text-sm font-medium text-navy">
                  Date Included
                </span>
              </div> */}
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
                event={currentEvent}
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
                    customForm={currentEvent?.attendees?.customRegistrationForm}
                    eventTitle={title}
                  />
                  <button className="w-full bg-bg-soft hover:bg-gray-100 text-navy font-bold py-4 rounded-xl border border-border-light transition-colors duration-300">
                    Send Enquiry
                  </button>

                  <Button
                    variant="gold"
                    className="w-full py-4 rounded-xl shadow-sh-md"
                    onClick={handleDownloadBrochure}
                    disabled={!currentEvent?.media?.brochure}
                  >
                    Download Brochure <FileCheck size={16} />
                  </Button>
                </div>

                {/* Conditional Nomination Button */}
                {currentAwardCategory && (
                  <div className="pt-6 border-t border-border-light mb-8">
                    <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 border border-gold/20 shadow-sh-xs">
                      <div className="flex items-center gap-3 mb-4">
                        <Award size={24} className="text-gold" />
                        <h4 className="font-bold text-navy text-lg">
                          {currentAwardCategory?.name}
                        </h4>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed mb-6">
                        This event is associated with an academic award. Submit your nomination to be recognized globally.
                      </p>
                      <Link
                        href={`/nomination-form/${currentEvent?.slug}?id=${currentAwardCategory?._id}`}
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
    </>
  )
}

export default ShowEventBySlug