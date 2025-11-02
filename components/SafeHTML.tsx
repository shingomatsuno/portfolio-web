'use client';

import DOMPurify from 'isomorphic-dompurify';

export function SafeHTML({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}
