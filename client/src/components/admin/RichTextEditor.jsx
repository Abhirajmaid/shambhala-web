'use client';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { Button } from '@/components/ui/button';

export function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: value || '<p>Start writing...</p>',
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => onChange?.(currentEditor.getJSON()),
  });

  if (!editor) return null;

  return (
    <div className="rounded-xl border bg-white">
      <div className="flex flex-wrap gap-2 border-b p-2">
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBold().run()}>Bold</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBulletList().run()}>List</Button>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 [&_.ProseMirror]:min-h-64 [&_.ProseMirror]:outline-none" />
    </div>
  );
}
