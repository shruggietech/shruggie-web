/**
 * ServicesSection — Responsive router for the homepage services section.
 *
 * Renders ServicesScroll (GSAP-pinned desktop) on viewports >= 768px
 * and ServicesCarousel (swipeable mobile strip) below 768px.
 *
 * Redesign reference: §4.2, §4.3
 */

"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import ServicesScroll from "@/components/home/ServicesScroll";
import ServicesCarousel from "@/components/home/ServicesCarousel";

export default function ServicesSection() {
  const isMobile = useIsMobile();

  return isMobile ? <ServicesCarousel /> : <ServicesScroll />;
}
