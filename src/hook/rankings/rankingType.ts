export type RankingStatus = 'Draft' | 'Review' | 'Published' | 'Archived';

export interface RankingRecord {
  _id?: string;
  institution: string;
  country: string;
  rank: string;
  score: string;
  status: RankingStatus;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type RankingCreateInput = Omit<RankingRecord, '_id' | 'createdAt' | 'updatedAt'>;
export type RankingUpdateInput = RankingCreateInput & { _id: string };
