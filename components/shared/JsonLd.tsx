/**
 * JsonLd — Injects a <script type="application/ld+json"> tag.
 *
 * Accepts a data object (any valid JSON-LD structure) and serializes it
 * into a script tag for search engine and answer engine consumption.
 *
 * Spec reference: §8.2 (JSON-LD Schema Markup)
 */

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export { JsonLd };
export type { JsonLdProps };
