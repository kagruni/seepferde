import { Check } from "lucide-react";

interface PriceCardProps {
  title: string;
  price: string;
  unit: string;
  features: string[];
  highlighted?: boolean;
  className?: string;
}

export default function PriceCard({
  title,
  price,
  unit,
  features,
  highlighted = false,
  className = "",
}: PriceCardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm border border-brown/12 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
        highlighted ? "ring-2 ring-gold" : ""
      } ${className}`}
    >
      {highlighted && (
        <div className="h-1.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
      )}
      <div className="p-6 md:p-8">
        <h3 className="text-xl md:text-2xl mb-1">{title}</h3>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl md:text-4xl font-heading font-bold text-forest">
            {price}
          </span>
        </div>
        <p className="text-text-light text-sm mb-6">{unit}</p>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-forest shrink-0 mt-0.5" />
              <span className="text-text-secondary">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
