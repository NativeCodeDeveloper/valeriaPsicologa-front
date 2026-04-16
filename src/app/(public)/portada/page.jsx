"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const fallbackSlides = [
  {
    id: "fallback-1",
    image: "/logocatarsis.png",
    alt: "Catarsis psicoterapia para mujeres",
    title: "Un espacio seguro para sanar y crecer.",
    text: "Psicoterapia clínica online diseñada exclusivamente para el bienestar emocional de la mujer.",
  },
  {
    id: "fallback-2",
    image: "/logocatarsis.png",
    alt: "Valeria Díaz Psicóloga",
    title: "Acompaño tu proceso con calidez y rigor profesional.",
    text: "Enfoque sistémico y cognitivo-conductual para mujeres que buscan transformar su vida.",
  },
];

export default function Portada() {
  const [dataPortada, setDataPortada] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const API = process.env.NEXT_PUBLIC_API_URL || "https://bartelsmansalud.nativecode.cl";

  async function cargarPortada() {
    try {
      const res = await fetch(`${API}/carruselPortada/seleccionarCarruselPortada`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        setDataPortada([]);
        return;
      }

      const data = await res.json();
      setDataPortada(Array.isArray(data) ? data : []);
    } catch {
      setDataPortada([]);
      toast.error("No se ha podido cargar portada, contacte al administrador del sistema.");
    }
  }

  useEffect(() => {
    cargarPortada();
  }, []);

  const backendSlides = dataPortada
    .filter((item) => Number(item.estadoPublicacionPortada ?? 1) === 1)
    .map((item, index) => ({
      id: `portada-${item.id_publicacionesPortada ?? index}`,
      image: item.imagenPortada
        ? `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.imagenPortada}/portada`
        : "/logocatarsis.png",
      alt: item.tituloPortadaCarrusel || "Catarsis psicoterapia",
      title: item.tituloPortadaCarrusel || "Un espacio seguro para sanar y crecer.",
      text: item.descripcionPublicacionesPortada || "Psicoterapia clínica online para mujeres.",
    }));

  const safeSlides = useMemo(
    () => (backendSlides.length > 0 ? backendSlides : fallbackSlides),
    [backendSlides]
  );

  useEffect(() => {
    if (safeSlides.length <= 1) return undefined;

    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeSlides.length);
    }, 5200);

    return () => clearInterval(intervalId);
  }, [safeSlides.length]);

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + safeSlides.length) % safeSlides.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % safeSlides.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current == null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;

    if (Math.abs(distance) > 45) {
      if (distance > 0) {
        goPrev();
      } else {
        goNext();
      }
    }

    touchStartX.current = null;
  };

  return (
    <section
      id="inicio"
      className="relative -mt-24 min-h-svh scroll-mt-24 overflow-hidden bg-[#1c2b45] md:-mt-24"
    >
      {/* Slides con overlay oscuro */}
      {safeSlides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={slide.id}
            className={[
              "absolute inset-0 transition-opacity duration-1000 ease-out",
              isActive ? "opacity-100" : "pointer-events-none opacity-0",
            ].join(" ")}
          >
            <img
              src={imageErrors[slide.id] ? "/fondoverde.png" : slide.image}
              alt={slide.alt}
              className="absolute inset-0 h-full w-full object-cover object-center"
              onError={() =>
                setImageErrors((current) => ({ ...current, [slide.id]: true }))
              }
            />
            <div className="absolute inset-0 bg-[#1c2b45]/70" />
          </div>
        );
      })}

      {/* Contenido centrado */}
      <div
        className="relative z-10 flex min-h-svh items-center justify-center px-5 text-center md:px-10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-3xl">
          <img
            src="/logocatarsisfull.png"
            alt="Logo Catarsis"
            width={240}
            height={240}
            className="mx-auto mb-8 block h-52 w-52 object-contain sm:h-64 sm:w-64"
          />
          <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {safeSlides[activeIndex]?.title ?? fallbackSlides[0].title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            {safeSlides[activeIndex]?.text ?? fallbackSlides[0].text}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/agendaProfesionales"
              aria-label="Agendar sesión"
              className="inline-flex w-full justify-center border border-[#c8647a] bg-[#c8647a] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#b55567] hover:border-[#b55567] sm:w-auto"
            >
              Agendar sesión
            </Link>
            <Link
              href="/#servicios"
              aria-label="Ver servicios"
              className="inline-flex w-full justify-center border border-white/30 px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 transition duration-300 hover:border-white/55 hover:text-white sm:w-auto"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </div>

      {/* Dots y botones de navegación */}
      <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-2">
          {safeSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Mostrar slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={[
                "h-2 rounded-full transition-all duration-300",
                activeIndex === index ? "w-8 bg-[#c8647a]" : "w-2 bg-white/35 hover:bg-white/55",
              ].join(" ")}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={goPrev}
            className="inline-flex h-9 w-9 items-center justify-center border border-white/25 bg-black/25 text-white transition hover:bg-black/45"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Siguiente slide"
            onClick={goNext}
            className="inline-flex h-9 w-9 items-center justify-center border border-white/25 bg-black/25 text-white transition hover:bg-black/45"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
