import { useState } from "react";

const COPPER = "#B87851";

const appleEvents = [
  {
    id: "LX-2023-902",
    impacto: { label: "Apple", color: "#DC2626" },
    tag: "Regulatorio", tagClass: "bg-[#EFF6FF] text-[#1E40AF] border border-[#B87851]/10",
    date: "12 OCT, 2023",
    title: "Decreto presidencial regula modelos de negocio en plataformas digitales",
    nota: '"Impacto directo en App Store. Necesario evaluar respuesta técnica sobre las APIs de pago de terceros."',
  },
  {
    id: "LX-2023-884",
    impacto: { label: "Apple", color: "#F59E0B" },
    tag: "Privacidad", tagClass: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    date: "10 OCT, 2023",
    title: "INAI emite nuevos lineamientos sobre tratamiento de datos biométricos",
    nota: '"Validar compatibilidad con FaceID and protocolos de iCloud en México."',
  },
];

const rappiEvents = [
  {
    id: "LX-2023-950",
    impacto: { label: "Rappi", color: "#DC2626" },
    tag: "Laboral", tagClass: "bg-orange-50 text-orange-700 border border-orange-100",
    date: "15 OCT, 2023",
    title: "Propuesta de ley de seguridad social para repartidores de plataformas",
    nota: '"Reunión con cámara de comercio programada para el 20 de octubre."',
  },
];

