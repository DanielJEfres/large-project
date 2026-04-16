import type { Tag } from "./Tag";

export interface UniversityEvent {
  _id: string;
  title: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string | null;
  organizationId: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    profilePicture?: string;
  };
  // Update this to tag once tag backend call is finished
  tags: Tag[];
  attendees: string[];
  isRSO: boolean;
  flyer?: string | null;
  status: "upcoming" | "past" | "cancelled";
  isPublic: boolean;
  rsvpEnabled: boolean;
  rsvpLimit?: number | null;
}
