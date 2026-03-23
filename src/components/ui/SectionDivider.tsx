interface SectionDividerProps {
  className?: string;
  variant?: "horse" | "ornament";
}

export default function SectionDivider({ className = "", variant = "horse" }: SectionDividerProps) {
  if (variant === "ornament") {
    return (
      <div className={`flex items-center justify-center gap-4 py-8 md:py-10 ${className}`} aria-hidden="true">
        <div className="flex-1 max-w-48 h-px bg-brown/30" />
        <img
          src="/images/decorative/divider-ornament.svg"
          alt=""
          className="h-6 md:h-8 w-auto opacity-50"
          loading="lazy"
        />
        <div className="flex-1 max-w-48 h-px bg-brown/30" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-4 py-8 md:py-10 ${className}`} aria-hidden="true">
      <div className="flex-1 max-w-64 h-px bg-brown/30" />
      <img
        src="/images/decorative/divider-horse.png"
        alt=""
        className="h-14 md:h-20 w-auto opacity-60"
        loading="lazy"
      />
      <div className="flex-1 max-w-64 h-px bg-brown/30" />
    </div>
  );
}
