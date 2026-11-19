"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, Icon } from "../shared/ui/controls";
import { ResponsiveDetails } from "../shared/ui/ResponsiveDetails";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import {
  appointmentMessages,
  appointmentServices,
} from "./appointments.messages";
import { appointmentStatuses, type Appointment } from "./appointments.types";
import styles from "./AppointmentDetails.module.css";

export function AppointmentDetails({
  value,
  isNew,
  onClose,
  onSave,
  onDelete,
}: {
  value: Appointment;
  isNew: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => string | null;
  onDelete: () => void;
}) {
  const { t, locale } = useStudioTranslation(appointmentMessages);
  const [editing, setEditing] = useState(isNew);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const update = (patch: Partial<Appointment>) => {
    setDraft({ ...draft, ...patch });
    setError("");
  };

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !(draft.phone.trim() || draft.email.trim())) {
      setError(t("required"));
      return;
    }
    setError(
      onSave({
        ...draft,
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        email: draft.email.trim(),
      }) ?? "",
    );
  }

  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(value.date + "T12:00:00"),
  );
  return (
    <ResponsiveDetails
      open
      onClose={onClose}
      label={t(isNew ? "new" : editing ? "editAppointment" : "details")}
    >
      <form className={styles.form} onSubmit={submit}>
        <section className={styles.card}>
          <h3>
            <Icon name="application-date" />
            {t("dateTime")}
          </h3>
          {editing ? (
            <div className={styles.fields}>
              <Field label={t("date")}>
                <input
                  type="date"
                  required
                  value={draft.date}
                  onChange={(event) => update({ date: event.target.value })}
                />
              </Field>
              <Field label={t("time")}>
                <input
                  type="time"
                  required
                  value={draft.time}
                  onChange={(event) => update({ time: event.target.value })}
                />
              </Field>
              <Field label={t("duration")}>
                <input
                  type="number"
                  min={15}
                  max={720}
                  step={15}
                  required
                  value={draft.duration}
                  onChange={(event) =>
                    update({ duration: Number(event.target.value) })
                  }
                />
              </Field>
            </div>
          ) : (
            <p>
              {date}
              <br />
              {value.time} · {value.duration} {t("minutes")}
            </p>
          )}
        </section>
        <section className={styles.card}>
          <h3>
            <Icon name="schedule" />
            {t("service")}
          </h3>
          {editing ? (
            <div className={styles.fields}>
              <Field label={t("service")}>
                <select
                  value={draft.service}
                  onChange={(event) =>
                    update({
                      service: event.target.value as Appointment["service"],
                    })
                  }
                >
                  {appointmentServices.map((service) => (
                    <option key={service} value={service}>
                      {t(service)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("status")}>
                <select
                  value={draft.status}
                  onChange={(event) =>
                    update({
                      status: event.target.value as Appointment["status"],
                    })
                  }
                >
                  {appointmentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {t(status)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          ) : (
            <>
              <p>{t(value.service)}</p>
              <span className={styles.status} data-status={value.status}>
                {t(value.status)}
              </span>
            </>
          )}
        </section>
        <section className={styles.card}>
          <h3>
            <Icon name="applicant" />
            {t("client")}
          </h3>
          {editing ? (
            <div className={styles.fields}>
              <Field label={t("name")}>
                <input
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={draft.name}
                  onChange={(event) => update({ name: event.target.value })}
                />
              </Field>
              <Field label={t("phone")}>
                <input
                  type="tel"
                  maxLength={40}
                  autoComplete="tel"
                  value={draft.phone}
                  onChange={(event) => update({ phone: event.target.value })}
                />
              </Field>
              <Field label={t("email")}>
                <input
                  type="email"
                  maxLength={160}
                  autoComplete="email"
                  value={draft.email}
                  onChange={(event) => update({ email: event.target.value })}
                />
              </Field>
            </div>
          ) : (
            <div className={styles.contact}>
              <p>{value.name}</p>
              {value.phone && (
                <a href={`tel:${value.phone.replace(/[^+\d]/g, "")}`}>
                  <Icon name="phone" />
                  {value.phone}
                </a>
              )}
              {value.email && (
                <a href={`mailto:${value.email}`}>
                  <Icon name="email" />
                  {value.email}
                </a>
              )}
            </div>
          )}
        </section>
        {(draft.service === "basic" || draft.service === "advanced") && (
          <section className={styles.card}>
            <h3>
              <Icon name="application-status" />
              {t("serviceDetails")}
            </h3>
            <ul className={styles.included}>
              {(["theory", "practice", "tools", "certificate"] as const).map(
                (item) => (
                  <li key={item}>
                    <span aria-hidden="true">✓</span>
                    {t(item)}
                  </li>
                ),
              )}
            </ul>
          </section>
        )}
        <section className={styles.card}>
          <h3>
            <Icon name="application-comment" />
            {t("additional")}
          </h3>
          {editing ? (
            <div className={styles.fields}>
              <Field label={t("comment")}>
                <textarea
                  maxLength={2000}
                  value={draft.comment}
                  onChange={(event) => update({ comment: event.target.value })}
                />
              </Field>
              <Field label={t("source")}>
                <input
                  maxLength={100}
                  value={draft.source}
                  onChange={(event) => update({ source: event.target.value })}
                />
              </Field>
              <Field label={t("notes")}>
                <textarea
                  maxLength={2000}
                  value={draft.notes}
                  onChange={(event) => update({ notes: event.target.value })}
                />
              </Field>
            </div>
          ) : (
            <dl className={styles.meta}>
              {(["comment", "source", "notes"] as const).map((key) => (
                <div key={key}>
                  <dt>{t(key)}</dt>
                  <dd>{value[key] || "—"}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <p className={styles.notice}>{t("demo")}</p>
        <div className={styles.actions}>
          {editing ? (
            <>
              <Button
                onClick={() => {
                  if (isNew) onClose();
                  else {
                    setDraft(value);
                    setEditing(false);
                    setError("");
                  }
                }}
              >
                {t("cancel")}
              </Button>
              <Button variant="primary" type="submit">
                {t("save")}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditing(true)}>
                <Icon name="application-edit" />
                {t("edit")}
              </Button>
              <Button variant="primary" onClick={onDelete}>
                <Icon name="application-delete" />
                {t("delete")}
              </Button>
            </>
          )}
        </div>
      </form>
    </ResponsiveDetails>
  );
}
