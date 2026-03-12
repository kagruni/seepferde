"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormModal from "@/components/ui/FormModal";

interface InquiryButtonProps {
  subject?: string;
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function InquiryButton({
  subject,
  label = "Angebot anfragen",
  variant = "primary",
  size = "md",
  className,
}: InquiryButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        preselectedSubject={subject}
      />
    </>
  );
}
