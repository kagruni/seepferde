interface SectionDividerProps {
  className?: string;
}

export default function SectionDivider({ className = "" }: SectionDividerProps) {
  return (
    <div
      className={`w-full h-12 md:h-16 opacity-40 ${className}`}
      style={{
        backgroundImage: "url(/images/decorative/divider-botanical.svg)",
        backgroundRepeat: "repeat-x",
        backgroundPosition: "center",
        backgroundSize: "auto 100%",
      }}
      aria-hidden="true"
    />
  );
}
