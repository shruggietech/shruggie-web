/**
 * Service data: single source of truth for the Services hub (`/services`)
 * and the four service detail pages (`/services/[slug]`).
 *
 * Each service renders as an anchored summary section on the hub AND as a
 * standalone detail page with its own copy, capabilities, and FAQPage schema.
 * This structure follows the site's own flagship guidance ("give your most
 * important services their own pages instead of one crowded list, and put
 * real FAQs on those pages, marked up with FAQ schema").
 *
 * FAQ DRAFTS, PENDING FOUNDER REVIEW. The `faqs` answers below are drafted
 * from existing service copy, the ownership thesis, and the Discuss/Create/
 * Deliver process. They are accurate to current positioning but should be
 * reviewed and edited by the founders before being treated as authoritative
 * marketing or legal claims. Wording is intentionally specific and checkable.
 *
 * Spec reference: §6.2 (Services), §8.2 (JSON-LD)
 */

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  /** URL slug and anchor id, e.g. "strategy-brand" -> /services/strategy-brand */
  slug: string;
  /** Full pillar title */
  title: string;
  /** Short label for nav, cards, and breadcrumbs */
  shortName: string;
  /** One-line value statement */
  lead: string;
  /** Supporting paragraph */
  body: string;
  /** Concrete capabilities */
  capabilities: string[];
  /** 3-5 real client questions, see review note above */
  faqs: ServiceFaq[];
  /** Meta description (160 chars or fewer) for the detail page */
  metaDescription: string;
}

