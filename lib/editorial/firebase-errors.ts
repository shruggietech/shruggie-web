import {
  ContentTimeoutError,
  ContentUnavailableError,
  EditorialError,
} from "./errors";

const timeoutCodes = new Set([
  4,
  "4",
  "deadline-exceeded",
  "DEADLINE_EXCEEDED",
]);
const unavailableCodes = new Set([
  2,
  13,
  14,
  "2",
  "13",
  "14",
  "internal",
  "INTERNAL",
  "unavailable",
  "UNAVAILABLE",
  "unknown",
  "UNKNOWN",
]);

function errorCode(error: unknown): unknown {
  return error && typeof error === "object" && "code" in error
    ? (error as { code: unknown }).code
    : undefined;
}

export function mapFirebaseError(
  error: unknown,
  operation: string,
  timeoutMs: number,
): EditorialError {
  if (error instanceof EditorialError) return error;
  const code = errorCode(error);
  if (timeoutCodes.has(code as string | number)) {
    return new ContentTimeoutError(operation, timeoutMs, error);
  }
  if (unavailableCodes.has(code as string | number)) {
    return new ContentUnavailableError(operation, error);
  }
  return new ContentUnavailableError(operation, error);
}

export async function withEditorialTimeout<T>(
  operation: string,
  timeoutMs: number,
  task: () => Promise<T>,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new ContentTimeoutError(operation, timeoutMs)),
          timeoutMs,
        );
      }),
    ]);
  } catch (error) {
    throw mapFirebaseError(error, operation, timeoutMs);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
