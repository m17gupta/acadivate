export type AwardStatus = 'Draft' | 'Open' | 'Review' | 'Published' | 'Archived';

export interface AwardItem {
  name: string;
  slug: string;
  price: number;
  active: boolean;
}

export interface AwardRecord {
  _id?: string;
  title: string;
  cycle: string;
  category: string;
  nominationDeadline: string;
  status: AwardStatus;
  active: boolean;
  items: AwardItem[];
  imageUrl?: string | string[];
  createdAt?: string;
  updatedAt?: string;
}

export type AwardCreateInput = Omit<AwardRecord, '_id' | 'createdAt' | 'updatedAt'>;
export type AwardUpdateInput = AwardCreateInput & { _id: string };
