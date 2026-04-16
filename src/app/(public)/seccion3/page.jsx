"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RevealOnScroll from "@/Componentes/RevealOnScroll";

const FALLBACK_CASE_IMAGE = "/Pub2.png";

export default function Seccion3() {
  const scrollerRef = useRef(null);
  const [imageErrors, setImageErrors] = useState({});
  const [listaPublicaciones, setListaPublicaciones] = useState([]);
  const API = process.env.NEXT_PUBLIC_API_URL || "https://bartelsmansalud.nativecode.cl";

  async function listarPublicacionesSeccion3() {
    try {
      const res = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        console.error("No se han podido listar publicaciones.");
        setListaPublicaciones([]);
        return [];
      }

      const publicaciones = await res.json();
      const activePublicaciones = Array.isArray(publicaciones)
        ? publicaciones.filter((item) => Number(item.estadoPublicacion ?? 1) === 1)
        : [];
      setListaPublicaciones(activePublicaciones);
      return activePublicaciones;
    } catch (err) {
      console.error("Problema al consultar backend desde la vista frontend:" + err);
      setListaPublicaciones([]);
      return [];
    }
  }

  useEffect(() => {
    listarPublicacionesSeccion3();
  }, []);

  const clinicalCases = listaPublicaciones.map((publicaciones, index) => ({
    id: publicaciones.id_publicaciones ?? `case-${index}`,
    title: publicaciones.descripcionPublicaciones || `Publicación ${index + 1}`,
    image: `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${publicaciones.imagenPublicaciones_primera}/full`,
  }));

  const content =
    clinicalCases.length > 0
      ? clinicalCases
      : [{ id: "fallback-case", title: "Publicación en proceso", image: FALLBACK_CASE_IMAGE }];

  const scrollByAmount = (direction) => {
    const container = scrollerRef.current;
    if (!container) return;

    const firstCardWidth = container.firstElementChild?.clientWidth ?? 0;
    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    const amount =
      firstCardWidth > 0 ? Math.round(firstCardWidth + gap) : Math.round(container.clientWidth * 0.82);
    const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth);

    if (direction === "right") {
      const nearEnd = container.scrollLeft >= maxLeft - 8;
      if (nearEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: amount, behavior: "smooth" });
      }
      return;
    }

    const nearStart = container.scrollLeft <= 8;
    if (nearStart) {
      container.scrollTo({ left: maxLeft, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -amount, behavior: "smooth" });
    }
  };

  return (
    <>
      <section id="publicaciones" className="scroll-mt-24 bg-[#1e2d42] py-24 text-white sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
          <RevealOnScroll>
            <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#c8647a]">Publicaciones</p>
                <h2 className="mt-4 max-w-3xl text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Recursos y reflexiones para tu bienestar emocional.
                </h2>
              </div>
              <div className="border border-[#c8647a]/25 bg-[#1a2638] p-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#c8647a]">
                  Psicoterapia online
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/62">
                  Atención exclusivamente online para mujeres de Santiago y todo Chile.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-8 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              aria-label="Desplazar resultados hacia la izquierda"
              className="inline-flex h-10 w-10 items-center justify-center border border-[#c8647a]/45 bg-transparent text-[#c8647a] transition hover:bg-[#c8647a]/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              aria-label="Desplazar resultados hacia la derecha"
              className="inline-flex h-10 w-10 items-center justify-center border border-[#c8647a]/45 bg-transparent text-[#c8647a] transition hover:bg-[#c8647a]/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
          >
            {content.map((item, index) => (
              <RevealOnScroll
                key={item.id}
                className="w-3/4 shrink-0 snap-start sm:w-1/2 lg:w-1/3"
                delayClass={index === 0 ? "delay-100" : "delay-150"}
              >
                <article className="flex h-full flex-col overflow-hidden border border-white/8 bg-[#1a2638] transition duration-300 hover:border-[#c8647a]/35">
                  <div className="relative aspect-2/3 overflow-hidden bg-[#1c2b45]">
                    <img
                      src={imageErrors[item.image] ? FALLBACK_CASE_IMAGE : item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-contain object-center"
                      onError={() =>
                        setImageErrors((current) => ({
                          ...current,
                          [item.image]: true,
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-center p-5">
                    <h3 className="text-center text-base font-semibold leading-snug text-white">
                      {item.title}
                    </h3>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Sección CTA Agenda */}
      <section id="agenda" className="scroll-mt-24 bg-[#1a2638] py-20 text-white sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
          <RevealOnScroll>
            <div
              className="relative overflow-hidden border border-[#c8647a]/20 px-6 py-16 text-center"
              style={{
                backgroundImage: "url('/logocatarsis.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 bg-[#1c2b45]/80" />
              <div className="relative">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#c8647a]">
                  Catarsis · Psicoterapia online
                </p>
                <h2 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-bold text-white sm:text-4xl">
                  Da el primer paso hacia tu bienestar emocional.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/68 sm:text-base">
                  Agenda tu primera sesión y comencemos juntas a construir el camino hacia
                  una vida más plena y consciente.
                </p>
                <Link
                  href="/agendaProfesionales"
                  aria-label="Reservar hora"
                  className="mt-8 inline-flex w-full max-w-xs justify-center border border-[#c8647a] bg-[#c8647a] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#b55567] hover:border-[#b55567]"
                >
                  Agendar primera sesión
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