function EventCard({ event }) {
  return (
    <article className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm flex gap-8 group">
      <div className="flex flex-col items-center min-w-[100px] border-r border-slate-100 pr-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Impacto</p>
        <span className="text-white text-[10px] font-bold px-3 py-1 rounded-full leading-none" style={{ backgroundColor: event.impacto.color, fontFamily: "'DM Sans', sans-serif" }}>
          {event.impacto.label}
        </span>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${event.tagClass}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {event.tag}
          </span>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <time className="text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{event.date}</time>
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          {event.title}
        </h3>
        <div className="pl-6 border-l-4 p-6 rounded-r-xl" style={{ borderColor: COPPER, backgroundColor: `${COPPER}0D` }}>
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
            Nota guardada
          </div>
          <p className="text-[14px] italic text-slate-700 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{event.nota}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end min-w-[160px]">
        <span className="text-[10px] font-mono font-bold text-slate-300">{event.id}</span>
        <div className="flex flex-col gap-3 w-full">
          <button className="w-full py-3 text-white text-[11px] font-bold rounded-full hover:opacity-90 transition-all shadow-md" style={{ backgroundColor: COPPER, fontFamily: "'DM Sans', sans-serif" }}>
            Ver evento →
          </button>
          <button className="w-full py-3 border border-slate-200 text-on-surface-variant text-[11px] font-bold rounded-full hover:bg-slate-50 transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Editar nota
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Grupo() {
  const [activeTab, setActiveTab] = useState("seguimiento");
  const [activeGroup, setActiveGroup] = useState("apple");

  const events = activeGroup === "apple" ? appleEvents : rappiEvents;

  return (
    <div className="flex min-h-[calc(100vh-0px)]">
      {/* Main content */}
      <div className="flex-1 p-10 overflow-y-auto bg-surface relative">

        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Grupo de interés setup
            </h1>
            <p className="text-sm text-on-surface-variant" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Configure los parámetros, estructura organizacional y temas clave para el monitoreo estratégico.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200/30 mb-8">
          {[["base", "Base"], ["seguimiento", "Seguimiento"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-2 py-4 text-sm transition-colors relative"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: activeTab === key ? 700 : 500,
                color: activeTab === key ? "#191c1e" : "#434655",
                borderBottom: activeTab === key ? `2px solid ${COPPER}` : "2px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Seguimiento tab */}
        {activeTab === "seguimiento" && (
          <>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-on-surface mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Seguimiento</h2>
              <p className="text-on-surface-variant text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Eventos marcados manualmente para monitoreo prioritario.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              {/* Período */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>PERÍODO DE SEGUIMIENTO</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold" style={{ color: COPPER, fontFamily: "'Playfair Display', serif" }}>Octubre 2023</span>
                    <div className="flex gap-1">
                      {["chevron_left", "chevron_right"].map(icon => (
                        <button key={icon} className="w-6 h-6 flex items-center justify-center rounded-lg border border-slate-200 hover:border-primary transition-colors">
                          <span className="material-symbols-outlined text-[16px] text-slate-400">{icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["L","M","M","J","V","S","D"].map((d, i) => (
                      <span key={i} className="text-[10px] font-bold text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{d}</span>
                    ))}
                    {[
                      { day: "9", active: false }, { day: "10", active: true },
                      { day: "11", active: false }, { day: "12", active: true },
                      { day: "13", active: false }, { day: "14", active: false },
                      { day: "15", active: true },
                    ].map(({ day, active }) => (
                      <span
                        key={day}
                        className="text-[11px] p-1.5 rounded-full"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: active ? COPPER : "#CBD5E1",
                          fontWeight: active ? 700 : 400,
                          backgroundColor: active ? `${COPPER}1A` : "transparent",
                          border: active ? `1px solid ${COPPER}33` : "none",
                        }}
                      >{day}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Composición de riesgo */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }} viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="none" r="14" stroke="#f8fafc" strokeWidth="3" />
                    <circle cx="18" cy="18" fill="none" r="14" stroke="#ba1a1a" strokeDasharray="40 100" strokeDashoffset="0" strokeWidth="3" />
                    <circle cx="18" cy="18" fill="none" r="14" stroke="#f59e0b" strokeDasharray="40 100" strokeDashoffset="-40" strokeWidth="3" />
                    <circle cx="18" cy="18" fill="none" r="14" stroke="#10b981" strokeDasharray="20 100" strokeDashoffset="-80" strokeWidth="3" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>RIESGO</span>
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>COMPOSICIÓN DE RIESGO</p>
                  <div className="space-y-2">
                    {[["#ba1a1a", "Alto", "2"], ["#f59e0b", "Medio", "2"], ["#10b981", "Bajo", "1"]].map(([color, label, count]) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-xs text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>TOTAL EN SEGUIMIENTO</p>
                <div className="w-8 h-0.5 mb-4" style={{ backgroundColor: COPPER }} />
                <p className="text-6xl font-bold text-on-surface leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {appleEvents.length + rappiEvents.length}
                </p>
              </div>
            </div>

            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  EVENTOS EN SEGUIMIENTO
                </h2>
                <div className="flex items-center gap-4">
                  {[["#ba1a1a", "Alto"], ["#f59e0b", "Medio"], ["#10b981", "Bajo"]].map(([color, label]) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-full border border-slate-200" style={{ backgroundColor: "#eceef0" }}>
                {[["apple", "Por grupo"], ["todos", "Todos"]].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveGroup(key === "todos" ? "todos" : "apple")}
                    className="px-5 py-1.5 rounded-full text-[11px] font-bold transition-all"
                    style={{
                      backgroundColor: (key === "apple" && activeGroup !== "todos") || (key === "todos" && activeGroup === "todos") ? "#fff" : "transparent",
                      color: (key === "apple" && activeGroup !== "todos") || (key === "todos" && activeGroup === "todos") ? COPPER : "#434655",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* Group pills */}
            {activeGroup !== "todos" && (
              <div className="flex gap-4 mb-6">
                {[["apple", "Apple", appleEvents.length], ["rappi", "Rappi", rappiEvents.length]].map(([key, label, count]) => (
                  <button
                    key={key}
                    onClick={() => setActiveGroup(key)}
                    className="flex items-center gap-4 p-4 rounded-full border transition-all"
                    style={{
                      backgroundColor: activeGroup === key ? `${COPPER}1A` : "#fff",
                      borderColor: activeGroup === key ? `${COPPER}33` : "#e2e8f0",
                    }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: activeGroup === key ? COPPER : "#F1F5F9", color: activeGroup === key ? "#fff" : "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>
                      {label.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold" style={{ color: activeGroup === key ? COPPER : "#374151", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
                      <p className="text-[11px]" style={{ color: activeGroup === key ? `${COPPER}B3` : "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>{count} eventos activos</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Event list */}
            <div className="space-y-6">
              {(activeGroup === "todos" ? [...appleEvents, ...rappiEvents] : events).map(ev => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </>
        )}

        {activeTab === "base" && (
          <div className="flex items-center justify-center h-64 text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <p>Contenido de la pestaña Base próximamente.</p>
          </div>
        )}
      </div>

      {/* Right panel */}
      <aside className="w-[280px] bg-white border-l border-slate-100 sticky top-0 h-screen overflow-y-auto shrink-0 relative">
        <div className="p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>GRUPOS DE INTERÉS</h3>
          <div className="space-y-4">
            {[
              { key: "apple", initials: "AP", label: "Apple", count: appleEvents.length },
              { key: "rappi", initials: "RA", label: "Rappi", count: rappiEvents.length },
            ].map(({ key, initials, label, count }) => {
              const isActive = activeGroup === key;
              return (
                <div
                  key={key}
                  onClick={() => setActiveGroup(key)}
                  className="p-4 rounded-full border cursor-pointer transition-all hover:translate-x-1 flex items-center gap-4"
                  style={{
                    backgroundColor: isActive ? `${COPPER}1A` : "#fff",
                    borderColor: isActive ? `${COPPER}33` : "#e2e8f0",
                  }}
                >
                  <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: isActive ? COPPER : "#F1F5F9", color: isActive ? "#fff" : "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: isActive ? COPPER : "#374151", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
                    <p className="text-[11px]" style={{ color: isActive ? `${COPPER}B3` : "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>{count} eventos activos</p>
                  </div>
                </div>
              );
            })}

            <button className="w-full mt-6 p-6 border-2 border-dashed border-slate-200 rounded-full flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-all group">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#B87851]/10 transition-colors">
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">add</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 group-hover:text-primary uppercase tracking-widest transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Configurar nuevo grupo
              </p>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
