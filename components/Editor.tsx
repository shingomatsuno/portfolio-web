'use client';

import { cn } from '@/lib/utils';
import { TextStyleKit, TextStyle } from '@tiptap/extension-text-style';
import type { Editor as ReactEditor } from '@tiptap/react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';

const extensions = [TextStyleKit, StarterKit, TextStyle];

function MenuButton({
  className,
  name,
  disabled,
  active,
  onClick,
}: {
  className?: string;
  name: string;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={cn(
        'rounded-md bg-slate-100 px-1 shadow-md',
        className,
        active ? 'bg-stone-200 shadow-sm' : '',
      )}
    >
      {name}
    </button>
  );
}

function MenuBar({ editor }: { editor: ReactEditor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold'),
      canBold: ctx.editor.can().chain().toggleBold().run(),
      isItalic: ctx.editor.isActive('italic'),
      canItalic: ctx.editor.can().chain().toggleItalic().run(),
      isUnserline: ctx.editor.isActive('underline'),
      canUnderLine: ctx.editor.can().chain().toggleUnderline().run(),
      isStrike: ctx.editor.isActive('strike'),
      canStrike: ctx.editor.can().chain().toggleStrike().run(),
      isCode: ctx.editor.isActive('code'),
      canCode: ctx.editor.can().chain().toggleCode().run(),
      isHeading2: ctx.editor.isActive('heading', { level: 2 }),
      isHeading3: ctx.editor.isActive('heading', { level: 3 }),
      isHeading4: ctx.editor.isActive('heading', { level: 4 }),
      isCodeBlock: ctx.editor.isActive('codeBlock'),
      isBlockquote: ctx.editor.isActive('blockquote'),
      fontSize: ctx.editor.getAttributes('textStyle')?.fontSize || '1rem',
    }),
  });
  const fontSizes = [
    { className: 'text-xs', size: '.75rem' },
    { className: 'text-sm', size: '.875rem' },
    { className: 'text-base', size: '1rem' },
    { className: 'text-lg', size: '1.125rem' },
    { className: 'text-xl', size: '1.25rem' },
    { className: 'text-2xl', size: '1.5rem' },
    { className: 'text-3xl', size: '1.875rem' },
  ];

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <MenuButton
        name="Bold"
        className="font-bold"
        disabled={!editorState.canBold}
        active={editorState.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <MenuButton
        name="Italic"
        className="italic"
        disabled={!editorState.canItalic}
        active={editorState.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <MenuButton
        name="Strike"
        className="line-through"
        disabled={!editorState.canStrike}
        active={editorState.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <MenuButton
        name="Underline"
        className="underline"
        disabled={!editorState.canUnderLine}
        active={editorState.isUnserline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <MenuButton
        name="H2"
        active={editorState.isHeading2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <MenuButton
        name="H3"
        active={editorState.isHeading3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <MenuButton
        name="H4"
        active={editorState.isHeading4}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      />
      <MenuButton
        name="Code block"
        active={editorState.isCodeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      <MenuButton
        name="Blockquote"
        active={editorState.isBlockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <MenuButton
        name="Link"
        active={editor.isActive('link')}
        onClick={() => {
          const url = prompt('Enter URL');
          if (url)
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: url })
              .run();
        }}
      />
      {fontSizes.map(({ className, size }) => (
        <MenuButton
          key={size}
          name={className.replace('text-', '')}
          className={className}
          active={editorState.fontSize === size}
          onClick={() => editor.chain().focus().setFontSize(size).run()}
        />
      ))}
    </div>
  );
}

export function Editor({
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: defaultValue || '',
  });

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      onChange(editor.getHTML());
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, onChange]);

  return (
    <div>
      {editor && (
        <div className="space-y-4 rounded-md border p-4">
          <MenuBar editor={editor} />
          <div className="text-center">
            <EditorContent editor={editor} />
          </div>
        </div>
      )}{' '}
    </div>
  );
}
