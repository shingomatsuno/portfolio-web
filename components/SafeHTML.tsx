import sanitizeHtml from 'sanitize-html';

export function SafeHTML({ html }: { html: string }) {
  const cleanHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'h1',
      'h2',
      'h3',
      'h4',
      'span',
      'div',
      'p',
      'pre',
      'code',
      's',
      'a',
      'u',
    ]),
    allowedAttributes: {
      '*': ['class', 'id', 'style'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
