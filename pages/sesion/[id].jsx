import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

const COPPER = "#B87851";

const sesiones = {
  "1": {
    status: "En Progreso",
    statusBadge: (
      <span className="px-5 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2 border border-blue-100">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 animate-pulse" />
        En Progreso
      </span>
    ),
    org: "Camara de diputados",
    title: "Debate sobre Presupuesto Nacional 2025",
    date: "4 oct 2025",
    hour: "10:00 hrs",
    location: "Salón de Sesiones",
    hasPlayer: true,
    isLive: true,
    fileName: "Presupuesto_Nacional_2025_Final.mp4",
    duration: "2:00:45",
    elapsed: "01:20:15",
    hasAccordion: true,
    accordionBlocks: [
      { time: "12:00 - 12:10", status: "Completado", text: "El bloque inicial se centró en la apertura de la sesión y la validación del quórum reglamentario. Se presentaron las líneas generales del presupuesto 2025, destacando un incremento nominal del 4% respecto al ejercicio anterior." },
      { time: "12:10 - 12:20", status: "Completado", text: "Discusión sobre las partidas de educación y salud. Se debatieron los mecanismos de indexación para los salarios docentes y el mantenimiento de infraestructura hospitalaria en zonas rurales." },
      { time: "12:20 - 12:30", status: "Completado", text: "Presentación del plan de obras públicas. Se detallaron 15 proyectos estratégicos de transporte ferroviario y conectividad digital para el segundo semestre del 2025." },
      { time: "12:30 - 12:40", status: "Completado", text: "Ronda de preguntas y respuestas técnicas. Los diputados de la oposición solicitaron aclaraciones sobre el origen de los fondos para el fondo de estabilización energética." },
      { time: "12:40 - 12:50", status: "En curso", text: null },
    ],
    comision: "Igualdad de Género",
    comisionOrg: "H. Cámara de Diputados",
  },
  "2": {
    status: "Programada",
    statusBadge: (
      <span className="px-4 py-1.5 bg-orange-50 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2 border" style={{ color: COPPER, borderColor: `${COPPER}33` }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: COPPER }} />
        Programada
      </span>
    ),
    org: "Diputados",
    title: "A la decimoséptima reunión ordinaria de la Comisión de Igualdad de Género",
    date: "24 mar 2026",
    hour: "09:00 hrs",
    location: "Sala de Juntas, Edif. G",
    hasPlayer: false,
    hasAccordion: false,
    agenda: [
      "Registro de asistencia y declaración de quórum.",
      "Lectura, discusión y, en su caso, aprobación del orden del día.",
      "Lectura, discusión y, en su caso, aprobación del acta anterior.",
      "Dictamen reforma artículo 4 Ley INMUJERES.",
      "Dictamen reforma artículo 34 Ter Ley Acceso Mujeres Vida Libre Violencia.",
      "Tercer informe semestral Comisión Igualdad Género.",
      "Asuntos generales.",
      "Clausura.",
    ],
    signature: "Diputada Anaís Miriam Burgos Hernández",
    signatureRole: "Presidenta",
    comision: "Igualdad de Género",
    comisionOrg: "H. Cámara de Diputados",
  },
  "3": {
    status: "Concluida",
    statusBadge: (
      <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2 border border-emerald-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Concluida
      </span>
    ),
    org: "Camara de diputados",
    title: "Debate sobre Presupuesto Nacional 2025",
    date: "4 oct 2025",
    hour: "10:00 hrs",
    location: "Salón de Sesiones",
    hasPlayer: true,
    isLive: false,
    fileName: "Presupuesto_Nacional_2025_Final.mp4",
    duration: "2:00:45",
    elapsed: "01:20:15",
    remaining: "-40:30",
    hasAccordion: false,
    aiSummary: "El debate concluyó con un enfoque crítico en la reasignación de partidas para el ejercicio fiscal 2025. Los puntos clave de la deliberación incluyeron la revisión de partidas educativas, el plan de obras públicas y los mecanismos de financiamiento del fondo de estabilización energética.",
    comision: "Igualdad de Género",
    comisionOrg: "H. Cámara de Diputados",
  },
};

