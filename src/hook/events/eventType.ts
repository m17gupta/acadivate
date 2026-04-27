export type EventType = "Conference" | "Workshop" | "Forum" | "Summit";
export type EventStatus = "Draft" | "Scheduled" | "Published" | "Archived";
export type EventFeatured = "Yes" | "No";

export interface EventRecord {
  _id?: string;
  title?: string;
  slug?: string;
  type?: EventType;
  category?: string;
  shortDescription?: string;
  description?: string;
  tags?: string;
  organizer?: string;
  status?: EventStatus;
  relatedAward?: any;
  
  startDate?: string | { $date: string };
  startTime?: string;
  endDate?: string | { $date: string };
  endTime?: string;
  timeZone?: string;
  registrationDeadline?: string | { $date: string };
  isRecurring?: boolean;
  frequency?: string;
  
  locationType?: string;
  venueName?: string;
  address?: string;
  city?: string;
  country?: string;
  googleMapsLink?: string;
  onlinePlatform?: string;
  meetingLink?: string;
  accessInstructions?: string;
  
  enableTickets?: boolean;
  ticketType?: string;
  price?: string;
  capacity?: string;
  ticketName?: string;
  saleStartDate?: string | { $date: string };
  saleEndDate?: string | { $date: string };
  refundPolicy?: string;
  
  customRegistrationForm?: any[];
  maxAttendees?: string;
  approvalRequired?: string;
  
  agenda?: any[];
  speakers?: any[];
  faqs?: any[];
  termsAndConditions?: any[];
  
  bannerImage?: string;
  thumbnailImage?: string;
  gallery?: string[];
  theme?: string;
  metaTitle?: string;
  metaDescription?: string;
  socialSharingImage?: string;
  seoKeywords?: string;
  
  createdAt?: string | { $date: string };
  updatedAt?: string | { $date: string };
}

export type EventCreateInput = Omit<
  EventRecord,
  "_id" | "createdAt" | "updatedAt"
>;
export type EventUpdateInput = EventCreateInput & { _id: string };
