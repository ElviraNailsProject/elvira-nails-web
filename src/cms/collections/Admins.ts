import type { CollectionConfig } from "payload";

import { adminOnly, isAdmin } from "../access/admin";
import { protectAdminCreation, validateAdminPassword } from "../hooks/admin";

export const Admins: CollectionConfig = {
  slug: "admins",
  labels: { singular: "Администратор", plural: "Администраторы" },
  auth: {
    tokenExpiration: 60 * 60 * 2,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    useSessions: true,
    removeTokenFromResponses: true,
    cookies: {
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    },
  },
  admin: {
    useAsTitle: "name",
    group: "Настройки",
    defaultColumns: ["name", "email"],
  },
  access: {
    admin: ({ req }) => isAdmin(req.user),
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: () => false,
    unlock: adminOnly,
  },
  hooks: {
    beforeChange: [protectAdminCreation],
    beforeOperation: [validateAdminPassword],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Имя",
      required: true,
      maxLength: 120,
    },
  ],
};
