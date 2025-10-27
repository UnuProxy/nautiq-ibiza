"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className="group border border-[#E5E7EB] rounded-lg p-5 hover:border-[#2095AE] transition-colors"
      open={open}
      onClick={() => setOpen(!open)}
    >
      <summary className="flex items-center justify-between cursor-pointer">
        <h3 className="text-lg font-medium text-[#0B1120]">{question}</h3>
        <ChevronDown className="w-5 h-5 text-[#2095AE] transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-4 text-[#475569] leading-relaxed">{answer}</p>
    </details>
  );
}