function AccordionSection({ blocks }) {
  const [activeBlock, setActiveBlock] = useState(0);

  return (
    <section className="pt-2">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${COPPER}1A` }}>
          <span className="material-symbols-outlined text-2xl" style={{ color: COPPER }}>auto_awesome</span>
        </div>
        <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Resumen por bloques con IA</h3>
      </div>
      <div className="space-y-4">
        {blocks.map((block, idx) => {
          const isActive = activeBlock === idx;
          const isInProgress = block.status === "En curso";
          return (
            <div
              key={idx}
              className="rounded-xl overflow-hidden transition-all duration-300"
              style={{
                border: isActive
                  ? `1px solid ${isInProgress ? "#E24B4A" : COPPER}`
                  : isInProgress
                  ? "1px dashed #E24B4A"
                  : "1px solid #e2e8f0",
              }}
            >
              <button
                className="w-full flex items-center justify-between p-5 transition-colors"
                style={{ backgroundColor: isActive && !isInProgress ? "#F5E6D8" : "#fff" }}
                onClick={() => setActiveBlock(idx)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>{block.time}</span>
                  {isInProgress ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full border border-red-100" style={{ color: "#E24B4A" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E24B4A] animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>En curso</span>
                    </div>
                  ) : (
                    <span className="px-3 py-1 bg-[#EAF3DE] text-[#3B6D11] text-[9px] font-bold rounded-full uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Completado</span>
                  )}
                </div>
                <span
                  className="material-symbols-outlined text-slate-400 transition-transform"
                  style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  expand_more
                </span>
              </button>
              {isActive && (
                <div
                  className="p-6 border-t"
                  style={{ borderColor: isInProgress ? "#FCA5A5" : `${COPPER}1A` }}
                >
                  {isInProgress ? (
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-4">
                      <div className="w-4 h-4 rounded-full border-2 border-[#E24B4A] border-t-transparent animate-spin" />
                      <p className="text-xs font-bold text-[#E24B4A] uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Generando resumen...</p>
                      <p className="text-xs text-slate-500 max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Nuestra IA está analizando los últimos 10 minutos de la sesión en tiempo real.</p>
                    </div>
                  ) : (
                    <p className="text-on-surface-variant leading-relaxed text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "#434655" }}>{block.text}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MediaPlayer({ session }) {
  return (
    <section className="rounded-lg p-8 relative overflow-hidden shadow-xl bg-slate-100 text-on-surface">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1 text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sesión en Vivo (Grabación)</p>
            <h3 className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{session.fileName}</h3>
          </div>
          <span className="text-sm font-mono px-3 py-1 rounded-md bg-slate-200">{session.duration}</span>
        </div>
        <div className="mb-8 group">
          <div className="w-full h-1.5 rounded-full cursor-pointer relative bg-slate-300">
            <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: "66.67%", backgroundColor: COPPER }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg group-hover:scale-125 transition-transform" style={{ left: "66.67%" }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-600">
            <span>{session.elapsed}</span>
            <span>{session.remaining || ""}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-10 relative">
          <button className="material-symbols-outlined text-3xl hover:text-slate-900 transition-colors text-slate-600">replay_10</button>
          <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-4xl text-slate-600" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </button>
          {session.isLive ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#dc2626] text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              EN VIVO
            </div>
          ) : (
            <button className="material-symbols-outlined text-3xl hover:text-slate-900 transition-colors text-slate-600">forward_10</button>
          )}
          <div className="absolute right-0 flex items-center gap-4">
            <span className="material-symbols-outlined text-2xl cursor-pointer hover:text-slate-900 transition-colors text-slate-600">volume_up</span>
            <span className="material-symbols-outlined text-2xl cursor-pointer hover:text-slate-900 transition-colors text-slate-600">fullscreen</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SesionDetalle() {
  const router = useRouter();
  const { id } = router.query;

  const s = sesiones[id];

  if (!s) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: "#f7f9fb" }}>
      {/* Back */}
      <div className="mb-8">
        <Link
          href="/echo"
          className="inline-flex items-center gap-2 px-6 py-2 bg-white text-sm font-bold rounded-full shadow-sm hover:-translate-y-0.5 transition-all border border-slate-100"
          style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver al calendario
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="col-span-8">
          <div
            className="bg-white rounded-lg p-10 space-y-10"
            style={{ boxShadow: "0 12px 32px rgba(184,120,81,0.08), 0 4px 8px rgba(184,120,81,0.04)" }}
          >
            {/* Header */}
            <section>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {s.org}
                </span>
                {s.statusBadge}
              </div>
              <h2 className="text-4xl font-bold text-on-surface leading-tight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                {s.title}
              </h2>
              <div className="grid grid-cols-3 gap-8 py-8 border-y border-slate-100">
                {[
                  { icon: "calendar_today", label: "Fecha", value: s.date },
                  { icon: "schedule", label: "Hora", value: s.hour },
                  { icon: "location_on", label: "Ubicación", value: s.location },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#f2f4f6] flex items-center justify-center" style={{ color: COPPER }}>
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
                      <p className="font-bold text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Media Player */}
            {s.hasPlayer && <MediaPlayer session={s} />}

            {/* Accordion (En Progreso) */}
            {s.hasAccordion && s.accordionBlocks && (
              <AccordionSection blocks={s.accordionBlocks} />
            )}

            {/* AI Summary (Concluida) */}
            {s.aiSummary && (
              <section className="pt-2">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${COPPER}1A` }}>
                      <span className="material-symbols-outlined text-2xl" style={{ color: COPPER }}>auto_awesome</span>
                    </div>
                    <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Resumen generado por IA</h3>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-full">
                    <button className="px-5 py-1.5 text-xs font-bold rounded-full bg-white shadow-sm" style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>Ejecutivo</button>
                    <button className="px-5 py-1.5 text-xs font-bold rounded-full text-slate-500 hover:text-primary transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Detallado</button>
                  </div>
                </div>
                <p className="text-on-surface-variant text-lg leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "#434655" }}>{s.aiSummary}</p>
              </section>
            )}

            {/* Agenda (Programada) */}
            {s.agenda && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${COPPER}1A` }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: COPPER }}>description</span>
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Orden del Día</h3>
                </div>
                <div className="space-y-2">
                  {s.agenda.map((item, i) => (
                    <div key={i} className="group flex gap-6 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                      <span className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: `${COPPER}66` }}>
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <p className="text-on-surface font-medium leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item}</p>
                    </div>
                  ))}
                </div>
                {s.signature && (
                  <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center text-center">
                    <p className="text-slate-400 italic mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Atentamente,</p>
                    <p className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{s.signature}</p>
                    <p className="text-xs font-bold uppercase tracking-[2px] mt-2" style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>{s.signatureRole}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <aside className="col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/echo" className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md hover:border-primary/20 transition-all flex flex-col items-center text-center gap-2">
              <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider" style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                ANTERIOR
              </div>
              <div className="text-xs font-bold text-on-surface leading-tight mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sesión previa</div>
              <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full w-fit mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>CONCLUIDA</span>
              </div>
            </Link>
            <Link href="/echo" className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md hover:border-primary/20 transition-all flex flex-col items-center text-center gap-2">
              <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider" style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>
                SIGUIENTE
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
              <div className="text-xs font-bold text-on-surface leading-tight mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Siguiente sesión</div>
              <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full w-fit mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-[9px] font-bold uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>PROGRAMADA</span>
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>COMISIÓN</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#f2f4f6] flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ color: COPPER }}>account_balance</span>
              </div>
              <div>
                <p className="font-bold text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.comision}</p>
                <p className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.comisionOrg}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
