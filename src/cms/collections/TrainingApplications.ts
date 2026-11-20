import type { CollectionConfig } from "payload";

import { adminOnly } from "../access/admin";
import { trainingStatuses } from "../lib/content-rules";
import { trainingApplicationMessages as labels } from "../components/training-applications/training-application-messages";

export const TrainingApplications: CollectionConfig = {
  slug: "training-applications",
  labels: { singular: labels.application, plural: labels.applications },
  admin: {
    useAsTitle: "fullName",
    group: "Обучение",
    defaultColumns: ["applicationDate", "fullName", "email", "phone", "status"],
    listSearchableFields: ["fullName", "email", "phone"],
    components: {
      Description:
        "/src/cms/components/training-applications/TrainingApplicationsIntro#TrainingApplicationsIntro",
      beforeListTable: [
        "/src/cms/components/training-applications/TrainingApplicationsList#TrainingApplicationsList",
      ],
    },
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  defaultSort: "-applicationDate",
  fields: [
    {
      name: "fullName",
      type: "text",
      label: labels.name,
      required: true,
      maxLength: 120,
    },
    { name: "email", type: "email", label: labels.email, required: true },
    { name: "phone", type: "text", label: labels.phone, maxLength: 40 },
    {
      name: "message",
      type: "textarea",
      label: labels.comment,
      maxLength: 10000,
    },
    {
      name: "status",
      type: "select",
      label: labels.status,
      required: true,
      defaultValue: "WAITING",
      options: [...trainingStatuses],
      admin: {
        position: "sidebar",
        components: { Cell: "/src/cms/components/StatusCell#StatusCell" },
      },
    },
    {
      name: "applicationDate",
      type: "date",
      label: labels.date,
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd.MM.yyyy HH:mm",
        },
      },
    },
  ],
};
