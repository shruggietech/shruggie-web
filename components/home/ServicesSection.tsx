/**
 * ServicesSection — Responsive router for the homepage services section.
 *
 * Renders ServicesGrid (natural document flow) on viewports >= 768px and
 * ServicesCarousel (swipeable mobile strip) below 768px.
 *
 * Redesign reference: §4.2, §4.3
 */

"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import ServicesGrid from "@/components/home/ServicesGrid";
import ServicesCarousel from "@/components/home/ServicesCarousel";

export default function ServicesSection() {
  const isMobile = useIsMobile();

  return isMobile ? <ServicesCarousel /> : <ServicesGrid />;
}
