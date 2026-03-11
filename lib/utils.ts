/**
 * Shared utility functions.
 * Spec reference: §2.4 (Component Primitives)
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
