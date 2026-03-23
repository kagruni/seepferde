export default function Map({
  className = "",
  embedUrl,
  title = "Standort See-Pferde Zwenkau",
}: {
  className?: string;
  embedUrl: string;
  title?: string;
}) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-sm border border-brown/12 ${className}`}>
      <iframe
        title={title}
        src={embedUrl}
        width="100%"
        height="350"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
