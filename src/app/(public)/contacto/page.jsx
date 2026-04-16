"use client";

import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle } from "lucide-react";

const contactCards = [
  {
    title: "Modalidad",
    value: "Atención online · Santiago, Chile",
    href: null,
    icon: MapPin,
  },
  {
    title: "WhatsApp",
    value: "+56 9 8886 1197",
    href: "https://wa.me/56988861197",
    icon: MessageCircle,
  },
  {
    title: "Email",
    value: "Valeria.d.pino@gmail.com",
    href: "mailto:Valeria.d.pino@gmail.com",
    icon: Mail,
  },
  {
    title: "Instagram",
    value: "@psic.valeriadiazpino",
    href: "https://www.instagram.com/psic.valeriadiazpino",
    icon: null,
  },
];

export default function ContactoPage() {
  return (
    <main className="bg-[#1c2b45] text-white">
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(200,100,122,0.08),transparent_34%),radial-gradient(circle_at_88%_2%,rgba(200,100,122,0.05),transparent_42%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-6 md:px-10 lg:grid-cols-[1fr_1.05fr] xl:px-12 xl:gap-12">

          {/* Panel izquierdo — info de contacto */}
          <aside className="border border-[#c8647a]/25 bg-[#1a2638] p-7 md:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c8647a]">
              Contacto
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Psicoterapia clínica online para mujeres.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/68 sm:text-base">
              Un espacio seguro de contención y crecimiento personal. Si tienes dudas o quieres comenzar
              tu proceso, escríbeme directamente.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {contactCards.map((item) => {
                const Icon = item.icon;

                const content = (
                  <>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center border border-[#c8647a]/30 bg-[#c8647a]/8 text-[#c8647a]">
                      {Icon ? (
                        <Icon className="h-5 w-5" />
                      ) : (
                        /* Instagram SVG — lucide deprecó el ícono de marca */
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      {item.title}
                    </p>
                    <p
                      className={[
                        "mt-1.5 text-sm font-medium leading-relaxed text-white/90",
                        item.title === "Email" ? "break-all" : "break-words",
                      ].join(" ")}
                    >
                      {item.value}
                    </p>
                  </>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className="border border-white/8 bg-[#1c2b45] p-5 transition hover:border-[#c8647a]/30 hover:-translate-y-0.5"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <article key={item.title} className="border border-white/8 bg-[#1c2b45] p-5">
                    {content}
                  </article>
                );
              })}
            </div>

            <div className="mt-5 border border-white/8 bg-[#1c2b45] p-5">
              <div className="flex items-center gap-2 text-[#c8647a]">
                <Clock3 className="h-4 w-4 shrink-0" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Horario de atención
                </p>
              </div>
              <div className="mt-3 space-y-1 text-sm text-white/72">
                <p>Lunes a Viernes: 10:00 a 16:00</p>
                <p className="text-white/45 text-xs">Disponibilidad sujeta a agenda</p>
              </div>
            </div>
          </aside>

          {/* Panel derecho — canales + CTA */}
          <div className="border border-[#c8647a]/25 bg-[#1a2638] p-7 md:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c8647a]">
              ¿Cómo contactarme?
            </p>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">
              Escríbeme directamente y coordinaremos tu primera sesión.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/68">
              No utilizo formulario de contacto. Para agendar o resolver dudas, contáctame
              directamente por WhatsApp, correo o Instagram.
            </p>

            <div className="mt-8 grid gap-3">
              <a
                href="https://wa.me/56988861197"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center border border-[#c8647a] bg-[#c8647a] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#b55567] hover:border-[#b55567]"
              >
                Escribir por WhatsApp
              </a>

              <a
                href="mailto:Valeria.d.pino@gmail.com"
                className="inline-flex items-center justify-center border border-white/20 px-7 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Enviar correo
              </a>

              <a
                href="https://www.instagram.com/psic.valeriadiazpino"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center border border-white/20 px-7 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Ir a Instagram
              </a>
            </div>

            <div className="mt-8 border border-white/8 bg-[#1c2b45] p-5 text-sm text-white/68">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Psicoterapia online
              </p>
              <p className="mt-2">
                Atención exclusivamente online para mujeres de todo Chile. Sin traslados, desde la
                comodidad de tu hogar.
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/agendaProfesionales"
                className="inline-flex border border-[#c8647a] px-7 py-3 text-sm font-semibold text-[#c8647a] transition hover:bg-[#c8647a] hover:text-white"
              >
                Agendar primera sesión
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
