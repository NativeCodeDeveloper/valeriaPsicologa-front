'use client'
import {Suspense} from "react";
import {useSearchParams} from "next/navigation";

function ReservaHoraContent() {
    const searchParams = useSearchParams();
    const fechaInicio = searchParams.get('fecha') || '';
    const horaInicio = searchParams.get('hora') || '';

  return (
    <section className="relative min-h-[70vh] w-full px-4 py-10 flex items-center justify-center bg-[#1c2b45]">
      {/* Fondos decorativos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#c8647a]/8 blur-3xl" />
        <div className="absolute -bottom-40 right-[-80px] h-[380px] w-[380px] rounded-full bg-[#c8647a]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="border border-white/10 bg-[#1a2638] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">

          {/* Header */}
          <div className="flex items-start gap-4 p-7 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center border border-[#c8647a]/30 bg-[#c8647a]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#c8647a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="flex-1">
              <span className="inline-flex items-center border border-[#c8647a]/30 bg-[#c8647a]/10 px-3 py-1 text-xs font-semibold text-[#c8647a]">
                Reserva confirmada
              </span>

              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                ¡Felicidades!
              </h1>

              <p className="mt-2 text-white/70">
                Tu sesión con{" "}
                <span className="font-semibold text-white">
                  Catarsis · Valeria Díaz Psicóloga
                </span>{" "}
                ha sido reservada con éxito.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/10" />

          {/* Body */}
          <div className="p-7 sm:p-8">
            <div className="border border-white/10 bg-[#1c2b45] p-5">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c8647a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Servicio</p>
                    <p className="text-sm text-white/60">Sesión de psicoterapia online</p>
                  </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c8647a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M5 11h14M5 19h14M6 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Fecha y hora</p>
                    <p className="text-sm text-white/60">{fechaInicio} - {horaInicio}</p>
                  </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c8647a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Duración</p>
                    <p className="text-sm text-white/60">60 Minutos</p>
                  </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c8647a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Modalidad</p>
                    <p className="text-sm text-white/60">Sesión online por videollamada</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border border-white/10 bg-[#1c2b45] p-5">
              <p className="text-sm font-semibold text-white">
                ¡Tu sesión ha sido confirmada!
              </p>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                Recuerda conectarte puntualmente. Si necesitas cancelar o reagendar, hazlo con al menos 24 horas de anticipación. ¡Te esperamos!
              </p>
            </div>

            <div className="mt-7 flex flex-col items-center gap-3">
              <a
                href="/agendaProfesionales"
                className="inline-flex w-full max-w-xs items-center justify-center border border-[#c8647a] bg-[#c8647a] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#b55567] hover:border-[#b55567]"
              >
                Agendar otra sesión
              </a>

              <a
                href="/"
                className="text-sm font-semibold text-white/60 hover:text-white transition"
              >
                Volver al inicio
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default function ReservaHora() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center bg-[#1c2b45] text-white">Cargando...</div>}>
      <ReservaHoraContent />
    </Suspense>
  );
}
