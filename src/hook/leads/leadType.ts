export type LeadStatus = 'New' | 'Open' | 'Replied' | 'Closed';

export interface LeadRecord {
  _id?: string;
  name: string;
  email: string;
  source: string;
  subject: string;
  status: LeadStatus;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadCreateInput = Omit<LeadRecord, '_id' | 'createdAt' | 'updatedAt'>;
export type LeadUpdateInput = LeadCreateInput & { _id: string };
