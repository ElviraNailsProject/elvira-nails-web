import type { CollectionConfig, TextFieldSingleValidation } from "payload";

import {
  adminOnly,
  adminOrPublished,
  isAdmin,
  readContacts,
} from "../access/admin";
import {
  contactTypes,
  redactCaseForPublic,
  trainingStatuses,
  validateContactValue,
  validateContacts,
  validateGallery,
} from "../lib/content-rules";

const validateContact: TextFieldSingleValidation = (value, { siblingData }) =>
  validateContactValue(
    siblingData && typeof siblingData === "object" && "type" in siblingData
      ? siblingData.type
      : undefined,
    value,
  );

export const StudentCases: CollectionConfig = {
  slug: "student-cases",
  labels: { singular: "Кейс ученицы", plural: "Кейсы учениц" },
  admin: {
    useAsTitle: "studentName",
    group: "Обучение",
    defaultColumns: ["studentName", "status", "_status", "updatedAt"],
    listSearchableFields: ["studentName", "city"],
    description:
      "Заполните историю, выберите язык и добавьте работы ученицы. Черновики доступны только администратору.",
  },
  defaultSort: "sortOrder",
  access: {
    create: adminOnly,
    read: adminOrPublished,
    update: adminOnly,
    delete: adminOnly,
    readVersions: adminOnly,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    afterRead: [
      ({ doc, req }) => (isAdmin(req.user) ? doc : redactCaseForPublic(doc)),
    ],
  },
  fields: [
    {
      name: "studentName",
      type: "text",
      label: "Имя ученицы",
      required: true,
      maxLength: 120,
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      label: "Фотография ученицы",
    },
    { name: "city", type: "text", label: "Город и страна", maxLength: 160 },
    {
      name: "resultTitle",
      type: "text",
      label: "Короткое описание",
      localized: true,
      required: true,
      maxLength: 200,
    },
    {
      name: "story",
      type: "textarea",
      label: "История ученицы",
      localized: true,
      required: true,
      maxLength: 10000,
    },
    {
      name: "testimonial",
      type: "textarea",
      label: "Отзыв ученицы",
      localized: true,
      maxLength: 5000,
    },
    {
      name: "status",
      type: "select",
      // PostgreSQL normalizes status and Payload's _status to the same default enum name.
      enumName: ({ tableName }) => `enum_${tableName}_training_status`,
      label: "Статус обучения",
      required: true,
      defaultValue: "WAITING",
      options: [...trainingStatuses],
      admin: {
        position: "sidebar",
        components: { Cell: "/src/cms/components/StatusCell#StatusCell" },
      },
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Порядок на сайте",
      required: true,
      defaultValue: 0,
      min: 0,
      max: 1000000,
      admin: { position: "sidebar", step: 1 },
      validate: (value: number | null | undefined) =>
        (typeof value === "number" &&
          Number.isInteger(value) &&
          value >= 0 &&
          value <= 1000000) ||
        "Введите целое число от 0 до 1000000.",
    },
    {
      name: "publishContacts",
      type: "checkbox",
      label: "Показывать контакты на сайте",
      defaultValue: false,
      admin: {
        description:
          "Включайте только с разрешения ученицы. Иначе контакты доступны только администратору.",
      },
    },
    {
      name: "contacts",
      type: "array",
      label: "Контакты",
      maxRows: 6,
      access: { read: readContacts },
      validate: validateContacts,
      fields: [
        {
          name: "type",
          type: "select",
          label: "Тип контакта",
          required: true,
          options: [...contactTypes],
        },
        {
          name: "value",
          type: "text",
          label: "Контакт",
          required: true,
          maxLength: 254,
          validate: validateContact,
        },
      ],
    },
    {
      name: "gallery",
      type: "array",
      label: "Работы ученицы",
      maxRows: 40,
      labels: { singular: "Фотография", plural: "Фотографии" },
      admin: {
        description:
          "Меняйте порядок перетаскиванием. На сайте будут только фотографии с отметкой «Показывать на сайте».",
      },
      validate: validateGallery,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Фотография",
          required: true,
          access: {
            read: ({ req, siblingData }) =>
              isAdmin(req.user) || siblingData?.isPublished === true,
          },
        },
        {
          name: "isPublished",
          type: "checkbox",
          label: "Показывать на сайте",
          defaultValue: false,
        },
        {
          name: "isCover",
          type: "checkbox",
          label: "Обложка кейса",
          defaultValue: false,
        },
      ],
    },
  ],
};
