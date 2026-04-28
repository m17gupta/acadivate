export type EventType = "Conference" | "Workshop" | "Forum" | "Summit";
export type EventStatus = "Draft" | "Scheduled" | "Published" | "Archived";
export type EventFeatured = "Yes" | "No";

export interface EventBasicInfo {
  label?: string;
  title?: string;
  type?: EventType;
  category?: string;
  shortDescription?: string;
  description?: string;
  tags?: string;
  organizer?: string;
  status?: EventStatus;
  relatedAward?: string ;
}

export interface EventDateTimeInfo {
  label?: string;
  startDate?: string | { $date: string };
  startTime?: string;
  endDate?: string | { $date: string };
  endTime?: string;
  timeZone?: string;
  registrationDeadline?: string | { $date: string };
  isRecurring?: boolean;
  frequency?: string;
}

export interface EventLocationInfo {
  label?: string;
  locationType?: string;
  venueName?: string;
  address?: string;
  city?: string;
  country?: string;
  googleMapsLink?: string;
  onlinePlatform?: string;
  meetingLink?: string;
  accessInstructions?: string;
}

export interface EventTicketInfo {
  label?: string;
  enableTickets?: boolean;
  ticketType?: string;
  price?: string;
  capacity?: string;
  ticketName?: string;
  saleStartDate?: string | { $date: string };
  saleEndDate?: string | { $date: string };
  refundPolicy?: string;
}

export interface EventAttendeesInfo {
  label?: string;
  customRegistrationForm?: {
    fieldLabel?: string;
    fieldType?: string;
    required?: boolean;
  }[];
  maxAttendees?: string;
  approvalRequired?: string;
}

export interface EventDetailsInfo {
  label?: string;
  agenda?: {
    time?: string;
    activity?: string;
    speaker?: string;
  }[];
  speakers?: {
    name?: string;
    role?: string;
    bio?: string;
    photo?: string;
  }[];
  faqs?: {
    question?: string;
    answer?: string;
  }[];
  termsAndConditions?: {
    title?: string;
    content?: string;
  }[];
}

export interface EventMediaInfo {
  label?: string;
  bannerImage?: string;
  thumbnailImage?: string;
  theme?: string;
}

export interface EventMarketingInfo {
  label?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
}

export interface EventRecord {
  _id?: string | { $oid: string };
  slug?: string;
  basic?: EventBasicInfo;
  datetime?: EventDateTimeInfo;
  location?: EventLocationInfo;
  tickets?: EventTicketInfo;
  attendees?: EventAttendeesInfo;
  details?: EventDetailsInfo;
  media?: EventMediaInfo;
  marketing?: EventMarketingInfo;
  createdAt?: string | { $date: string };
  updatedAt?: string | { $date: string };
}

export type EventCreateInput = Omit<
  EventRecord,
  "_id" | "createdAt" | "updatedAt"
>;
export type EventUpdateInput = EventCreateInput & { _id: string };
