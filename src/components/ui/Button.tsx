import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-white shadow-md shadow-gold-dark/20 hover:bg-gold-dark border border-gold-dark/30",
  secondary:
    "bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-white",
  ghost:
    "text-forest underline underline-offset-4 hover:text-forest-dark border-none bg-transparent shadow-none",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-8 py-3 text-base",
  lg: "px-10 py-4 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-body font-semibold tracking-wide rounded-lg transition-all duration-300 cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
