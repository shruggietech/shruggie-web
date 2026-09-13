import { z } from "zod";

import { EditorialValidationError } from "./errors";

const contentAuthoritySchema = z.enum(["repository", "firestore"]);

export type ContentAuthority = z.infer<typeof contentAuthoritySchema>;

/**
 * Repository content remains available for local development, migration, and
 * disaster recovery. Deployed production defaults to Firestore so a missing
 * environment value cannot silently restore the legacy publication path.
 */
export function getContentAuthority(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): ContentAuthority {
  const configured = environment.CMS_CONTENT_AUTHORITY;
  if (!configured) {
    return environment.VERCEL_ENV === "production" ? "firestore" : "repository";
  }

  const parsed = contentAuthoritySchema.safeParse(configured);
  if (!parsed.success) {
    throw new EditorialValidationError(
      "CMS_CONTENT_AUTHORITY must be repository or firestore.",
      { value: configured },
    );
  }
  return parsed.data;
}
