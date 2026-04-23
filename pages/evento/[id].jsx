import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

const COPPER = "#B87851";

const eventos = {
  "1": {
    date: "24 de febrero de 2026",
    readTime: "4 min lectura",
    title: "Iniciativa del Ejecutivo federal con proyecto de decreto por el que se reforman y adicionan diversas disposiciones de la Ley Federal del Trabajo y de la Ley Federal del Derecho de Autor, en materia de derechos de las personas trabajadoras artistas intérpretes o ejecutantes",
    impacto: [
      { label: "Apple", color: "#E24B4A" },
      { label: "Rappi", color: "#F59E0B" },
    ],
    keyPoints: [
      "Proteger derechos de artistas intérpretes y ejecutantes.",
      "Regular uso de Inteligencia Artificial en creaciones artísticas.",
      "Reformar contratos publicitarios para garantizar remuneración justa.",
      "Fortalecer mecanismos alternativos de solución de controversias.",
      "Salvaguardar imagen y voz de artistas frente al uso no autorizado de IA.",
    ],
    keyPointsLabel: "Puntos Clave del Dictamen",
    temas: ["Inteligencia Artificial", "Derechos de autor", "Artistas", "Ley Federal del Trabajo"],
    fuente: "Gaceta Parlamentaria",
    nivel: "Federal",
    aiSummary: "Esta iniciativa propone reformas y adiciones a la Ley Federal del Trabajo y la Ley Federal del Derecho de Autor, con el fin de proteger los derechos de las personas trabajadoras artistas intérpretes o ejecutantes. Busca salvaguardar su imagen, voz e interpretaciones artísticas, especialmente ante el uso no autorizado por tecnologías emergentes. Un aspecto central es establecer límites claros para el uso de herramientas tecnológicas, como la Inteligencia Artificial, que simulen o repliquen la voz y las interpretaciones artísticas. Se prohíbe la reproducción sin consentimiento expreso, informado y remunerado, protegiendo las fuentes de empleo y la identidad cultural de los artistas.",
    actores: [
      { initials: "EJE", bg: "bg-orange-50", text: "text-orange-800", name: "Ejecutivo Federal", role: "PODER EJECUTIVO" },
      { initials: "IND", bg: "bg-slate-50", text: "text-slate-700", name: "INDAUTOR", role: "ÓRGANO DESCONCENTRADO" },
      { initials: "STPS", bg: "bg-blue-50", text: "text-blue-800", name: "STPS", role: "EJECUTIVO FEDERAL" },
    ],
  },
  "2": {
    date: "24 de febrero de 2026",
    readTime: "3 min lectura",
    title: "Iniciativa que reforma la fracción II del artículo 53 y la fracción III del artículo 76 Bis de la Ley Federal de Protección al Consumidor, en materia de garantía de asistencia humana en mecanismos de atención al consumidor en el comercio electrónico",
    impacto: [
      { label: "Rappi", color: "#E24B4A" },
      { label: "Apple", color: "#E24B4A" },
    ],
    keyPoints: [
      "Asistencia humana obligatoria en atención al consumidor de e-commerce.",
      "Decisiones complejas o irreversibles deben ser gestionadas por operador humano.",
      "Prohíbe que sistemas automatizados bloqueen resolución de quejas.",
      "Obliga a proveedores a garantizar contacto efectivo con operador humano.",
      "Aplica a cancelaciones de contratos y cambios esenciales de servicios.",
    ],
    keyPointsLabel: "Puntos Clave de la Iniciativa",
    temas: ["Protección al consumidor", "E-commerce", "Automatización", "PROFECO"],
    fuente: "Gaceta Parlamentaria",
    nivel: "Federal",
    aiSummary: "Esta iniciativa reforma la Ley Federal de Protección al Consumidor para garantizar mecanismos de asistencia humana en la atención al consumidor en el comercio electrónico. Obliga a los proveedores a asegurar que decisiones complejas o irreversibles, como cancelaciones de contratos o cambios esenciales de servicios, sean gestionadas por un operador humano. El propósito es evitar que los sistemas automatizados se conviertan en obstáculos y asegurar una resolución efectiva de las quejas de los consumidores en entornos digitales.",
    actores: [
      { initials: "DIP", bg: "bg-blue-50", text: "text-blue-800", name: "Cámara de Diputados", role: "PODER LEGISLATIVO" },
      { initials: "PRO", bg: "bg-slate-50", text: "text-slate-700", name: "PROFECO", role: "ÓRGANO DESCONCENTRADO" },
      { initials: "SE", bg: "bg-orange-50", text: "text-orange-800", name: "Secretaría de Economía", role: "EJECUTIVO FEDERAL" },
    ],
  },
  "3": {
    date: "24 de febrero de 2026",
    readTime: "3 min lectura",
    title: "Iniciativa que adiciona un artículo 101 Bis 4 a la Ley General de los Derechos de Niñas, Niños y Adolescentes, en materia de prevención de adicciones digitales",
    impacto: [
      { label: "Apple", color: "#E24B4A" },
      { label: "Rappi", color: "#F59E0B" },
    ],
    keyPoints: [
      "Adiciona artículo 101 Bis 4 a la Ley General de Derechos de Niñas, Niños y Adolescentes.",
      "Establece Estrategia Nacional para Prevención de Adicciones Digitales.",
      "Incluye campañas de concientización y protocolos de salud mental.",
      "Obliga a reglamentar verificación de edad y control parental digital.",
      "Considera límites de tiempo y suspensión nocturna de notificaciones.",
    ],
    keyPointsLabel: "Puntos Clave de la Iniciativa",
    temas: ["Protección de menores", "Regulación digital", "Salud mental", "Control parental"],
    fuente: "Gaceta Parlamentaria",
    nivel: "Federal",
    aiSummary: "Esta iniciativa establece la obligación del Estado de diseñar e implementar una Estrategia Nacional para la Prevención de Adicciones Digitales en niñas, niños y adolescentes. Considera campañas de información, concientización y protocolos de detección temprana y atención a la salud mental. Obliga al IFT y a la Secretaría de Salud a emitir reglamentación sobre verificación de edad, control parental, límites de tiempo de uso y suspensión nocturna de notificaciones para menores.",
    actores: [
      { initials: "DIP", bg: "bg-blue-50", text: "text-blue-800", name: "Cámara de Diputados", role: "PODER LEGISLATIVO" },
      { initials: "IFT", bg: "bg-slate-50", text: "text-slate-700", name: "IFT", role: "ÓRGANO AUTÓNOMO" },
      { initials: "SS", bg: "bg-orange-50", text: "text-orange-800", name: "Secretaría de Salud", role: "EJECUTIVO FEDERAL" },
    ],
  },
};

