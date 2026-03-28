export type EventType = 'Conference' | 'Workshop' | 'Forum' | 'Summit';
export type EventStatus = 'Draft' | 'Scheduled' | 'Published' | 'Archived';
export type EventFeatured = 'Yes' | 'No';

export interface EventRecord {
  _id?: string;
  title?: string;
  slug?: string;
  type?: EventType;
  eventDate?: string;
  startTime?: string;
  location?: string;
  featured?: EventFeatured;
  status?: EventStatus;
  imageUrl?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type EventCreateInput = Omit<EventRecord, '_id' | 'createdAt' | 'updatedAt'>;
export type EventUpdateInput = EventCreateInput & { _id: string };
