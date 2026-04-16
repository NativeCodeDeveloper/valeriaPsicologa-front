import RevealOnScroll from "@/Componentes/RevealOnScroll";
import { HeartHandshake, BookOpen, Users } from "lucide-react";

const pillars = [
  {
    icon: HeartHandshake,
    title: "Calidez y rigor clínico",
    text: "Combinamos la calidez humana con un abordaje profesional basado en evidencia, para que tu proceso sea tanto empático como efectivo.",
  },
  {
    icon: BookOpen,
    title: "Herramientas basadas en evidencia",
    text: "Utilizamos Terapia Cognitivo-Conductual y herramientas sistémicas validadas científicamente para resultados sostenibles en el tiempo.",
  },
  {
    icon: Users,
    title: "Enfoque sistémico y relacional",
    text: "Te comprendemos en relación con tus entornos y roles, no de forma aislada, para abordar las raíces reales de tu malestar.",
  },
];

export default function Seccion1() {
  return (
    <section id="sobre-mi" className="scroll-mt-24 bg-[#1e2d42] py-24 text-white sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-[#c8647a] sm:text-4xl">
              Sobre <span className="text-[#c8647a]">Catarsis</span>
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-white/15" />
              <div className="h-0.5 w-10 bg-[#c8647a]" />
              <div className="h-px w-16 bg-white/15" />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/62 sm:text-base">
              Catarsis es un espacio de psicoterapia clínica diseñado para el bienestar emocional de
              la mujer. Bajo la dirección de Valeria Díaz Pino, psicóloga con enfoque sistémico y
              cognitivo-conductual, acompañamos trayectorias de vida, no solo síntomas.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 sm:grid-cols-3">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={item.title}>
                <article className="flex h-full flex-col items-center border border-white/8 bg-[#1a2638] p-8 text-center transition duration-300 hover:border-[#c8647a]/40 hover:bg-[#1f2e4d]">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center border border-[#c8647a]/30 bg-[#c8647a]/8">
                    <Icon className="h-9 w-9 text-[#c8647a]" strokeWidth={1.4} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/58">{item.text}</p>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
