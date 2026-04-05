/**
 * Renders a JSON-LD structured data script tag.
 * Escapes '</' sequences to prevent premature script tag termination.
 */
export default function JsonLd({ schema }: { schema: object }): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/<\//g, '<\\/'),
      }}
    />
  )
}
