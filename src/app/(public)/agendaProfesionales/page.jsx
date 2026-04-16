"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AgendaProfesionales() {
  const API = process.env.NEXT_PUBLIC_API_URL || "https://bartelsmansalud.nativecode.cl";
  const router = useRouter();
  const [listaProfesionales, setListaProfesionales] = useState([]);

  function irAgendaProfesional(id_profesional) {
    router.push(`/agendaEspecificaProfersional/${id_profesional}`);
  }

  async function seleccionarProfesionales() {
    try {
      const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      const dataProfesionales = await res.json();
      setListaProfesionales(dataProfesionales);
    } catch {
      return toast.error("No ha sido posible listar profesionales, contacte a soporte IT");
    }
  }

  useEffect(() => {
    seleccionarProfesionales();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1c2b45] px-4 py-24 text-white sm:px-6 sm:py-32 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(200,100,122,0.06),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(200,100,122,0.04),transparent_34%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="animate-reveal-up text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c8647a]">
            Agenda Catarsis
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Selecciona tu psicóloga
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/72">
            Selecciona una profesional para revisar disponibilidad y coordinar tu primera sesión online.
          </p>
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-white/15" />
            <div className="h-0.5 w-10 bg-[#c8647a]" />
            <div className="h-px w-16 bg-white/15" />
          </div>
        </div>

        <div className="animate-reveal-up-delay mt-16 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listaProfesionales.map((profesional, index) => (
            <button
              key={profesional.id_profesional}
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => irAgendaProfesional(profesional.id_profesional)}
              className="animate-reveal-up group relative flex min-h-[248px] w-full flex-col overflow-hidden border border-white/8 bg-[#1a2638] p-7 opacity-0 text-left transition-all duration-300 hover:border-[#c8647a]/40 hover:-translate-y-1 sm:p-8"
            >
              <div className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-[#c8647a]/80 to-[#c8647a]/30 transition-all duration-500 group-hover:w-full" />

              <div className="flex h-11 w-11 items-center justify-center border border-[#c8647a]/30 bg-[#c8647a]/8 text-base font-bold text-[#c8647a] transition-all duration-300 group-hover:border-[#c8647a]/55 group-hover:bg-[#c8647a]/15">
                {profesional.nombreProfesional?.charAt(0)}
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                {profesional.nombreProfesional}
              </h2>
              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-white/55">
                {profesional.descripcionProfesional}
              </p>

              <div className="mt-6 flex w-full items-center justify-between border-t border-white/8 pt-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c8647a]">
                  Ver agenda
                </span>
                <div className="flex h-7 w-7 items-center justify-center border border-[#c8647a]/30 bg-[#c8647a]/8 transition-all duration-300 group-hover:border-[#c8647a]/55 group-hover:bg-[#c8647a]/15">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-[#c8647a] transition-all duration-300 group-hover:translate-x-px"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
