export type AwardStatus = 'Draft' | 'Open' | 'Review' | 'Published' | 'Archived';

export interface AwardCategoryItem {
  name: string;
  slug: string;
  price: number;
}

export interface AwardCategory {
  _id: string;
  title: string;
  status: AwardStatus | string;
  items: AwardCategoryItem[];
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  cycle?: string;
}

export interface AwardCategoryEvent {
  _id: string;
  name: string;
  selectedAwards: AwardCategory[];
  deadline: string;
  status: AwardStatus | string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AwardCategoryEventCreateInput = Omit<AwardCategoryEvent, '_id' | 'createdAt' | 'updatedAt'>;
export type AwardCategoryEventUpdateInput = Partial<AwardCategoryEvent> & { _id: string };
