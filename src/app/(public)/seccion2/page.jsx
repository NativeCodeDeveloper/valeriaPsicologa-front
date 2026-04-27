'use client'

import Link from "next/link";
import RevealOnScroll from "@/Componentes/RevealOnScroll";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Seccion2() {
  const API = process.env.NEXT_PUBLIC_API_URL || "https://bartelsmansalud.nativecode.cl";
  const [infoData, setInfoData] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [carouselApi, setCarouselApi] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackServices = [
    {
      id: "srv-1",
      name: "Psicoterapia Individual",
      description: "Tratamiento de ansiedad, depresión y estrés crónico con herramientas cognitivo-conductuales.",
      image: "/logo_transparent.png",
    },
    {
      id: "srv-2",
      name: "Acompañamiento en Duelo",
      description: "Intervención especializada para transitar pérdidas de seres queridos, rupturas y cambios de vida.",
      image: "/logo_transparent.png",
    },
    {
      id: "srv-3",
      name: "Terapia Sistémica y Relacional",
      description: "Análisis de vínculos familiares y relacionales para promover relaciones más sanas y conscientes.",
      image: "/logo_transparent.png",
    },
    {
      id: "srv-4",
      name: "Manejo del Estrés",
      description: "Técnicas prácticas para el manejo de la sobrecarga emocional, límites y fortalecimiento de la autoestima.",
      image: "/logo_transparent.png",
    },
  ];

  async function loadServices() {
    try {
      const mapTituloDetalle = (items) =>
        items.map((item, index) => ({
          id: `titulo-${item.id_publicacionesTituloDescripcion ?? index}`,
          name: (item.publicacionesTitulo || "").trim() || `Servicio ${index + 1}`,
          description:
            (item.publicacionesDescripcion || "").trim() ||
            "Acompañamiento profesional y empático para tu proceso terapéutico.",
          image: item.publicacionesTituloDescripcionImagen
            ? `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.publicacionesTituloDescripcionImagen}/card`
            : "/logo_transparent.png",
        }));

      const mapPublicaciones = (items) =>
        items.map((item, index) => ({
          id: `publicacion-${item.id_publicaciones ?? index}`,
          name: (item.descripcionPublicaciones || "").trim() || `Servicio ${index + 1}`,
          description:
            "Acompañamiento profesional y empático para tu proceso terapéutico.",
          image: item.imagenPublicaciones_primera
            ? `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.imagenPublicaciones_primera}/full`
            : "/logo_transparent.png",
        }));

      const resTitulo = await fetch(`${API}/publicacionesTituloDetalle/seleccionarPublicacionesTituloDetalle`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (resTitulo.ok) {
        const dataTitulo = await resTitulo.json();
        const activeTitulo = Array.isArray(dataTitulo)
          ? dataTitulo.filter((item) => Number(item.publicacionesTituloDescripcion_estado ?? 1) === 1)
          : [];

        if (activeTitulo.length > 0) {
          setInfoData(mapTituloDetalle(activeTitulo));
          return;
        }
      }

      const resPublicaciones = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!resPublicaciones.ok) {
        setInfoData([]);
        return toast.error(`No ha sido posible cargar los servicios. Contacte a soporte de NativeCode.`);
      }

      const dataPublicaciones = await resPublicaciones.json();
      const activePublicaciones = Array.isArray(dataPublicaciones)
        ? dataPublicaciones.filter((item) => Number(item.estadoPublicacion ?? 1) === 1)
        : [];
      setInfoData(mapPublicaciones(activePublicaciones));
    } catch {
      setInfoData([]);
      return toast.error(`No ha sido posible cargar los servicios. Contacte a soporte de NativeCode.`);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const content = infoData.length > 0 ? infoData : fallbackServices;

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || content.length <= 1) return;

    const intervalId = setInterval(() => {
      carouselApi.scrollNext();
    }, 5200);

    return () => clearInterval(intervalId);
  }, [carouselApi, content.length]);

  return (
    <section id="servicios" className="relative scroll-mt-24 bg-[#182038] py-24 text-white sm:py-32">
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="mb-14 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#c8647a]">Servicios</p>
              <h2 className="mt-4 max-w-3xl text-balance text-3xl font-bold text-white sm:text-4xl">
                Un espacio terapéutico diseñado para darte {" "}
                <span className="text-[#c8647a]">recursos tangibles y resultados medibles.</span>
              </h2>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mt-2">
          <div className="relative">
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {content.map((service) => (
                  <CarouselItem
                    key={service.id ?? service.name}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <Link
                      href="/agendaProfesionales"
                      aria-label={`Agendar para ${service.name}`}
                      className="group flex h-full flex-col overflow-hidden border border-white/8 bg-[#1a2638] transition duration-300 ease-out hover:border-[#c8647a]/40 hover:-translate-y-1"
                    >
                      <div className="relative h-72 overflow-hidden bg-[#1c2b45] sm:h-80 lg:h-96">
                        <img
                          src={imageErrors[service.id] ? "/logo_transparent.png" : service.image}
                          alt={service.name}
                          className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-[1.02]"
                          onError={() =>
                            setImageErrors((current) => ({
                              ...current,
                              [service.id]: true,
                            }))
                          }
                        />
                      </div>
                      <div className="border-t border-white/8 p-5">
                        <h3 className="text-lg font-semibold text-white">
                          {service.name}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/58">
                          {service.description || "Acompañamiento profesional y empático para tu proceso terapéutico."}
                        </p>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-2 top-1/2 z-20 -translate-y-1/2 border-white/20 bg-[#1c2b45] text-white/75 hover:bg-[#253367] disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-35" />
              <CarouselNext className="right-2 top-1/2 z-20 -translate-y-1/2 border-white/20 bg-[#1c2b45] text-white/75 hover:bg-[#253367] disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-35" />
            </Carousel>

            {content.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {content.map((item, index) => (
                  <button
                    key={item.id ?? item.name}
                    type="button"
                    aria-label={`Ir a servicio ${index + 1}`}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={[
                      "h-2 rounded-full transition-all duration-300",
                      currentIndex === index ? "w-7 bg-[#c8647a]" : "w-2 bg-white/25 hover:bg-white/45",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
