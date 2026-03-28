export type NominationStatus = 'New' | 'Under Review' | 'Shortlisted' | 'Approved' | 'Rejected';

export interface NominationRecord {
  _id?: string;
  nomineeName: string;
  award: string;
  category: string;
  submittedOn: string;
  status: NominationStatus;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NominationCreateInput = Omit<NominationRecord, '_id' | 'createdAt' | 'updatedAt'>;
export type NominationUpdateInput = NominationCreateInput & { _id: string };
