import "./globals.css";
import { AnimatedLayout } from "@/Componentes/AnimatedLayout";
import AgendaProvider from "@/ContextosGlobales/AgendaContext";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["500", "600", "700", "800"],
});

export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.catarsis.cl");

export const metadata = {
  title: {
    default: "Catarsis | Psicoterapia Online para Mujeres",
    template: "%s | Catarsis",
  },
  description:
    "Catarsis es un espacio de psicoterapia clínica online diseñado para el bienestar emocional de la mujer. Valeria Díaz Psicóloga — enfoque sistémico y cognitivo-conductual.",
  keywords: [
    "psicoterapia online",
    "psicóloga para mujeres",
    "terapia online Chile",
    "ansiedad y depresión",
    "terapia cognitivo conductual",
    "enfoque sistémico",
    "acompañamiento en duelo",
    "salud mental mujer",
    "psicóloga Santiago",
    "Valeria Díaz Psicóloga",
    "Catarsis psicología",
  ],
  authors: [{ name: "Valeria Díaz Psicóloga — Catarsis", url: metadataBase.href }],
  publisher: "Catarsis",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: metadataBase.href,
  },
  icons: {
    icon: "/logocatarsis.png",
    shortcut: "/logocatarsis.png",
    apple: "/logocatarsis.png",
  },
  openGraph: {
    title: "Catarsis | Psicoterapia Online para Mujeres",
    description:
      "Un espacio seguro de psicoterapia clínica online para mujeres. Acompañamiento en ansiedad, duelo, vínculos y bienestar emocional con Valeria Díaz Psicóloga.",
    url: metadataBase.href,
    siteName: "Catarsis",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/logocatarsisfull.png",
        width: 1200,
        height: 630,
        alt: "Catarsis — Psicoterapia Online para Mujeres",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catarsis | Psicoterapia Online para Mujeres",
    description:
      "Psicoterapia clínica online para mujeres. Valeria Díaz Psicóloga — enfoque sistémico y cognitivo-conductual.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-[#1c2b45]">
        <AnimatedLayout>
          <AgendaProvider>{children}</AgendaProvider>
        </AnimatedLayout>
      </body>
    </html>
  );
}
