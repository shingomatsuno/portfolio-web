import sanitizeHtml from 'sanitize-html';
export function SafeHTML({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}
