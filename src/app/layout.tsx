import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "@/context/AuthContext";

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Mentalmente – Promoviendo la Salud Mental",
  description: "Mentalmente es una plataforma dedicada a la salud mental.",
  metadataBase: new URL("https://www.mentalmente.com.co/"),
  openGraph: {
    title: "Mentalmente – Salud Mental en Español",
    description: "Información, soporte y recursos en salud mental para la comunidad hispanohablante.",
    url: "https://www.mentalmente.com.co/",
    siteName: "Mentalmente",
    images: [
      {
        url: "https://www.mentalmente.com.co/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mentalmente – Salud Mental",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentalmente – Salud Mental",
    description: "Desestigmatización y recursos en salud mental",
    images: ["https://www.mentalmente.com.co/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
      <AuthProvider>
        <ClientLayout>
          {children}
        </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}