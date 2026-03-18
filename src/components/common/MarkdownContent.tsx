import ReactMarkdown from "react-markdown";

export default function MarkdownContent({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ children: content }) => (
            <p className="mb-4 last:mb-0">{content}</p>
          ),
          ul: ({ children: content }) => (
            <ul className="mb-4 list-disc space-y-2 pl-6 last:mb-0">{content}</ul>
          ),
          li: ({ children: content }) => <li>{content}</li>,
          strong: ({ children: content }) => (
            <strong className="font-semibold text-text">{content}</strong>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
