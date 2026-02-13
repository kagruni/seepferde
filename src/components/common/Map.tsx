export default function Map({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-sm border border-brown/12 ${className}`}>
      <iframe
        title="Standort Reiterhof Mandy Kolatka"
        src="https://www.openstreetmap.org/export/embed.html?bbox=12.3246%2C51.2180%2C12.3346%2C51.2230&layer=mapnik&marker=51.2205%2C12.3296"
        width="100%"
        height="350"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
