import type { Access, FieldAccess } from "payload";

export function isAdmin(user: unknown): boolean {
  return Boolean(
    user &&
    typeof user === "object" &&
    "collection" in user &&
    user.collection === "admins" &&
    "id" in user &&
    user.id,
  );
}

export const adminOnly: Access = ({ req }) => isAdmin(req.user);

export const adminFieldOnly: FieldAccess = ({ req }) => isAdmin(req.user);

export const adminOrPublished: Access = ({ req }) =>
  isAdmin(req.user) || { _status: { equals: "published" } };

export const readContacts: FieldAccess = ({ req, siblingData, doc }) =>
  isAdmin(req.user) ||
  siblingData?.publishContacts === true ||
  doc?.publishContacts === true;
