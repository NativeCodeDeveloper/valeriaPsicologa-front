import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const footerLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Sobre mí", href: "/#sobre-mi" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Publicaciones", href: "/#publicaciones" },
  { label: "Contacto", href: "/contacto" },
];

const serviceHighlights = [
  "Psicoterapia Individual",
  "Acompañamiento en Duelo",
  "Terapia Sistémica y Relacional",
  "Manejo del Estrés",
  "Regulación Emocional",
];

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-[#131e2e] text-white">
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-16 pb-10 md:px-8 lg:px-10">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-12 lg:gap-8">

          {/* Branding */}
          <section className="lg:col-span-5">
            <img
              src="/logocatarsisfull.png"
              alt="Logo Catarsis"
              width={120}
              height={120}
              className="h-24 w-24 object-contain"
            />
            <h3 className="mt-5 max-w-md text-2xl font-bold leading-tight text-white">
              Catarsis · Valeria Díaz Psicóloga
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/58">
              Psicoterapia clínica online para mujeres. Un espacio de contención, crecimiento
              personal y fortalecimiento del bienestar emocional.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/agendaProfesionales"
                className="inline-flex items-center gap-2 border border-[#c8647a] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#c8647a] transition hover:bg-[#c8647a] hover:text-white"
              >
                Agendar sesión
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 border border-white/22 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/68 transition hover:border-white/40 hover:text-white"
              >
                Contacto
              </Link>
            </div>
          </section>

          {/* Navegación */}
          <section className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#c8647a]">Navegación</p>
            <nav aria-label="Links del pie de página" className="mt-4">
              <ul className="space-y-2.5">
                {footerLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/62 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {/* Servicios */}
          <section className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#c8647a]">Servicios</p>
            <ul className="mt-4 space-y-2">
              {serviceHighlights.map((item) => (
                <li key={item} className="text-sm text-white/62">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Contacto */}
          <section className="lg:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#c8647a]">Contacto</p>
            <div className="mt-4 space-y-3 text-sm text-white/62">
              <a
                href="tel:+56988861197"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#c8647a]" />
                +56 9 8886 1197
              </a>
              <a
                href="mailto:Valeria.d.pino@gmail.com"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#c8647a]" />
                Valeria.d.pino@gmail.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#c8647a]" />
                Atención online · Santiago, Chile
              </div>
            </div>

            <div className="mt-5 text-sm text-white/62">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">Horario</p>
              <p className="mt-1.5">Lunes a Viernes: 10:00 a 16:00</p>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://www.instagram.com/psic.valeriadiazpino"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Catarsis"
                className="inline-flex h-10 w-10 items-center justify-center border border-[#c8647a]/35 text-[#c8647a] transition hover:bg-[#c8647a]/10 hover:border-[#c8647a]/60"
              >
                {/* Instagram SVG — lucide-react deprecó el ícono de marca */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-[11px] text-white/38 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Catarsis · Valeria Díaz Psicóloga. Todos los derechos reservados.</p>
          <a
            href="https://nativecode.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="font-regular tracking-[0.14em] text-white/42 underline decoration-white/22 underline-offset-2 transition hover:text-white/62"
          >
            Desarrollado por nativecode.cl
          </a>
        </div>
      </div>
    </footer>
  );
}
