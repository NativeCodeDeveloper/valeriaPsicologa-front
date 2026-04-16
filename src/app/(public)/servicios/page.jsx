"use client";

import Link from "next/link";

const servicios = [
  "Psicoterapia individual",
  "Acompañamiento en duelo",
  "Terapia sistémica y relacional",
  "Manejo del estrés y ansiedad",
  "Regulación emocional",
  "Terapia cognitivo-conductual",
];

export default function ServicioPage() {
  return (
    <main className="bg-[#1c2b45] text-white">
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-24 md:px-10 md:pb-24 md:pt-28 xl:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c8647a]">
          Servicios
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl leading-tight text-white sm:text-5xl">
          Psicoterapia clínica online para el bienestar emocional de la mujer.
        </h1>
        <p className="mt-7 max-w-3xl text-base leading-relaxed text-white/62">
          En Catarsis ofrecemos un acompañamiento terapéutico personalizado, con enfoque sistémico y cognitivo-conductual, para que puedas transformar tu vida desde adentro.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-7 px-6 pb-28 md:grid-cols-2 md:px-10 md:pb-32 xl:grid-cols-3 xl:px-12">
        {servicios.map((servicio, index) => (
          <article
            key={servicio}
            className="group flex h-full flex-col border border-white/8 bg-[#1a2638] p-7 transition duration-300 hover:border-[#c8647a]/40 hover:bg-[#1f2e4d]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c8647a]/80">
              Servicio {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 text-xl leading-snug text-white">{servicio}</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/58">
              Abordaje profesional basado en evidencia para resultados sostenibles en el tiempo, acompañando trayectorias de vida, no solo síntomas.
            </p>
          </article>
        ))}
      </section>

      <section className="border-t border-white/10 bg-[#1a2638]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center md:px-10 md:py-20 xl:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c8647a]">
              Siguiente paso
            </p>
            <h3 className="mt-4 text-3xl leading-tight text-white">
              Agenda una primera sesión y comienza tu proceso.
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/agendaProfesionales"
              className="inline-flex items-center border border-[#c8647a] bg-[#c8647a] px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#b55567] hover:border-[#b55567]"
            >
              Agendar sesión
            </Link>
            <a
              href="https://wa.me/56988861197"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center border border-white/25 px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:border-white/50 hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
