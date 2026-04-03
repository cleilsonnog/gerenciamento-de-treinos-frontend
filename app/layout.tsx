import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ChatProvider } from "./_components/chat/chat-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TreinoIA",
    template: "%s | TreinoIA",
  },
  description:
    "Gerencie seus treinos com inteligência artificial. Crie planos personalizados, acompanhe sua evolução e mantenha consistência com o TreinoIA.",

  openGraph: {
    title: "TreinoIA",
    description:
      "Treinos inteligentes com IA. Evolua com consistência e acompanhamento personalizado.",
    url: "https://seu-dominio.com", // 🔥 troca depois
    siteName: "TreinoIA",
    images: [
      {
        url: "/og-image.png", // 🔥 vamos criar isso abaixo
        width: 1200,
        height: 630,
        alt: "TreinoIA - Plataforma de treinos com IA",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "TreinoIA",
    description:
      "Treinos inteligentes com IA. Evolua com consistência.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          {children}
          <ChatProvider />
        </NuqsAdapter>
      </body>
    </html>
  );
}
