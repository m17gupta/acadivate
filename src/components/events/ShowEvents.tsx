"use client";

import * as React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  List,
  ArrowRight,
  FileCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { Button } from "../ui/Button";
import { GetAllEvents } from "./GetAllEvents";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/hook/store";
import { setCurrentEvent } from "@/src/hook/events/eventSlice";
import { useRouter } from "next/navigation";
import { setCurrentAwardCategory } from "@/src/hook/awardCategories/AwardCategoriesSlice";


const HIDDEN_EVENT_SLUGS = new Set([
  "awards-2025",
  "research-methodology-workshop",
]);
const HIDDEN_EVENT_TITLES = new Set([
  "Academic Excellence Awards 2025",
  "Research Methodology Workshop",
]);
const FILTERS = [
  { id: "all", label: "All Events" },
  { id: "conference", label: "Conferences" },
  { id: "award", label: "Awards" },
  { id: "workshop", label: "Workshops" },
];


export const ShowEvents = () => {
  const [events, setEvents] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState("all");
  const dispatch = useDispatch();
  const { allEvent, isFetchedEvent } = useSelector((state: RootState) => state.events)

  const { allAwardCategories } = useSelector((state: RootState) => state.awardCategories)
  const router = useRouter()
  React.useEffect(() => {

    if (allEvent && 
      allEvent.length > 0 && 
      allAwardCategories && allAwardCategories.length > 0) {
      // Filter only published events and map to frontend structure
      const mappedEvents = allEvent
        .filter((item: any) => {
          const status = item?.basic?.status || item?.status;
          return status === "Published";
        })
        .filter((item: any) => {
          const title = item?.basic?.title || item?.title;
          return (
            (!HIDDEN_EVENT_SLUGS.has(item.slug) &&
              !HIDDEN_EVENT_TITLES.has(title))
          );
        })

        .map((item: any) => {
          const relatedAward = item?.basic?.relatedAward || item?.relatedAward;
          const relatedWaradData = allAwardCategories.find((item: any) => item?._id?.toString() === relatedAward?.toString())

          const startDateStr = item?.datetime?.startDate || item?.eventDate;
          const eventDate = startDateStr
            ? new Date(startDateStr)
            : new Date();
          const type = item?.basic?.type || item?.type || "conference";
          const title = item?.basic?.title || item?.title || "";
          const desc =
            item?.basic?.shortDescription ||
            item?.basic?.description ||
            item?.description ||
            "";
          const time = item?.datetime?.startTime || item?.startTime || "";

          let locationStr = "Online";
          if (item?.location) {
            if (typeof item.location === "string") {
              locationStr = item.location;
            } else if (item.location.city || item.location.country) {
              locationStr = [item.location.city, item.location.country]
                .filter(Boolean)
                .join(", ");
            } else if (item.location.venueName) {
              locationStr = item.location.venueName;
            } else if (item.location.locationType === "Online") {
              locationStr = item.location.onlinePlatform || "Online";
            }
          }

          const imageUrl = item?.media?.bannerImage || item?.imageUrl;
          const image =
            Array.isArray(imageUrl) && imageUrl.length > 0
              ? imageUrl[0]
              : typeof imageUrl === "string" && imageUrl
                ? imageUrl
                : "assets/Image/conference.jpeg";

          const tagsStr = item?.basic?.tags || item?.tags;
          const tags = tagsStr
            ? tagsStr.split(",").map((t: string) => t.trim())
            : [];

          return {
            id: String(item._id),
            type: type.toLowerCase(),
            slug: item.slug,
            title: title,
            desc: desc,
            date: {
              day: eventDate.getDate().toString().padStart(2, "0"),
              month: eventDate.toLocaleString("en-US", { month: "short" }),
            },
            time: time,
            location: locationStr,
            image: image,
            tags: tags,
            relatedWaradData: relatedWaradData
          };
        });
      setEvents(mappedEvents);
    }


  }, [allEvent, allAwardCategories]);

  const filteredEvents = events.filter(
    (ev) => filter === "all" || ev.type === filter,
  );

  return (
    <>
      <GetAllEvents />
      {!isFetchedEvent ? (
        <div className="py-24 bg-app-bg flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <section
          data-annotate-id="home-events-section"
          className="py-24 bg-app-bg relative overflow-hidden"
        >
          {/* Decorative background */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, var(--color-navy) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-[9.5px] font-bold tracking-[2px] uppercase text-gold mb-4">
                Upcoming Events
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4">
                International Research{" "}
                <em className="italic font-serif font-medium">
                  Events & Conferences
                </em>
              </h2>
              <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
                Explore global conferences, workshops, and academic awards
                connecting researchers and institutions worldwide.
              </p>
              <div className="w-12 h-0.5 bg-linear-to-r from-gold to-gold-2 mx-auto mt-6 rounded-full" />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold border-1.5 transition-all duration-300",
                    filter === f.id
                      ? "bg-navy text-white border-navy shadow-sh-md"
                      : "bg-app-bg border-border-light text-text-muted hover:border-navy hover:text-navy",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_328px] gap-8 items-start">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((ev) => (
                      <motion.div
                        key={ev.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="group bg-app-bg border-1.5 border-border-light rounded-[2rem] overflow-hidden hover:shadow-sh-lg hover:border-gold/30 transition-all duration-500"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={ev.image}
                            alt={ev.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 bg-gold rounded-2xl p-3 text-center min-w-[64px] shadow-sh-sm">
                            <div className="text-2xl font-extrabold text-navy leading-none">
                              {ev.date.day}
                            </div>
                            <div className="text-[10px] font-bold tracking-wider uppercase text-navy/60 mt-1">
                              {ev.date.month}
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-navy/60 border border-white/20 backdrop-blur-md text-[9px] font-bold tracking-wider uppercase text-white">
                            {ev.type}
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                              <Clock size={14} className="text-gold" /> {ev.time}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                              <MapPin size={14} className="text-gold" />{" "}
                              {ev.location}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-navy mb-3 leading-tight group-hover:text-gold transition-colors duration-300">
                            {ev.title}
                          </h3>
                          <p className="text-[14px] text-text-muted leading-relaxed mb-8 line-clamp-2">
                            {ev.desc}
                          </p>
                          <div className="flex items-center justify-between gap-4 pt-6 border-t border-border-light">
                            <div className="flex gap-1.5">
                              {ev.tags.slice(0, 1).map((tag: any) => (
                                <span
                                  key={tag}
                                  className="text-[9px] font-bold px-3 py-1 rounded-full bg-bg-soft border border-border-light text-text-muted uppercase tracking-wider"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            {/* <Link href={`/events/${ev.slug}`}> */}
                            <Button
                              variant="primary"
                              size="sm"
                              className="rounded-xl px-5 py-2.5 shadow-sh-sm group/btn"
                              onClick={() => {
                                console.log("allEvent", ev)
                                const currentEvent = allEvent.find((item: any) => item._id === ev.id);
                                console.log("currentEvent", currentEvent)
                                console.log("relaewtete", ev.relatedAwardData)
                                  ;
                                if (currentEvent && ev.relatedWaradData) {
                                  dispatch(setCurrentEvent(currentEvent));
                                  dispatch(setCurrentAwardCategory(ev.relatedWaradData))

                                }
                                else {
                                  dispatch(setCurrentEvent(ev));

                                }
                                router.push(`/events/${ev.slug}`);

                              }}
                            >
                              More Details{" "}
                              <ArrowRight
                                size={14}
                                className="group-hover/btn:translate-x-1 transition-transform"
                              />
                            </Button>
                            {/* </Link> */}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 bg-bg-soft rounded-[2rem] border border-dashed border-border-light">
                      <p className="text-lg text-text-muted">
                        No published events found.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-app-bg border-1.5 border-border-light rounded-[2rem] overflow-hidden shadow-sh-sm">
                  <div className="p-6 border-b border-border-light flex items-center gap-3 bg-primary">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-white">
                      <List size={16} />
                    </div>
                    <div className="text-sm font-bold text-white">Categories</div>
                  </div>
                  <div className="p-2">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3.5 text-[13px] font-medium transition-all rounded-xl group",
                          filter === f.id
                            ? "bg-gold-pale text-gold font-bold"
                            : "text-navy hover:bg-bg-soft hover:pl-6",
                        )}
                      >
                        {f.label}
                        <span
                          className={cn(
                            "text-[10px] px-2.5 py-0.5 rounded-full font-bold",
                            filter === f.id
                              ? "bg-gold/20 text-gold"
                              : "bg-bg-2 text-text-muted",
                          )}
                        >
                          {f.id === "all"
                            ? events.length
                            : events.filter((e) => e.type === f.id).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-app-bg border-1.5 border-border-light rounded-[2rem] overflow-hidden shadow-sh-sm p-8 relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />

                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gold-pale flex items-center justify-center text-gold">
                      <Clock size={20} />
                    </div>
                    <div className="text-sm font-bold text-navy">
                      Call for Papers
                    </div>
                  </div>
                  <p className="text-[15px] font-serif font-semibold text-navy leading-tight mb-8 relative z-10">
                    Final deadline for the upcoming 2026 cycle is approaching.
                  </p>
                  <div className="grid grid-cols-4 gap-2 mb-8 relative z-10">
                    <CountdownUnit value="64" label="Days" />
                    <CountdownUnit value="12" label="Hours" />
                    <CountdownUnit value="45" label="Mins" />
                    <CountdownUnit value="08" label="Secs" />
                  </div>
                  <Link
                    href="/registration-form"
                    className="block w-full relative z-10"
                  >
                    <Button
                      variant="gold"
                      className="w-full py-4 rounded-xl shadow-sh-md"
                    >
                      Register Now <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

const CountdownUnit = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-primary rounded-xl p-3 text-center border border-white/10 shadow-sh-sm">
    <div className="text-xl font-extrabold text-white leading-none">
      {value}
    </div>
    <div className="text-[8px] font-bold tracking-wider uppercase text-white/40 mt-1.5">
      {label}
    </div>
  </div>
);
