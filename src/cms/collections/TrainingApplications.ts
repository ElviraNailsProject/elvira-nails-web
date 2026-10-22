import type { CollectionConfig } from "payload";

import { adminOnly } from "../access/admin";
import { trainingStatuses } from "../lib/content-rules";

export const TrainingApplications: CollectionConfig = {
  slug: "training-applications",
  labels: { singular: "Заявка на обучение", plural: "Заявки на обучение" },
  admin: {
    useAsTitle: "fullName",
    group: "Обучение",
    defaultColumns: ["applicationDate", "fullName", "email", "phone", "status"],
    listSearchableFields: ["fullName", "email", "phone"],
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
      label: "Имя и фамилия",
      required: true,
      maxLength: 120,
    },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "phone", type: "text", label: "Телефон", maxLength: 40 },
    {
      name: "message",
      type: "textarea",
      label: "Комментарий",
      maxLength: 10000,
    },
    {
      name: "status",
      type: "select",
      label: "Статус",
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
      label: "Дата заявки",
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
