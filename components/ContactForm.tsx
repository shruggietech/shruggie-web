/**
 * ContactForm — Client component for the Contact page.
 *
 * Integrates @formspree/react for submission, React Hook Form for field
 * management, and Zod for client-side validation. All form fields meet
 * the accessibility requirements in §3.2.
 *
 * Spec reference: §6.8 (Contact), §3.2 (Form Accessibility)
 */

"use client";

import { useForm as useFormspree } from "@formspree/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "@/components/ui/Button";

/* ── Validation Schema ──────────────────────────────────────────────────── */

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
  referral: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/* ── Component ──────────────────────────────────────────────────────────── */

export default function ContactForm() {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const [formspreeState, submitToFormspree] = useFormspree(
    formspreeId ?? "placeholder"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  /* On valid submission, forward data to Formspree */
  const onSubmit = async (data: ContactFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.company) formData.append("company", data.company);
    formData.append("message", data.message);
    if (data.referral) {
      formData.append("referral", data.referral);
    }

    await submitToFormspree(formData);
  };

  /* ── Success State ──────────────────────────────────────────────────── */

  if (formspreeState.succeeded) {
    return (
      <div
        role="status"
        className="rounded-xl border border-accent/30 bg-[rgba(43,204,115,0.06)] p-8 text-center"
      >
        <p className="font-display text-display-sm font-bold text-text-primary">
          Thanks for reaching out.
        </p>
        <p className="mt-2 text-body-md text-text-secondary">
          We will get back to you within one business day.
        </p>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────────── */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
    >
      {/* Error summary for screen readers */}
      {Object.keys(errors).length > 0 && (
        <div aria-live="polite" className="sr-only">
          There are {Object.keys(errors).length} errors in the form. Please
          correct them before submitting.
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="contact-name"
          className="mb-2 block text-body-sm font-medium text-text-primary"
        >
          Name <span className="text-cta">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className="w-full rounded-lg border border-border/50 bg-bg-elevated/50 backdrop-blur-sm px-4 py-3 text-body-md text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-green-bright/40"
          placeholder="Your name"
          {...register("name")}
        />
        {errors.name && (
          <p
            id="contact-name-error"
            role="alert"
            className="mt-1.5 text-body-sm text-cta"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="contact-email"
          className="mb-2 block text-body-sm font-medium text-text-primary"
        >
          Email <span className="text-cta">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className="w-full rounded-lg border border-border/50 bg-bg-elevated/50 backdrop-blur-sm px-4 py-3 text-body-md text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-green-bright/40"
          placeholder="you@company.com"
          {...register("email")}
        />
        {errors.email && (
          <p
            id="contact-email-error"
            role="alert"
            className="mt-1.5 text-body-sm text-cta"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Company / Organization */}
      <div>
        <label
          htmlFor="contact-company"
          className="mb-2 block text-body-sm font-medium text-text-primary"
        >
          Company / Organization
        </label>
        <input
          id="contact-company"
          type="text"
          autoComplete="organization"
          className="w-full rounded-lg border border-border/50 bg-bg-elevated/50 backdrop-blur-sm px-4 py-3 text-body-md text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-green-bright/40"
          placeholder="Your company (optional)"
          {...register("company")}
        />
      </div>

      {/* Message (How can we help?) */}
      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-body-sm font-medium text-text-primary"
        >
          How can we help? <span className="text-cta">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          className="w-full resize-y rounded-lg border border-border/50 bg-bg-elevated/50 backdrop-blur-sm px-4 py-3 text-body-md text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-green-bright/40"
          placeholder="Tell us about your project or question"
          {...register("message")}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            className="mt-1.5 text-body-sm text-cta"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      {/* How did you hear about us? */}
      <div>
        <label
          htmlFor="contact-referral"
          className="mb-2 block text-body-sm font-medium text-text-primary"
        >
          How did you hear about us?
        </label>
        <select
          id="contact-referral"
          className="w-full appearance-none rounded-lg border border-border/50 bg-bg-elevated/50 backdrop-blur-sm px-4 py-3 text-body-md text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-green-bright/40"
          {...register("referral")}
        >
          <option value="">Select an option (optional)</option>
          <option value="Search engine">Search engine</option>
          <option value="Referral">Referral</option>
          <option value="Social media">Social media</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Formspree errors */}
      {formspreeState.errors && (
        <div
          aria-live="polite"
          className="rounded-lg border border-cta/30 bg-[rgba(255,83,0,0.06)] p-4 text-body-sm text-cta"
        >
          Something went wrong. Please try again or reach out to us directly.
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={formspreeState.submitting}
        className="w-full md:w-auto"
      >
        {formspreeState.submitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

export { ContactForm };
