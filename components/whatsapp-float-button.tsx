"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WHATSAPP_NUMBER = "5522988516223";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre o TreinoIA.")}`;

export function WhatsappFloatButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
            aria-label="Contato via WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="h-7 w-7 fill-white"
            >
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958a15.9 15.9 0 0 0 8.832 2.672C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.35 22.616c-.392 1.106-2.286 2.116-3.178 2.19-.892.074-1.722.402-5.806-1.208-4.918-1.94-8.042-6.984-8.284-7.312-.244-.328-1.982-2.636-1.982-5.028s1.254-3.57 1.7-4.056c.444-.486.972-.608 1.296-.608.324 0 .648.002.932.016.298.016.7-.114 1.096.836.402.966 1.364 3.334 1.484 3.576.12.242.2.524.038.848-.16.328-.242.528-.484.814-.242.286-.51.638-.728.856-.242.244-.494.508-.212.996.282.49 1.254 2.07 2.692 3.352 1.85 1.648 3.41 2.158 3.892 2.4.484.242.766.202 1.046-.122.282-.324 1.204-1.406 1.526-1.89.32-.486.642-.404 1.084-.242.444.16 2.812 1.326 3.294 1.568.484.242.806.364.926.566.12.202.12 1.168-.272 2.274z" />
            </svg>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">Fale com o admin</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