export const SERVICES: ServiceDetail[] = [
  {
    slug: "strategy-brand",
    title: "Digital Strategy & Brand",
    shortName: "Strategy & Brand",
    lead: "Your brand is the first thing people see and the last thing they remember. We make both count.",
    body: "We build visual identity systems, brand standards kits, and content architecture from scratch, or refresh what already exists. Your brand should translate consistently across every platform and touchpoint, and we make sure it does.",
    capabilities: [
      "Logo design and visual identity systems",
      "Color palette and typography systems",
      "Brand standards kits",
      "Website strategy and content architecture",
      "Marketing collateral and print materials",
    ],
    metaDescription:
      "Brand identity, standards kits, and content architecture that stay consistent across every platform. Built in Knoxville, TN, and yours to keep.",
    faqs: [
      {
        question: "Do I own the logo and brand files you create?",
        answer:
          "Yes. Every asset we design is delivered to you and yours to keep: logo source files, color and type specifications, and the full brand standards kit. Ownership of what we build is a core policy, and every engagement is governed by a Master Services Agreement and Scope of Work.",
      },
      {
        question: "Can you refresh our existing brand instead of starting over?",
        answer:
          "Yes. We build identity systems from scratch or refine what already exists. If your current brand mostly works, we audit it, keep what is strong, and fix the inconsistencies that show up across your website, print, and social profiles.",
      },
      {
        question: "What is included in a brand standards kit?",
        answer:
          "A documented system others can follow without guessing: logo usage and spacing, the color palette with exact values, typography and hierarchy, and rules for how the brand appears across platforms. It is what keeps your brand consistent whether we apply it or your own team does.",
      },
      {
        question: "We are a small business. Is a full identity system overkill?",
        answer:
          "Not necessarily. We scope brand work to what your situation needs. A local business might need a clean logo and a one-page standards sheet; a growing organization might need full content architecture. We recommend the smallest system that keeps you consistent, not the largest we can bill.",
      },
      {
        question: "How does brand work connect to the rest of the site?",
        answer:
          "Content architecture is where strategy meets build. We plan how your pages are organized and what each one needs to say before development starts. That planning is also what makes your site legible to the search engines and AI systems that read it.",
      },
    ],
  },
  {
    slug: "development",
    title: "Development & Integration",
    shortName: "Development",
    lead: "We build, migrate, and integrate. From marketing sites to custom applications, we handle the full technical stack.",
    body: "We work across whatever stack fits the project, not whatever stack we prefer. New build, migration, blockchain integration, or a compatibility layer over systems you can't replace, the approach is shaped by your situation, not ours.",
    capabilities: [
      "Custom website design and development",
      "Modern web applications",
      "CMS deployment, configuration, and migration",
      "Blockchain architecture and smart contract development",
      "Third-party integrations",
      "DNS management and hosting configuration",
      "Vendor displacement and replatforming",
    ],
    metaDescription:
      "Custom websites, web apps, CMS migrations, and integrations, built on the stack that fits your project. You own the code, domain, and credentials.",
    faqs: [
      {
        question: "What platforms and tech stacks do you work with?",
        answer:
          "We work across whatever stack fits the project, not whatever we prefer. That spans custom builds, modern web application frameworks, and mainstream CMS platforms like WordPress. If you are tied to a system you cannot replace, we can build a compatibility layer over it rather than forcing a rebuild.",
      },
      {
        question: "Can you move our site off our current provider without downtime?",
        answer:
          "Yes. Replatforming and vendor displacement are core work. We migrate content, configure DNS and hosting, and stage the switch so it goes live cleanly. You end up holding your own domain, hosting credentials, and content when it is done.",
      },
      {
        question: "Do we own the code and credentials when the project ends?",
        answer:
          "Yes. Your domain, hosting, and content stay yours, and there is no lock-in that holds your assets hostage. Engagements run under a formal Master Services Agreement and Scope of Work, so what you own is written down, not assumed.",
      },
      {
        question: "Do you build custom web applications, or just websites?",
        answer:
          "Both. Alongside marketing sites we build custom web applications and third-party integrations, and we add AI and workflow automation where it saves real time: answering routine questions, moving data between the tools you already run, and cutting out repetitive manual steps. We scope to the problem and do not reach for complex technology a simpler build would solve.",
      },
      {
        question: "Will the site be fast and accessible?",
        answer:
          "Page speed, mobile usability, and accessibility are treated as requirements, not extras. Ignored, they gate search visibility and shut out real users. We build them in from the start rather than bolting them on at the end.",
      },
    ],
  },
  {
    slug: "marketing",
    title: "Revenue Flows & Marketing Operations",
    shortName: "Marketing Operations",
    lead: "Visibility means nothing without conversion. We build the systems that turn attention into revenue.",
    body: "Every business converts differently. A tour operator needs marketplace visibility. A local shop needs to own local search. An e-commerce brand needs a conversion funnel that doesn't leak. We tailor the strategy to how your customers actually find and buy from you.",
    capabilities: [
      "SEO strategy and execution",
      "Answer Engine Optimization (AEO) with schema markup",
      "Google Ads and Meta advertising",
      "Social media strategy and content planning",
      "Analytics implementation (GA4, GTM, Search Console)",
      "Review generation and reputation management",
      "Marketplace and platform listing optimization",
    ],
    metaDescription:
      "SEO, Answer Engine Optimization, paid ads, and analytics, shaped around how your customers actually find and buy from you. Results you can measure.",
    faqs: [
      {
        question: "What is Answer Engine Optimization (AEO), and do I need it?",
        answer:
          "AEO is optimizing your site so AI-driven search, such as Google's AI Mode, ChatGPT, and Perplexity, can read, summarize, and recommend you accurately. That means clear service pages, real FAQs, consistent business details, and structured data the machines can parse. If customers might ask an AI for a recommendation in your category, it matters.",
      },
      {
        question: "How is AEO different from traditional SEO?",
        answer:
          "SEO aims to rank a page a person clicks; AEO aims to be the source an AI quotes when it answers on the person's behalf. They overlap, since both reward clear, specific, well-structured content, but AEO adds a machine-readable layer (JSON-LD schema, FAQ markup, consistent name, address, and phone) that classic SEO treated as optional.",
      },
      {
        question: "Can you run our Google and Meta ads too?",
        answer:
          "Yes. We handle paid campaigns on Google Ads and Meta alongside the organic work, and we set up analytics first (GA4, Tag Manager, and Search Console) so you can see what each channel actually returns instead of guessing.",
      },
      {
        question: "How do you measure whether marketing is working?",
        answer:
          "We instrument before we spend, so results are measured, not assumed. Then we track the metrics that map to revenue for your business, such as leads, calls, bookings, or sales, rather than vanity numbers that look good in a report and change nothing.",
      },
      {
        question: "Every business converts differently. How do you tailor the strategy?",
        answer:
          "We start from how your customers actually find and buy from you. A tour operator needs marketplace visibility; a local shop needs to own local search; an e-commerce brand needs a funnel that does not leak. The strategy is shaped around your conversion path, not a fixed package.",
      },
    ],
  },
  {
    slug: "ai-data",
    title: "AI & Data Analysis",
    shortName: "AI & Data",
    lead: "AI is not magic. It is infrastructure. We help you build AI systems that solve real problems.",
    body: "Most businesses don't need a custom model. They need AI wired into the systems they already use: answering customer questions, automating repetitive workflows, or surfacing the right data at the right time. We figure out where AI actually helps and build it into your operations.",
    capabilities: [
      "Conversational AI and chatbot development",
      "RAG system design and implementation",
      "Semantic and vector search integration",
      "Workflow automation (email/SMS pipelines, process optimization)",
      "AI adoption consulting",
      "AI governance and responsible-use policy",
      "AI literacy training for staff",
      "Multi-agent coding workflow design",
    ],
    metaDescription:
      "Chatbots, RAG systems, semantic search, and workflow automation wired into the tools you already use. We build the AI that solves a real problem and skip the rest.",
    faqs: [
      {
        question: "Do we need a custom AI model?",
        answer:
          "Most businesses do not need a bespoke model. They need AI wired into the tools they already use: answering customer questions, automating repetitive workflows, or surfacing the right data at the right moment. We find where AI actually helps and build only that.",
      },
      {
        question: "What can an AI chatbot actually do for our business?",
        answer:
          "A RAG (retrieval-augmented generation) chatbot is grounded in your own content, so it answers customer questions from your real documentation, policies, and FAQs instead of making things up. It handles routine questions at any hour and hands off the ones that need a human.",
      },
      {
        question: "Is our data safe if we adopt AI tools?",
        answer:
          "We treat your data as yours, the same ownership principle that governs everything we build. We scope what a system can access, keep sensitive data where it belongs, and document it in the Scope of Work. We will also tell you plainly when AI is the wrong tool for the job.",
      },
      {
        question: "What are RAG and semantic search, in plain terms?",
        answer:
          "Semantic (vector) search understands meaning rather than matching keywords, so a query finds the right answer even when the words do not match exactly. RAG, short for retrieval-augmented generation, puts that on top of an AI assistant so it answers from your actual content instead of guessing. The result is an assistant that is accurate about your business, not just fluent.",
      },
      {
        question: "Can you help our team adopt AI in our own workflows?",
        answer:
          "Yes. Beyond building systems, we consult on AI adoption, including the multi-agent coding workflows we use ourselves, so your team learns where these tools help and where they add risk.",
      },
      {
        question: "Can you help us set AI policy and train our team?",
        answer:
          "Yes. We help you put practical guardrails around AI: governance and acceptable-use policies your compliance and legal teams can actually apply, not boilerplate they have to rewrite, plus AI literacy training that shows your staff what these tools do well, where they fail, and how to use them without exposing the business. We meet your team at their current level and focus on the tools they will actually touch.",
      },
    ],
  },
];

/** Look up a single service by slug. Returns undefined if not found. */
export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

/** All service slugs, used by generateStaticParams and the sitemap. */
export const SERVICE_SLUGS = SERVICES.map((service) => service.slug);
