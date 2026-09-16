import ProcessAccordion from "@/components/shared/ProcessAccordion";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Shared engagement model used by Services and About. The heading, explanatory
 * copy, phase data, interaction, and diagram intentionally have one owner.
 */
export default function HowWeWorkSection() {
  return (
    <section className="section-bg-work py-16 md:py-24">
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="OUR PROCESS"
            title="How We Work"
            description="Every engagement follows an iterative Discuss, Create, Deliver cycle."
            align="center"
          />
        </ScrollReveal>

        <ProcessAccordion />
      </div>
    </section>
  );
}
