/* eslint-disable @next/next/no-img-element */

function renderNode(node, index = 0) {
  if (!node) return null;
  const children = node.content?.map((child, childIndex) => renderNode(child, childIndex));
  if (node.type === 'text') return node.text;
  if (node.type === 'paragraph') return <p key={index}>{children}</p>;
  if (node.type === 'heading') { const Tag = 'h' + (node.attrs?.level || 2); return <Tag key={index}>{children}</Tag>; }
  if (node.type === 'bulletList') return <ul key={index}>{children}</ul>;
  if (node.type === 'orderedList') return <ol key={index}>{children}</ol>;
  if (node.type === 'listItem') return <li key={index}>{children}</li>;
  if (node.type === 'image') return <img key={index} src={node.attrs?.src} alt={node.attrs?.alt || ''} />;
  return <div key={index}>{children}</div>;
}

export function TiptapRenderer({ content }) {
  if (!content?.content) return <p>Content will appear here once published from the CMS.</p>;
  return <article className="prose max-w-none">{content.content.map(renderNode)}</article>;
}
