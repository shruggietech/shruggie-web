import { z } from "zod";

import type { Article } from "./domain";
import { editorialIdSchema } from "./domain";
import { EditorialValidationError } from "./errors";

export const editorialRoleSchema = z.enum(["editor", "admin"]);

export const editorialMutationContextSchema = z
  .object({
    actorId: editorialIdSchema,
    requestId: z
      .string()
      .trim()
      .min(16)
      .max(128)
      .regex(/^[A-Za-z0-9:_-]+$/),
    role: editorialRoleSchema,
  })
  .strict();

export const editorialAuditActionSchema = z.enum([
  "create",
  "edit",
  "publish",
  "unpublish",
  "archive",
  "restore",
]);

export const editorialAuditEventSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: editorialIdSchema,
    action: editorialAuditActionSchema,
    actorId: editorialIdSchema,
    actorRole: editorialRoleSchema,
    articleId: editorialIdSchema,
    articleRevision: z.number().int().positive(),
    occurredAt: z.string().datetime({ offset: true }),
    requestId: z.string().min(16).max(128),
  })
  .strict();

export type EditorialRole = z.infer<typeof editorialRoleSchema>;
export type EditorialMutationContext = z.infer<
  typeof editorialMutationContextSchema
>;
export type EditorialAuditAction = z.infer<typeof editorialAuditActionSchema>;
export type EditorialAuditEvent = z.infer<typeof editorialAuditEventSchema>;

export function parseEditorialAuditEvent(input: unknown): EditorialAuditEvent {
  const result = editorialAuditEventSchema.safeParse(input);
  if (!result.success) {
    throw new EditorialValidationError("Editorial audit record is invalid.", {
      issues: result.error.issues,
    });
  }
  return result.data;
}

export function parseEditorialMutationContext(
  input: unknown,
): EditorialMutationContext {
  const result = editorialMutationContextSchema.safeParse(input);
  if (!result.success) {
    throw new EditorialValidationError("Mutation context is invalid.", {
      issues: result.error.issues,
    });
  }
  return result.data;
}

export function deriveAuditAction(
  previous: Article | null,
  next: Article,
): EditorialAuditAction {
  if (!previous) return "create";
  if (previous.state === "archived" && next.state === "draft") {
    return "restore";
  }
  if (next.state === "archived" && previous.state !== "archived") {
    return "archive";
  }
  if (previous.state !== "published" && next.state === "published") {
    return "publish";
  }
  if (previous.state === "published" && next.state === "draft") {
    return "unpublish";
  }
  return "edit";
}

export function createAuditEvent(
  id: string,
  previous: Article | null,
  next: Article,
  context: EditorialMutationContext,
): EditorialAuditEvent {
  const parsedContext = parseEditorialMutationContext(context);
  if (next.revision.updatedBy !== parsedContext.actorId) {
    throw new EditorialValidationError(
      "The article revision editor must match the authorized actor.",
      {
        actorId: parsedContext.actorId,
        updatedBy: next.revision.updatedBy,
      },
    );
  }
  return editorialAuditEventSchema.parse({
    schemaVersion: 1,
    id,
    action: deriveAuditAction(previous, next),
    actorId: parsedContext.actorId,
    actorRole: parsedContext.role,
    articleId: next.id,
    articleRevision: next.revision.number,
    occurredAt: new Date().toISOString(),
    requestId: parsedContext.requestId,
  });
}
