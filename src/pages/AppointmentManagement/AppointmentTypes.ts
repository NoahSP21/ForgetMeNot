// AppointmentTypes.ts

export type DefaultSection = "WORK" | "DOCTOR" | "TRAVEL";
export type Section = DefaultSection | string;

export interface Appointment {
  id?: string;       // always defined (para evitar keys undefined)
  title: string;
  section: Section;
  date: string;     // "DD/MM/YYYY"
  time: string;     // "HH:MM AM/PM"
  confirmed: boolean;
  createdAt: number;
}
