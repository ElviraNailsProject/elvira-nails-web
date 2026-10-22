import type { Access, PayloadRequest, Where } from "payload";

import { isAdmin } from "./admin";
import {
  visibleMediaIDs,
  type CaseMediaReferences,
} from "../lib/content-rules";

const publishedReferences = new WeakMap<PayloadRequest, Promise<string[]>>();

async function findPublishedMediaIDs(req: PayloadRequest): Promise<string[]> {
  const result = await req.payload.find({
    collection: "student-cases",
    where: { _status: { equals: "published" } },
    draft: false,
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    select: { photo: true, gallery: true },
    req,
  });
  return [
    ...new Set(
      result.docs.flatMap((doc) => visibleMediaIDs(doc as CaseMediaReferences)),
    ),
  ];
}

/** An upload is public only while an actually published case uses it in a visible position. */
export const readMedia: Access = async ({ req }) => {
  if (isAdmin(req.user)) return true;
  let references = publishedReferences.get(req);
  if (!references) {
    references = findPublishedMediaIDs(req);
    publishedReferences.set(req, references);
  }
  const ids = await references;
  if (!ids.length) return false;
  return { id: { in: ids } } satisfies Where;
};
