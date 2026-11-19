import type { Appointment } from "./appointments.types";

function localDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function createAppointmentDraft(): Appointment {
  return {
    id: crypto.randomUUID(),
    name: "",
    phone: "",
    email: "",
    service: "manicure",
    date: localDate(0),
    time: "10:00",
    duration: 60,
    status: "pending",
    comment: "",
    source: "",
    notes: "",
  };
}

/** Example records are stored only as the current administrator's browser draft. */
export function createDemoAppointments(): Appointment[] {
  const entries = [
    ["Anna Kowalenko", "basic", "10:00", 180, "confirmed"],
    ["Maria Petrova", "manicure", "14:00", 90, "pending"],
    ["Sofia Ivanova", "french", "11:00", 120, "confirmed"],
    ["Elena Koval", "manicure", "09:00", 120, "rescheduled"],
    ["Yuliia Shevchenko", "advanced", "13:00", 180, "cancelled"],
    ["Daria Melnyk", "extensions", "10:00", 120, "confirmed"],
    ["Karina Bondar", "design", "15:00", 120, "pending"],
  ] as const;
  return entries.map(([name, service, time, duration, status], index) => ({
    id: `demo-appointment-${index + 1}`,
    name,
    service,
    time,
    duration,
    status,
    date: localDate(Math.floor(index / 2)),
    phone: `+48 123 456 ${String(780 + index)}`,
    email: `client${index + 1}@example.com`,
    comment: "",
    source: "Instagram",
    notes: "",
  }));
}
