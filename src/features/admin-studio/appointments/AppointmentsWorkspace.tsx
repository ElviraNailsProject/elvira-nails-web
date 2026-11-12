"use client";

import Link from "next/link";
import { useAuth } from "@payloadcms/ui";
import { useMemo, useState } from "react";
import { useLocalDraft } from "../shared/drafts/useLocalDraft";
import { useCompactLayout } from "../shared/ui/useCompactLayout";
import { Button, Icon } from "../shared/ui/controls";
import { ConfirmDialog } from "../shared/ui/ConfirmDialog";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { AppointmentDetails } from "./AppointmentDetails";
import {
  appointmentMessages,
  appointmentServices,
} from "./appointments.messages";
import {
  createAppointmentDraft,
  createDemoAppointments,
} from "./appointments.demo";
import {
  appointmentStatuses,
  type Appointment,
  type AppointmentStatus,
} from "./appointments.types";
import styles from "./AppointmentsWorkspace.module.css";

function startsAt(appointment: Appointment) {
  const [hours, minutes] = appointment.time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function AppointmentsWorkspace({
  dashboard = false,
}: {
  dashboard?: boolean;
}) {
  const { t, locale } = useStudioTranslation(appointmentMessages);
  const { user } = useAuth();
  const compact = useCompactLayout();
  const initial = useMemo(() => createDemoAppointments(), []);
  const [appointments, , save] = useLocalDraft<Appointment[]>(
    "appointments",
    initial,
  );
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [deleting, setDeleting] = useState<Appointment | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [limit, setLimit] = useState(dashboard ? 6 : 7);
  const filtered = appointments
    .filter(
      (item) =>
        (!query ||
          `${item.name} ${item.phone} ${item.email}`
            .toLocaleLowerCase(locale)
            .includes(query.toLocaleLowerCase(locale))) &&
        (!status || item.status === status) &&
        (!service || item.service === service) &&
        (!date || item.date === date),
    )
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const visible = filtered.slice(0, limit);
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "short" }).format(
      new Date(value + "T12:00:00"),
    );
  const reset = () => {
    setQuery("");
    setStatus("");
    setService("");
    setDate("");
    setLimit(dashboard ? 6 : 7);
  };
  const isNew =
    selected !== null && !appointments.some((item) => item.id === selected.id);

  function saveAppointment(value: Appointment) {
    const conflict =
      value.status !== "cancelled" &&
      appointments.some((other) => {
        if (
          other.id === value.id ||
          other.date !== value.date ||
          other.status === "cancelled"
        )
          return false;
        return (
          startsAt(value) < startsAt(other) + other.duration &&
          startsAt(other) < startsAt(value) + value.duration
        );
      });
    if (conflict) return t("conflict");
    const next = isNew
      ? [...appointments, value]
      : appointments.map((item) => (item.id === value.id ? value : item));
    if (!save(next)) return t("draftFailed");
    setSelected(null);
    return null;
  }

  if (!compact)
    return (
      <p>
        {t("compactOnly")}{" "}
        <Link href="/admin/collections/training-applications">
          {t("training")}
        </Link>
      </p>
    );

  return (
    <div className={styles.workspace}>
      {dashboard ? (
        <>
          <section className={styles.welcome}>
            <div className={styles.welcomeText}>
              <h1>
                {t("welcome")}
                <br />
                {typeof user?.name === "string" ? user.name : "Elvira"}
              </h1>
              <p>{t("welcomeHint")}</p>
              <small>«Beautiful nails create happy people.»</small>
            </div>
            <div className={styles.photo}>
              <Icon name="studio-photo-placeholder" />
              <span>{t("studioPhoto")}</span>
            </div>
          </section>
          <div className={styles.stats}>
            {(["today", "pending", "cancelled"] as const).map((key) => (
              <div key={key}>
                <span>{t(key)}</span>
                <strong>
                  {
                    appointments.filter((item) =>
                      key === "today"
                        ? item.date === initial[0].date
                        : item.status === key,
                    ).length
                  }
                </strong>
                <small>{t("records")}</small>
              </div>
            ))}
          </div>
        </>
      ) : (
        <header className={styles.pageHeading}>
          <h1>{t("appointments")}</h1>
          <p>{t("hint")}</p>
        </header>
      )}
      <p className={styles.demo}>{t("demo")}</p>
      {!dashboard && (
        <nav className={styles.sections} aria-label={t("appointments")}>
          <span aria-current="page">{t("procedures")}</span>
          <Link href="/admin/collections/training-applications">
            {t("training")}
          </Link>
        </nav>
      )}
      <section
        className={`${styles.list} ${dashboard ? styles.dashboardList : ""}`}
      >
        <header className={styles.listHeading}>
          {dashboard && (
            <div>
              <small>{t("appointments")}</small>
              <h2>{t("allRecords")}</h2>
            </div>
          )}
          <label className={styles.date}>
            <span>{t("date")}</span>
            <input
              type="date"
              aria-label={t("date")}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <Button
            className={styles.add}
            variant="primary"
            onClick={() => setSelected(createAppointmentDraft())}
          >
            <Icon name="add-white" />
            {t("new")}
          </Button>
        </header>
        <div className={styles.filters}>
          <div
            className={styles.statuses}
            role="group"
            aria-label={t("status")}
          >
            <button
              type="button"
              aria-pressed={!status}
              onClick={() => setStatus("")}
            >
              {t("all")}
            </button>
            {appointmentStatuses.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={status === item}
                onClick={() => setStatus(item)}
              >
                {t(item)}
              </button>
            ))}
          </div>
          <div className={styles.search}>
            <input
              type="search"
              aria-label={t("search")}
              placeholder={t("search")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              aria-label={t("service")}
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              <option value="">{t("allServices")}</option>
              {appointmentServices.map((item) => (
                <option key={item} value={item}>
                  {t(item)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.tableHead} aria-hidden="true">
          <span>{t("client")}</span>
          <span>{t("service")}</span>
          <span>{t("dateTime")}</span>
          <span>{t("status")}</span>
          <span />
        </div>
        <ul className={styles.records}>
          {visible.map((item) => (
            <li key={item.id}>
              <button
                className={styles.record}
                type="button"
                onClick={() => setSelected(item)}
                aria-label={`${t("details")}: ${item.name}, ${formatDate(item.date)}, ${item.time}`}
              >
                <span className={styles.client}>
                  <span className={styles.avatar} aria-hidden="true">
                    {Array.from(item.name)[0]}
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.phone}</small>
                  </span>
                </span>
                <span className={styles.service}>
                  <strong>{t(item.service)}</strong>
                  <small>
                    {t(
                      item.service === "basic" || item.service === "advanced"
                        ? "training"
                        : "service",
                    )}
                  </small>
                </span>
                <span className={styles.when}>
                  {formatDate(item.date)}
                  <small>
                    {item.time} · {item.duration} {t("minutes")}
                  </small>
                </span>
                <span className={styles.status} data-status={item.status}>
                  {t(item.status)}
                </span>
                <span className={styles.open}>
                  <Icon name="chevron-right" />
                </span>
              </button>
            </li>
          ))}
        </ul>
        {!filtered.length && (
          <div className={styles.empty}>
            <p>{t("empty")}</p>
            <Button onClick={reset}>{t("reset")}</Button>
          </div>
        )}
        <footer className={styles.footer}>
          <span>
            {visible.length} / {filtered.length}
          </span>
          {dashboard ? (
            <Link href="/admin/studio/appointments">{t("allRecords")} →</Link>
          ) : (
            limit < filtered.length && (
              <Button onClick={() => setLimit((value) => value + 7)}>
                {t("more")}
              </Button>
            )
          )}
          {(query || status || service || date) && (
            <button type="button" onClick={reset}>
              {t("reset")}
            </button>
          )}
        </footer>
      </section>
      {selected && (
        <AppointmentDetails
          key={selected.id}
          value={selected}
          isNew={isNew}
          onClose={() => setSelected(null)}
          onSave={saveAppointment}
          onDelete={() => setDeleting(selected)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title={t("remove")}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            if (save(appointments.filter((item) => item.id !== deleting.id))) {
              setDeleting(null);
              setSelected(null);
            }
          }}
        >
          <p>
            {deleting.name} · {formatDate(deleting.date)}
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
