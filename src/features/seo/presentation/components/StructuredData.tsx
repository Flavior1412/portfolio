import type { StructuredDataGraph } from "../../domain/seo";

export function StructuredData({
  data,
}: {
  data: StructuredDataGraph;
}) {
  const serializedData = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializedData }}
    />
  );
}
