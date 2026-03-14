/**
 * WorkSection — Responsive router for the homepage work section.
 *
 * Renders WorkScroll (GSAP-pinned desktop) on viewports >= 768px
 * and WorkCarousel (swipeable mobile strip) below 768px.
 *
 * Redesign reference: §4.2, §4.3, §5.3
 */

"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import WorkScroll from "@/components/home/WorkScroll";
import WorkCarousel from "@/components/home/WorkCarousel";

export default function WorkSection() {
  const isMobile = useIsMobile();

  return isMobile ? <WorkCarousel /> : <WorkScroll />;
}
