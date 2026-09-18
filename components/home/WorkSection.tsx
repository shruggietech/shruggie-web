/**
 * WorkSection — Responsive router for the homepage work section.
 *
 * Renders WorkGrid (natural-flow desktop) on viewports >= 768px
 * and WorkCarousel (swipeable mobile strip) below 768px.
 *
 * Redesign reference: §4.2, §4.3, §5.3
 */

"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import WorkGrid from "@/components/home/WorkGrid";
import WorkCarousel from "@/components/home/WorkCarousel";

export default function WorkSection() {
  const isMobile = useIsMobile();

  return isMobile ? <WorkCarousel /> : <WorkGrid />;
}
