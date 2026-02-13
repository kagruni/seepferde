import Image from "next/image";
import type { Horse } from "@/types";

export default function HorseProfile({ horse }: { horse: Horse }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-brown/12 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={horse.imageSrc}
          alt={horse.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl mb-1">{horse.name}</h3>
        <p className="text-sm text-gold font-semibold tracking-wide uppercase mb-3">
          {horse.breed} {horse.age && `· ${horse.age}`}
        </p>
        <p className="text-text-secondary leading-relaxed mb-3">
          {horse.character}
        </p>
        <div className="flex items-center gap-2 text-sm text-forest font-medium">
          <span className="w-2 h-2 bg-forest rounded-full" />
          {horse.role}
        </div>
      </div>
    </div>
  );
}
