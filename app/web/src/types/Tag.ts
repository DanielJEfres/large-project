export interface Tag {
  _id: string;
  name: string;
  isCustom: boolean;
  isApproved: boolean;
  createdBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
