import Image from "next/image";

interface SectionDividerProps {
  className?: string;
  variant?: "horse" | "ornament";
}

export default function SectionDivider({ className = "", variant = "horse" }: SectionDividerProps) {
  if (variant === "ornament") {
    return (
      <div className={`flex items-center justify-center gap-4 py-8 md:py-10 ${className}`} aria-hidden="true">
        <div className="flex-1 max-w-48 h-px bg-brown/30" />
        <Image
          src="/images/decorative/divider-ornament.svg"
          alt=""
          width={178}
          height={44}
          className="h-6 md:h-8 w-auto opacity-50"
        />
        <div className="flex-1 max-w-48 h-px bg-brown/30" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-4 py-8 md:py-10 ${className}`} aria-hidden="true">
      <div className="flex-1 max-w-64 h-px bg-brown/30" />
      <Image
        src="/images/decorative/divider-horse.png"
        alt=""
        width={232}
        height={172}
        className="h-14 md:h-20 w-auto opacity-60"
      />
      <div className="flex-1 max-w-64 h-px bg-brown/30" />
    </div>
  );
}
