"use client";

import Image from "next/image";
import Link from "next/link";

const beneficios = [
  "Atención online desde cualquier lugar de Chile",
  "Proceso terapéutico personalizado",
  "Enfoque sistémico y cognitivo-conductual",
  "Sesiones de 60 minutos con horarios flexibles",
  "Acompañamiento continuo y comprometido",
  "Seguimiento del proceso y evolución",
];

export default function UltraformerPage() {
  return (
    <main className="bg-[#1c2b45] text-white">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-24 md:px-10 md:pb-24 md:pt-28 lg:grid-cols-[1.15fr_1fr] lg:items-center xl:px-12 xl:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c8647a]">
            Proceso terapéutico
          </p>
          <h1 className="mt-5 text-4xl leading-tight sm:text-5xl">Psicoterapia con enfoque integral y personalizado</h1>
          <p className="mt-7 text-sm leading-relaxed text-white/70 sm:text-base">
            En Catarsis utilizamos un abordaje clínico estructurado para acompañar tu proceso desde la primera sesión, integrando herramientas sistémicas y cognitivo-conductuales.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
            Nuestro modelo busca facilitar el acceso a la salud mental, eliminar barreras geográficas y sostener un acompañamiento continuo desde la comodidad de tu espacio.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
            Cada proceso se adapta a tu historia y contexto para definir objetivos realistas y un camino terapéutico personalizado.
          </p>

          <Link
            href="/agendaProfesionales"
            className="mt-10 inline-flex border border-[#c8647a] bg-[#c8647a] px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#b55567] hover:border-[#b55567]"
          >
            Agendar sesión
          </Link>
        </div>

        <div className="relative aspect-6/5 overflow-hidden border border-white/10 bg-[#1a2638] shadow-[0_24px_70px_-38px_rgba(0,0,0,0.85)]">
          <Image
            src="/logocatarsisfull.png"
            alt="Psicoterapia Catarsis"
            fill
            className="h-full w-full object-contain object-center p-10"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#1c2b45]/40 to-transparent" />
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#1a2638]">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-24 xl:px-12">
          <h2 className="text-3xl leading-tight text-white sm:text-4xl">Beneficios clave</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {beneficios.map((item) => (
              <article
                key={item}
                className="border border-white/8 bg-[#1c2b45] px-5 py-4 text-sm text-white/70 transition hover:border-[#c8647a]/30"
              >
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
