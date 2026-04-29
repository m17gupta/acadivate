export type NominationStatus =
  | "New"
  | "Under Review"
  | "Shortlisted"
  | "Approved"
  | "Rejected";

export interface NominationFormType {
  _id?: string;
  orgName?: string;
  promoter?: string;
  ownership?: string;
  address?: string;
  mobile?: string;
  state?: string;
  city?: string;
  country?: string;
  email?: string;
  website?: string;
  gstin?: string;
  paymentMode?: string;
  agreeTerms?: Boolean;
  researchPublication?: string[];
  bookPublication?: string[];
  researchProject?: string[];
  patentPolicyDocument?: string[];
  status?: string;
  totalAmount?: number;
  // selectedAwards?: string[];
  academicAwards?: string[];
  startupAwards?: string[];
  riseAwards?: string[];
  entrepreneurAwards?: string[];
  createdAt?: string;
  updatedAt?: string;
  submittedById?:string;
  id?: string;
  eventName?: string;
}
export interface NominationRecord {
  _id?: string;
  nomineeFirstName: string;
  nomineeLastName: string;
  nomineeEmail: string;
  award: string;
  category: string;
  voting?: string;
  source?: string;
  narrative: string;
  roles?: string;
  education?: string;
  status: NominationStatus;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NominationCreateInput = Omit<
  NominationRecord,
  "_id" | "createdAt" | "updatedAt"
>;
export type NominationUpdateInput = NominationCreateInput & { _id: string };
