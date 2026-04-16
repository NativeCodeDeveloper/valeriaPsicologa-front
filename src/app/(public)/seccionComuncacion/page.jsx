'use client'
import CarruselOfertas from "@/Componentes/CarruselOfertas";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SeccionComuncacion() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [listaPublicaciones, setListaPublicaciones] = useState([]);

    async function listarPublicacionesCarrusel() {
        try {
            const res = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
                method: "GET",
                headers: { Accept: "application/json" },
                mode: "cors",
                cache: "no-cache"
            })

            if (!res.ok) {
                console.error("No se han podido listar publicaciones.");
                setListaPublicaciones([])
                return []
            } else {
                const publicaciones = await res.json();
                setListaPublicaciones(publicaciones);
                return publicaciones;
            }
        } catch (err) {
            console.error("Problema al consultar backend desde la vista frontend:" + err);
            setListaPublicaciones([]);
            return [];
        }
    }

    useEffect(() => {
        listarPublicacionesCarrusel();
    }, []);

    const carrusel = listaPublicaciones.map((publicacion) =>
        `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${publicacion.imagenPublicaciones_primera}/full`
    )

    return (
        <main className="bg-[#1c2b45] text-white">
            <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-24 md:px-10 md:pt-28">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c8647a]">
                    Comunidad Catarsis
                </p>
                <h1 className="mt-5 max-w-4xl text-4xl leading-tight text-white sm:text-5xl">
                    Contenidos y orientación para el bienestar emocional de la mujer.
                </h1>
                <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/62 sm:text-base">
                    Compartimos recursos prácticos, reflexiones y herramientas para acompañar tu proceso de crecimiento personal y bienestar emocional.
                </p>
            </section>

            <section className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-10 md:pb-24">
                <div className="border border-white/8 bg-[#1a2638] p-4 sm:p-6">
                    <CarruselOfertas
                        title=""
                        images={carrusel}
                        intervalMs={1800}
                    />

                    <div className="-mt-8 flex justify-center pb-4 sm:pb-6">
                        <Link
                            href="/catalogo"
                            className="border border-[#c8647a] bg-[#c8647a] px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#b55567] hover:border-[#b55567]"
                        >
                            Ver publicaciones
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
