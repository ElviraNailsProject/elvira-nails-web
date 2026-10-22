import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeOperationHook,
} from "payload";

import { isAdmin } from "../access/admin";

export const protectAdminCreation: CollectionBeforeChangeHook = ({
  data,
  operation,
  req,
}) => {
  // Payload's first-register endpoint bypasses create access. Only the private setup script may bootstrap an owner.
  if (
    operation === "create" &&
    !isAdmin(req.user) &&
    req.context?.cmsBootstrapAdmin !== true
  ) {
    throw new APIError(
      "Создание администратора доступно только владельцу сайта.",
      403,
    );
  }
  return data;
};

export const validateAdminPassword: CollectionBeforeOperationHook = ({
  args,
  operation,
}) => {
  if (
    operation !== "create" &&
    operation !== "update" &&
    operation !== "resetPassword"
  )
    return args;
  const data = "data" in args ? args.data : undefined;
  if (
    data &&
    typeof data === "object" &&
    "password" in data &&
    data.password !== undefined
  ) {
    if (
      typeof data.password !== "string" ||
      data.password.length < 16 ||
      data.password.length > 128
    ) {
      throw new APIError(
        "Используйте пароль длиной от 16 до 128 символов.",
        400,
      );
    }
  }
  return args;
};
