export const appointmentStatuses = [
  "confirmed",
  "pending",
  "rescheduled",
  "cancelled",
] as const;
export type AppointmentStatus = (typeof appointmentStatuses)[number];
export type Appointment = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service:
    "basic" | "manicure" | "french" | "advanced" | "extensions" | "design";
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  comment: string;
  source: string;
  notes: string;
};
