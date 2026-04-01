export interface OrganizationMember {
  userId: string;
  orgRole: "member" | "director" | "officer";
}

export interface SocialLinks {
  instagram?: string | null;
  linkedin?: string | null;
  discord?: string | null;
  linktree?: string | null;
  website?: string | null;
}

export interface Organization {
  _id: string; // The hex string from MongoDB
  name: string;
  description?: string | null;
  category?: string | null;
  verificationStatus: "pending" | "approved" | "rejected";
  knightConnectUrl?: string | null;
  contactEmail?: string | null;
  logo?: string | null;
  socialLinks: SocialLinks;
  createdBy: string;
  president?: string | null;
  members: OrganizationMember[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
