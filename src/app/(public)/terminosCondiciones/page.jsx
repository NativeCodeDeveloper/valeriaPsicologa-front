const sections = [
  {
    title: "1. Identificación del prestador",
    body: [
      "Catarsis presta servicios de psicoterapia clínica online para el bienestar emocional de la mujer, bajo la dirección de Valeria Díaz Pino, Psicóloga.",
      "Canales oficiales de contacto: Valeria.d.pino@gmail.com, WhatsApp +56 9 8886 1197, Instagram @psic.valeriadiazpino y sitio web www.catarsis.cl.",
    ],
  },
  {
    title: "2. Alcance de los servicios",
    body: [
      "Nuestros servicios incluyen psicoterapia individual, acompañamiento en duelo, terapia sistémica y relacional, manejo del estrés y ansiedad, regulación emocional y terapia cognitivo-conductual.",
      "Cada proceso terapéutico se adapta a las necesidades, historia y contexto de cada consultante.",
    ],
  },
  {
    title: "3. Reserva, cambios y asistencia",
    body: [
      "Las reservas y coordinaciones se gestionan a través de los canales oficiales y según disponibilidad profesional.",
      "Para reagendar o cancelar una sesión solicitamos aviso con al menos 24 horas de anticipación.",
      "La continuidad del proceso terapéutico depende de la asistencia regular y el compromiso de la consultante.",
    ],
  },
  {
    title: "4. Modalidad de atención",
    body: [
      "Catarsis ofrece atención exclusivamente online mediante videollamada, facilitando el acceso desde cualquier lugar del país.",
      "El objetivo es brindar un espacio seguro, contenido y profesional para el proceso terapéutico de cada mujer.",
    ],
  },
  {
    title: "5. Evaluación y plan personalizado",
    body: [
      "Al inicio del proceso se realiza una primera sesión de evaluación para definir objetivos, enfoque y frecuencia de trabajo.",
      "Los avances pueden variar según las condiciones individuales, la adherencia al proceso y el contexto personal de cada consultante.",
    ],
  },
  {
    title: "6. Pagos y comprobantes",
    body: [
      "Los valores y modalidades de pago vigentes se informan al momento de coordinar cada sesión.",
      "Los comprobantes correspondientes se emiten conforme a la normativa tributaria chilena aplicable.",
    ],
  },
  {
    title: "7. Privacidad y datos personales",
    body: [
      "Los datos de las consultantes se utilizan exclusivamente para la coordinación y seguimiento del proceso terapéutico, y para el cumplimiento de obligaciones legales.",
      "Catarsis adopta medidas razonables de confidencialidad y resguardo conforme a la normativa vigente en Chile.",
      "Puedes solicitar actualización o eliminación de tus datos contactando a Valeria.d.pino@gmail.com.",
    ],
  },
  {
    title: "8. Propiedad intelectual",
    body: [
      "Los contenidos del sitio, incluyendo textos, imágenes e identidad visual, son de uso exclusivo de Catarsis o sus titulares.",
      "No está permitido copiar, reproducir o distribuir contenido sin autorización previa y por escrito.",
    ],
  },
  {
    title: "9. Modificaciones y vigencia",
    body: [
      "Catarsis puede actualizar estos términos para reflejar cambios operativos, legales o de servicio.",
      "La versión publicada en esta página es la vigente y reemplaza versiones anteriores.",
    ],
  },
  {
    title: "10. Legislación aplicable",
    body: [
      "Estos términos se interpretan conforme a las leyes de la República de Chile.",
      "Cualquier controversia será conocida por los tribunales competentes en Chile.",
    ],
  },
];

export default function TerminosYCondiciones() {
  return (
    <main className="bg-[#1c2b45] text-white">
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(200,100,122,0.08),transparent_34%),radial-gradient(circle_at_90%_2%,rgba(200,100,122,0.05),transparent_40%)]" />

        <div className="relative mx-auto w-full max-w-5xl px-6 md:px-10 xl:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c8647a]">
            Catarsis
          </p>
          <h1 className="mt-4 text-4xl leading-tight text-white sm:text-5xl">
            Términos y Condiciones
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/62 sm:text-base">
            Documento informativo sobre el uso del sitio, coordinación de sesiones de psicoterapia online y condiciones generales de atención.
            Última actualización: abril de 2026.
          </p>

          <div className="mt-10 space-y-5">
            {sections.map((section) => (
              <article
                key={section.title}
                className="border border-white/8 bg-[#1a2638] p-6 sm:p-7"
              >
                <h2 className="text-lg font-medium text-white sm:text-xl">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-white/62 sm:text-[15px]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
