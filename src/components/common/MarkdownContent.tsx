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
          h2: ({ children: content }) => (
            <h2 className="mt-10 mb-4 text-2xl font-heading font-semibold text-text first:mt-0">
              {content}
            </h2>
          ),
          h3: ({ children: content }) => (
            <h3 className="mt-7 mb-3 text-xl font-heading font-semibold text-text">
              {content}
            </h3>
          ),
          p: ({ children: content }) => (
            <p className="mb-4 leading-relaxed last:mb-0">{content}</p>
          ),
          ul: ({ children: content }) => (
            <ul className="mb-4 list-disc space-y-2 pl-6 last:mb-0">{content}</ul>
          ),
          ol: ({ children: content }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-6 last:mb-0">{content}</ol>
          ),
          li: ({ children: content }) => <li>{content}</li>,
          a: ({ href, children: content }) => {
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                className="font-medium text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
                rel={external ? "noreferrer" : undefined}
                target={external ? "_blank" : undefined}
              >
                {content}
              </a>
            );
          },
          blockquote: ({ children: content }) => (
            <blockquote className="my-6 border-l-4 border-gold bg-beige/60 px-5 py-4 italic text-text-secondary">
              {content}
            </blockquote>
          ),
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
