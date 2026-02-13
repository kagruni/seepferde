import Image from "next/image";
import Link from "next/link";

interface CardProps {
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  description: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Card({
  imageSrc,
  imageAlt = "",
  title,
  description,
  href,
  children,
  className = "",
}: CardProps) {
  const content = (
    <div
      className={`group bg-white rounded-2xl shadow-sm border border-brown/12 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${className}`}
    >
      {imageSrc && (
        <div className="relative h-52 md:h-64 overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl md:text-2xl mb-2">{title}</h3>
        <p className="text-text-secondary leading-relaxed">{description}</p>
        {children}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}
