import { getPayload } from "payload";
import config from "@payload-config";

export function getCMS() {
  return getPayload({ config });
}
