export interface UniversityEvent {
  _id: string;
  title: string;
  description: string | null;
  location: string | null;
  startDate: string;
  endDate?: string | null;
  organizationId: string | null;
  createdBy: string;
  tags: string[];
  attendees: string[];
  isRSO: boolean;
  flyer: string | null;
  status: "upcoming" | "ongoing" | "cancelled" | "completed";
  isPublic: boolean;
  rsvpEnabled: boolean;
  rsvpLimit: number | null;
  createdAt?: string;
  updatedAt?: string;
}
