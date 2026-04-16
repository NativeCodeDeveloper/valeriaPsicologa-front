"use client";

import Image from "next/image";
import Link from "next/link";

export default function MisionVisionPage() {
  return (
    <main className="bg-[#1c2b45] text-white">
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(200,100,122,0.08),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(200,100,122,0.05),transparent_42%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[1.1fr_1fr] lg:items-center xl:px-12 xl:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c8647a]">
              Catarsis
            </p>
            <h1 className="mt-5 text-4xl leading-tight text-white sm:text-5xl">Misión y visión</h1>
            <p className="mt-7 text-justify text-sm leading-relaxed text-white/70 sm:text-base">
              Nuestra misión es acompañar el bienestar emocional de la mujer a través de un espacio de psicoterapia clínica online seguro, cálido y profesional, promoviendo el autoconocimiento, la regulación emocional y el crecimiento personal.
            </p>
            <p className="mt-5 max-w-2xl text-justify text-sm leading-relaxed text-white/70 sm:text-base">
              Nuestra visión es consolidarnos como referente en psicoterapia online para mujeres en Chile, reconocidos por la calidad clínica, el enfoque humano y la capacidad de generar cambios profundos y sostenidos en la vida de nuestras consultantes.
            </p>

            <Link
              href="/agendaProfesionales"
              className="mt-10 inline-flex border border-[#c8647a] bg-[#c8647a] px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#b55567] hover:border-[#b55567]"
            >
              Agendar primera sesión
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#1a2638] shadow-[0_24px_70px_-38px_rgba(0,0,0,0.56)]">
            <Image
              src="/logocatarsisfull.png"
              alt="Misión y visión Catarsis"
              fill
              className="object-contain object-center p-10"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
