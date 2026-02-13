import Image from "next/image";

interface SectionDividerProps {
  className?: string;
  width?: string;
}

export default function SectionDivider({
  className = "",
  width = "w-[50%] md:w-[40%]",
}: SectionDividerProps) {
  return (
    <div className={`flex justify-center py-8 md:py-12 ${className}`}>
      <Image
        src="/images/decorative/divider-botanical.svg"
        alt=""
        width={600}
        height={60}
        className={`${width} h-auto opacity-50`}
        aria-hidden="true"
      />
    </div>
  );
}
