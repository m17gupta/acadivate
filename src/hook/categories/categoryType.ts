export interface CategoryRecord {
  _id?: string;
  title: string;
  desc: string;
  tags: string; // Stored as comma-separated string for simplicity in form
  count: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}
