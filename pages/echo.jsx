import { useState } from "react";
import Link from "next/link";

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const YEARS = ["2024", "2025", "2026", "2027"];

const dayDots = {
  1: ["emerald"],
  2: ["emerald", "emerald"],
  3: ["emerald", "red"],
  4: ["emerald"],
  5: ["emerald", "emerald", "emerald"],
  7: ["emerald"],
  9: ["emerald", "emerald"],
  10: ["emerald"],
  11: ["emerald", "purple"],
  12: ["emerald"],
  13: ["emerald", "emerald", "emerald"],
  16: ["emerald"],
  17: ["emerald", "emerald"],
  18: ["emerald", "red"],
  19: ["emerald", "emerald", "emerald"],
  20: ["emerald"],
  22: ["emerald"],
  23: ["primary", "primary"],
  24: ["primary"],
  25: ["primary", "primary", "primary"],
  26: ["primary"],
  27: ["primary", "primary"],
};

const dotColors = {
  emerald: "bg-emerald-500",
  red: "bg-red-400",
  purple: "bg-purple-500",
  primary: "bg-[#B87851]",
};

const sessions = [
  {
    time: "10:30",
    date: "22 marzo 2026",
    status: "En progreso",
    statusClass: "bg-sky-50 text-sky-700",
    org: "Cámara de Diputados",
    title: "Debate sobre Presupuesto Nacional 2025",
    href: "/sesion/1",
  },
  {
    time: "11:30",
    date: "22 marzo 2026",
    status: "Concluida",
    statusClass: "bg-emerald-50 text-emerald-700",
    org: "Cámara de Diputados",
    title: "A la decimosexta reunión de junta directiva de la Comisión de Infraestructura",
    href: "/sesion/3",
  },
  {
    time: "13:00",
    date: "22 marzo 2026",
    status: "Programada",
    statusClass: "bg-[#B87851]/10 text-[#B87851]",
    org: "Senado de la República",
    title: "Reunión de la Comisión de Hacienda y Crédito Público para análisis de ley de egresos",
    href: "/sesion/2",
  },
];

const foroOptions = ["Todos los foros", "Pleno de la Cámara de Diputados", "Comisiones de la Cámara de Diputados", "Pleno del Senado de la República", "Comisiones del Senado de la República", "Conferencia Matutina Presidencial"];
const estatusOptions = ["Todas", "Programadas", "En progreso", "Concluidas", "Canceladas"];

function PillDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-full text-sm font-bold text-on-surface cursor-pointer hover:bg-slate-100 select-none"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        onClick={() => setOpen(!open)}
      >
        <span>{value}</span>
        <span
          className="material-symbols-outlined text-lg"
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </div>
      {open && (
        <div className="absolute top-full mt-2 left-0 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden min-w-[140px] max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: opt === value ? "#F5E6D8" : undefined,
                color: opt === value ? "#8A5A35" : "#374151",
                fontWeight: opt === value ? 700 : 400,
              }}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-[8px] relative">
      <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#8A887F]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      <div
        className="flex items-center justify-between px-[14px] py-[10px] bg-white border-[0.5px] border-[#E0D9CC] rounded-[10px] cursor-pointer hover:border-[#B87851] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[13px] font-medium text-[#111110]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
        <svg
          className="transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none" height="14" viewBox="0 0 14 14" width="14"
        >
          <path d="M3 5l4 4 4-4" stroke="#8A887F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
        </svg>
      </div>
      {open && (
        <div className="absolute w-full z-10 bg-white border-[0.5px] border-[#B87851] border-t-0 rounded-b-[10px] shadow-lg top-full -mt-[1px]">
          {options.map((opt) => (
            <div
              key={opt}
              className="px-[14px] py-[9px] text-[13px] cursor-pointer hover:bg-[#F5F0E8]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: opt === value ? "#F5E6D8" : undefined,
                color: opt === value ? "#8A5A35" : "#5C5A54",
                fontWeight: opt === value ? 600 : 400,
              }}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Echo() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [foro, setForo] = useState("Todos los foros");
  const [estatus, setEstatus] = useState("Todas");
  const [month, setMonth] = useState(2); // 0-indexed; 2 = March
  const [year, setYear] = useState(2026);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const catalogTitle = selectedDay
    ? `Catálogo de sesiones del ${selectedDay} de ${MONTHS[month].toLowerCase()} de ${year}`
    : `Catálogo de sesiones de ${MONTHS[month].toLowerCase()} de ${year}`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md flex justify-end items-center px-8 py-6 border-b border-slate-200/15" style={{ backgroundColor: "rgba(247,249,251,0.8)" }}>
        <div className="flex items-center gap-4" />
      </header>

      <div className="p-8 flex gap-8">
        <div className="flex-1 max-w-5xl">
          {/* Calendar */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 mb-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <PillDropdown
                  options={MONTHS}
                  value={MONTHS[month]}
                  onChange={(m) => { setMonth(MONTHS.indexOf(m)); setSelectedDay(null); }}
                />
                <PillDropdown
                  options={YEARS}
                  value={String(year)}
                  onChange={(y) => { setYear(parseInt(y)); setSelectedDay(null); }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-[#B87851]"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-[#B87851]"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-t border-l border-slate-100 gap-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
                <div key={d} className="p-4 text-center border-r border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{d}</span>
                </div>
              ))}

              {calendarDays.map((day) => {
                const dots = dayDots[day] || [];
                const isSelected = selectedDay === day;
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className="aspect-square flex flex-col items-center justify-center p-2 rounded-3xl border cursor-pointer transition-all"
                    style={{
                      borderColor: isSelected ? "rgba(184,120,81,0.2)" : "#f8fafc",
                      backgroundColor: isSelected ? "rgba(184,120,81,0.05)" : "transparent",
                    }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: isSelected ? "#B87851" : "#374151",
                        fontWeight: isSelected ? 700 : 500,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {day}
                    </span>
                    {dots.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {dots.map((c, j) => (
                          <span key={j} className={`w-1 h-1 rounded-full ${dotColors[c]}`} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session Catalog */}
          <section>
            <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-2xl text-on-surface" style={{ fontFamily: "'Playfair Display', serif" }}>{catalogTitle}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px] mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Mostrando {sessions.length} sesiones</p>
              </div>
            </div>
            <div className="space-y-4">
              {sessions.map((s, i) => (
                <Link key={i} href={s.href}>
                  <article className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-8 group cursor-pointer">
                    <div className="min-w-[100px] flex flex-col items-center justify-center border-r border-slate-100 pr-8">
                      <span className="text-2xl font-bold text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.time}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>hrs</span>
                      <span className="text-[12px] font-medium text-slate-500 mt-2 italic" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.date}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${s.statusClass}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {s.status}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.org}</span>
                      </div>
                      <h4
                        className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors leading-snug"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {s.title}
                      </h4>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-[#B87851] group-hover:text-white group-hover:border-[#B87851] transition-all">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Panel */}
        <aside className="w-[320px] shrink-0 sticky top-24 h-fit space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-[18px]">
            <div className="flex items-center gap-2">
              <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="#B87851" strokeLinecap="round" strokeWidth="1.4" />
              </svg>
              <span className="text-[16px] font-bold text-[#111110]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Filtros</span>
            </div>

            <Dropdown label="Foro" options={foroOptions} value={foro} onChange={setForo} />
            <Dropdown label="Estatus" options={estatusOptions} value={estatus} onChange={setEstatus} />

            <button className="w-full text-[#FDFAF4] py-[11px] rounded-[10px] text-[13px] font-semibold hover:opacity-90 transition-opacity mt-2" style={{ backgroundColor: "#B87851", fontFamily: "'DM Sans', sans-serif" }}>
              APLICAR FILTROS
            </button>
            <button
              className="w-full bg-transparent text-[11px] font-bold uppercase tracking-[1.5px] hover:text-[#B87851] transition-colors"
              style={{ color: "#8A887F", fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => { setForo("Todos los foros"); setEstatus("Todas"); }}
            >
              RESTABLECER
            </button>
          </div>

          {/* Session Status Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
              <h5 className="text-[11px] font-bold uppercase tracking-widest text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>Estado de Sesiones</h5>
            </div>
            <div className="space-y-4">
              {[
                { dot: "bg-[#B87851]/40", label: "Programadas", count: "252" },
                { dot: "bg-sky-500", label: "En progreso", count: "0" },
                { dot: "bg-emerald-500", label: "Concluidas", count: "1,868" },
                { dot: "bg-purple-500", label: "Re-programadas", count: "11" },
                { dot: "bg-red-400", label: "Canceladas", count: "22" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${row.dot}`} />
                    <span className="text-xs font-medium text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{row.label}</span>
                  </div>
                  <span className="font-bold text-sm text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