export default function EventoDetalle() {
  const router = useRouter();
  const { id } = router.query;
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);

  const ev = eventos[id];
  const ids = Object.keys(eventos);
  const numId = parseInt(id);
  const prevId = numId > 1 ? String(numId - 1) : null;
  const nextId = numId < ids.length ? String(numId + 1) : null;
  const prevEv = prevId ? eventos[prevId] : null;
  const nextEv = nextId ? eventos[nextId] : null;

  if (!ev) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cargando...</p>
      </div>
    );
  }

  const saveNote = () => {
    if (!note.trim() || !selectedGroup) return;
    setSavedNote({ group: selectedGroup, text: note });
    setNote("");
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  return (
    <div className="p-8 pb-16 min-h-screen" style={{ backgroundColor: "#f7f9fb" }}>
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Left Column */}
        <section className="w-[65%] space-y-8">
          <Link href="/lens" className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Regresar al inicio
          </Link>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 tracking-tight">{ev.date}</span>
              <span className="flex items-center gap-1 text-slate-400 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span className="material-symbols-outlined text-sm">schedule</span>
                {ev.readTime}
              </span>
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {ev.title}
            </h2>
            <div className="flex items-center gap-6 pt-4">
              <div className="inline-flex flex-col gap-[14px] bg-white border border-slate-100 rounded-xl p-4" style={{ boxShadow: "0 12px 32px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.02)" }}>
                <p className="text-[10px] font-bold uppercase text-slate-400 text-center tracking-[0.15em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Impacto</p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1.5 min-w-[140px]">
                    <div className="flex gap-[3px] h-[6px]">
                      <div className="flex-1 bg-[#16A34A] rounded-[3px]" />
                      <div className="flex-1 bg-[#EF9F27] rounded-[3px]" />
                      <div className="flex-1 bg-[#E24B4A] rounded-[3px]" />
                    </div>
                    <div className="flex justify-between items-center px-0.5">
                      <span className="text-[10px] font-semibold text-[#16A34A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Bajo</span>
                      <span className="text-[10px] font-semibold text-[#EF9F27]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Medio</span>
                      <span className="text-[10px] font-semibold text-[#E24B4A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Alto</span>
                    </div>
                  </div>
                  <div className="w-px bg-[#E0D9CC] h-[30px]" />
                  <div className="flex items-center gap-2">
                    {ev.impacto.map(imp => (
                      <div key={imp.label} className="px-[14px] py-[6px] rounded-[20px] flex items-center justify-center" style={{ backgroundColor: imp.color }}>
                        <span className="text-white font-semibold text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{imp.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="border-l-4 p-8 rounded-r-lg space-y-4" style={{ backgroundColor: `${COPPER}0D`, borderColor: COPPER }}>
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>{ev.keyPointsLabel}</h3>
            <ol className="space-y-4">
              {ev.keyPoints.map((pt, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-none w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ backgroundColor: COPPER, fontFamily: "'DM Sans', sans-serif" }}>{i + 1}</span>
                  <p className="text-slate-700 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{pt}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Related Topics & Additional Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>TEMAS RELACIONADOS</h3>
              <div className="flex flex-wrap gap-2">
                {ev.temas.map(t => (
                  <span key={t} className="px-4 py-2 bg-slate-100/50 text-slate-700 rounded-full text-xs font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>INFORMACIÓN ADICIONAL</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-full text-xs" style={{ boxShadow: "0 12px 32px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.02)" }}>
                  <span className="text-slate-400 font-medium uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>Fuente:</span>
                  <span className="text-slate-900 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{ev.fuente}</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-full text-xs" style={{ boxShadow: "0 12px 32px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.02)" }}>
                  <span className="text-slate-400 font-medium uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>Nivel:</span>
                  <span className="text-slate-900 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{ev.nivel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-white rounded-lg p-8 space-y-6" style={{ boxShadow: "0 12px 32px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.02)" }}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ color: COPPER }}>auto_awesome</span>
                <h3 className="text-2xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif" }}>Resumen con IA</h3>
              </div>
              <div className="flex p-1 bg-[#f2f4f6] rounded-full">
                <button className="px-4 py-1.5 text-xs font-bold text-white rounded-full" style={{ backgroundColor: COPPER, fontFamily: "'DM Sans', sans-serif" }}>EJECUTIVO</button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500 rounded-full hover:text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>DETALLADO</button>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>{ev.aiSummary}</p>
          </div>

          {/* Actores Involucrados */}
          <div className="space-y-6 pt-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>ACTORES INVOLUCRADOS</h3>
            <div className="grid grid-cols-3 gap-4">
              {ev.actores.map(a => (
                <div key={a.name} className="bg-white border border-slate-100 rounded-full p-2 pr-6 flex items-center gap-3" style={{ boxShadow: "0 12px 32px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.02)" }}>
                  <div className={`w-10 h-10 rounded-full ${a.bg} flex items-center justify-center text-[10px] font-bold ${a.text}`}>{a.initials}</div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>{a.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column */}
        <aside className="w-[35%] space-y-6 relative">
          {/* Actions */}
          <div className="bg-white rounded-lg p-6 space-y-4" style={{ boxShadow: "0 12px 32px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.02)" }}>
            <div className="space-y-3">
              <a href="/reporte-individual.pdf" download="ReporteIniciativaArtistas.pdf" className="w-full py-3.5 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md" style={{ backgroundColor: COPPER, fontFamily: "'DM Sans', sans-serif" }}>
                <span className="material-symbols-outlined text-lg">download</span>
                Descargar reporte PDF
              </a>
              <button className="w-full py-3.5 bg-transparent border-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:opacity-10 transition-all" style={{ borderColor: COPPER, color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                Descargar datos CSV
              </button>
            </div>

            {/* Seguimiento Widget */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div
                className="px-[18px] py-[14px] flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => setWidgetOpen(!widgetOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center" style={{ backgroundColor: "#F5E6D8" }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: COPPER }}>description</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#111110] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>Seguimiento</p>
                    <p className="text-[11px] text-[#8A887F]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {savedNote ? savedNote.group : "Sin asignar"}
                    </p>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-slate-400 transition-transform duration-300"
                  style={{ transform: widgetOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  expand_more
                </span>
              </div>

              {widgetOpen && (
                <div className="border-t border-slate-100 p-[18px] space-y-5">
                  <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[1.8px] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>ASIGNAR A GRUPO DE INTERÉS</p>
                    <div className="flex flex-wrap gap-2">
                      {["Apple", "Rappi"].map(g => (
                        <button
                          key={g}
                          onClick={() => setSelectedGroup(g)}
                          className="px-4 py-1.5 rounded-full border text-[12px] font-medium transition-all"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            backgroundColor: selectedGroup === g ? COPPER : "transparent",
                            color: selectedGroup === g ? "#FDFAF4" : "#4B5563",
                            borderColor: selectedGroup === g ? COPPER : "#e2e8f0",
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedGroup && !savedNote && (
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>NOTA · {selectedGroup.toUpperCase()}</p>
                      <textarea
                        className="w-full bg-slate-50 border-none rounded-[10px] p-3 text-[13px] text-[#111110] focus:ring-1 h-24 resize-none"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        placeholder="Escribe tu nota aquí..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedGroup(null); setNote(""); }} className="flex-1 py-2 text-[12px] font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
                        <button onClick={saveNote} className="flex-1 py-2 text-[12px] font-bold text-white bg-[#111110] rounded-lg hover:bg-black transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Guardar nota</button>
                      </div>
                    </div>
                  )}
                  {savedNote && (
                    <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold" style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>{savedNote.group.toUpperCase()}</p>
                        <button onClick={() => setSavedNote(null)} className="text-[10px] text-slate-400 hover:text-primary underline" style={{ fontFamily: "'DM Sans', sans-serif" }}>Editar</button>
                      </div>
                      <p className="text-[13px] text-slate-600 italic font-medium leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>"{savedNote.text}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-2 gap-4">
            {prevEv ? (
              <Link href={`/evento/${prevId}`} className="bg-white p-4 rounded-lg group hover:-translate-y-1 transition-all" style={{ boxShadow: "0 12px 32px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.02)" }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: COPPER }}>
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Anterior</span>
                </div>
                <p className="text-xs font-bold text-slate-900 line-clamp-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{prevEv.title}</p>
              </Link>
            ) : <div />}
            {nextEv ? (
              <Link href={`/evento/${nextId}`} className="bg-white p-4 rounded-lg group hover:-translate-y-1 transition-all text-right" style={{ boxShadow: "0 12px 32px rgba(15,23,42,0.04), 0 4px 8px rgba(15,23,42,0.02)" }}>
                <div className="flex items-center justify-end gap-2 mb-2" style={{ color: COPPER }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Siguiente</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
                <p className="text-xs font-bold text-slate-900 line-clamp-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{nextEv.title}</p>
              </Link>
            ) : <div />}
          </div>

          {/* Toast */}
          {toastVisible && (
            <div className="fixed bottom-8 right-8 bg-[#111110] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px] font-bold">check</span>
              </div>
              <span className="text-xs font-bold tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>Nota guardada correctamente</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
