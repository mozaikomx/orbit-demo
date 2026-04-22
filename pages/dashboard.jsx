import { useState, useEffect, useRef } from "react";
import {
  Chart,
  LineController, LineElement, PointElement, LinearScale, CategoryScale,
  DoughnutController, ArcElement,
  BarController, BarElement,
  RadarController, RadialLinearScale,
  Filler, Legend, Tooltip,
} from "chart.js";

Chart.register(
  LineController, LineElement, PointElement, LinearScale, CategoryScale,
  DoughnutController, ArcElement,
  BarController, BarElement,
  RadarController, RadialLinearScale,
  Filler, Legend, Tooltip
);

const COPPER = "#B87851";
const COPPER_LIGHT = "#EDE7D9";
const months = ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"];

function useChart(ref, config) {
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, config);
    return () => chart.destroy();
  }, []);
}

function AlertVolumeChart() {
  const ref = useRef(null);
  useChart(ref, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Legislativas",
          data: [18, 22, 15, 28, 35, 24],
          borderColor: COPPER,
          backgroundColor: COPPER + "18",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: COPPER,
        },
        {
          label: "Ejecutivas",
          data: [10, 14, 18, 12, 20, 16],
          borderColor: COPPER_LIGHT,
          backgroundColor: COPPER_LIGHT + "40",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: COPPER_LIGHT,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: "DM Sans", size: 11 }, color: "#9CA3AF" } },
        y: { grid: { color: "#F1F5F9" }, ticks: { font: { family: "DM Sans", size: 11 }, color: "#9CA3AF" } },
      },
    },
  });
  return <canvas ref={ref} />;
}

function RiskDoughnutChart() {
  const ref = useRef(null);
  useChart(ref, {
    type: "doughnut",
    data: {
      labels: ["Alto", "Medio", "Bajo"],
      datasets: [{ data: [15, 55, 30], backgroundColor: ["#E24B4A", "#EF9F27", "#639922"], borderWidth: 0, hoverOffset: 4 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "72%",
      plugins: { legend: { display: false } },
    },
  });
  return <canvas ref={ref} />;
}

function ThemeCoverageChart() {
  const ref = useRef(null);
  useChart(ref, {
    type: "bar",
    data: {
      labels: ["Laboral", "Digital", "Fiscal", "Salud", "Comercio"],
      datasets: [
        { label: "Apple", data: [28, 40, 12, 18, 14], backgroundColor: COPPER },
        { label: "Rappi", data: [35, 22, 8, 10, 25], backgroundColor: COPPER_LIGHT },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { font: { family: "DM Sans", size: 11 }, color: "#6B7280", boxWidth: 10 } } },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { family: "DM Sans", size: 11 }, color: "#9CA3AF" } },
        y: { stacked: true, grid: { color: "#F1F5F9" }, ticks: { font: { family: "DM Sans", size: 11 }, color: "#9CA3AF" } },
      },
    },
  });
  return <canvas ref={ref} />;
}

function GovLevelChart() {
  const ref = useRef(null);
  useChart(ref, {
    type: "bar",
    data: {
      labels: ["Federal", "Estatal", "Local"],
      datasets: [
        { label: "Apple", data: [48, 22, 12], backgroundColor: COPPER },
        { label: "Rappi", data: [32, 18, 14], backgroundColor: COPPER_LIGHT },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: "y",
      plugins: { legend: { position: "bottom", labels: { font: { family: "DM Sans", size: 11 }, color: "#6B7280", boxWidth: 10 } } },
      scales: {
        x: { grid: { color: "#F1F5F9" }, ticks: { font: { family: "DM Sans", size: 11 }, color: "#9CA3AF" } },
        y: { grid: { display: false }, ticks: { font: { family: "DM Sans", size: 11 }, color: "#374151" } },
      },
    },
  });
  return <canvas ref={ref} />;
}

export default function Dashboard() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [periodo, setPeriodo] = useState("30d");

  const heatmapData = [
    { tema: "Laboral", ejecutivo: { nivel: "ALTA", bg: COPPER, text: "#fff" }, legislativo: { nivel: "MEDIA", bg: "#D4956A", text: "#fff" }, judicial: { nivel: "BAJA", bg: `${COPPER}0D`, text: "#9CA3AF", border: true } },
    { tema: "Digital", ejecutivo: { nivel: "MEDIA", bg: "#D4956A", text: "#fff" }, legislativo: { nivel: "ALTA", bg: COPPER, text: "#fff" }, judicial: { nivel: "ALTA", bg: COPPER, text: "#fff" } },
    { tema: "Fiscal", ejecutivo: { nivel: "BAJA", bg: `${COPPER}0D`, text: "#9CA3AF", border: true }, legislativo: { nivel: "MEDIA", bg: "#D4956A", text: "#fff" }, judicial: { nivel: "MEDIA", bg: "#D4956A", text: "#fff" } },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md flex items-center justify-between w-full h-16 px-8 border-b border-slate-200/15" style={{ backgroundColor: "rgba(247,249,251,0.8)" }}>
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              className="w-full rounded-full py-2 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 border-none"
              style={{ backgroundColor: "#eceef0", fontFamily: "'DM Sans', sans-serif" }}
              placeholder="Buscar documentación"
              type="text"
            />
          </div>
        </div>
      </header>

      <div className="p-10 max-w-[1440px] mx-auto space-y-12">

        {/* Filter bar */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-[13px] cursor-pointer hover:bg-slate-50/50 transition-colors"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#F5E6D8] rounded-[8px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]" style={{ color: COPPER }}>filter_list</span>
              </div>
              <span className="text-[13px] font-semibold text-[#111110]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Filtros</span>
              <div className="flex gap-2 ml-2">
                {["Apple", "Rappi"].map(c => (
                  <span key={c} className="px-3 py-0.5 text-[11px] font-semibold rounded-full" style={{ backgroundColor: "#F5E6D8", color: "#8A5A35", fontFamily: "'DM Sans', sans-serif" }}>{c}</span>
                ))}
              </div>
            </div>
            <div className="w-5 h-5 bg-surface rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px] text-slate-400 transition-transform duration-300" style={{ transform: filtersOpen ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
            </div>
          </div>

          {filtersOpen && (
            <div className="border-t border-slate-100/50 p-5">
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: "Grupo de interés", pills: ["Todos", "Apple", "Rappi"], toggle: true },
                  { label: "Fuente", pills: ["Todas", "DOF", "CONAMER", "PROFECO"] },
                  { label: "Tema", pills: ["Todas", "Salud", "Laboral", "Economía"] },
                  { label: "Poder", pills: ["Todos", "Ejecutivo", "Legislativo"] },
                  { label: "Nivel de Gobierno", pills: ["Todos", "Federal", "Estatal"] },
                ].map(({ label, pills, toggle }) => (
                  <div key={label} className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
                    {toggle ? (
                      <div className="flex p-1 rounded-full" style={{ backgroundColor: "#F5F0E8" }}>
                        {pills.map((p, i) => (
                          <button key={p} className="flex-1 py-1.5 text-[11px] font-semibold rounded-full transition-colors" style={{ backgroundColor: i === 0 ? "#fff" : "transparent", color: i === 0 ? "#111110" : "#737686", fontFamily: "'DM Sans', sans-serif" }}>{p}</button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {pills.map((p, i) => (
                          <button key={p} className="px-3 py-1.5 text-[11px] font-semibold rounded-full transition-colors hover:bg-slate-100" style={{ backgroundColor: i === 0 ? "#111110" : "transparent", color: i === 0 ? "#fff" : "#737686", fontFamily: "'DM Sans', sans-serif" }}>{p}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Período:</span>
                  <div className="flex bg-slate-100 p-1 rounded-full">
                    {["7d", "30d", "90d"].map(p => (
                      <button key={p} onClick={() => setPeriodo(p)} className="px-4 py-1 text-[11px] font-semibold rounded-full transition-all" style={{ backgroundColor: periodo === p ? COPPER : "transparent", color: periodo === p ? "#fff" : "#737686", fontFamily: "'DM Sans', sans-serif" }}>{p}</button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2 text-[11px] font-bold border border-slate-200 rounded-full text-on-surface hover:bg-slate-50 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Restablecer</button>
                  <button className="px-6 py-2 text-[11px] font-bold text-white rounded-full shadow-md hover:opacity-90 transition-all" style={{ backgroundColor: COPPER, fontFamily: "'DM Sans', sans-serif" }}>Aplicar filtros</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-on-surface tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard</h1>
            <p className="text-on-surface-variant text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Resumen estadístico filtrado por Apple y Rappi.</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Eventos monitoreados", value: "112", badge: "↑ 12% VS EL PERIODO ANTERIOR", badgeClass: "bg-emerald-100 text-emerald-700" },
            { label: "Fuentes activas", value: "84" },
            { label: "Grupos de interés", value: "2" },
          ].map(({ label, value, badge, badgeClass }) => (
            <div key={label} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
              <h2 className="text-5xl font-bold text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>{value}</h2>
              {badge && <span className={`text-[10px] font-bold px-3 py-1 rounded-full self-start ${badgeClass}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{badge}</span>}
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-on-surface" style={{ fontFamily: "'Playfair Display', serif" }}>Volumen de alertas — Apple &amp; Rappi</h3>
              <div className="flex gap-4">
                {[["bg-[#B87851]", "Legislativas"], ["bg-[#EDE7D9]", "Ejecutivas"]].map(([bg, lbl]) => (
                  <div key={lbl} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${bg}`} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[300px] relative"><AlertVolumeChart /></div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-on-surface mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Riesgo Combinado</h3>
            <div className="h-[240px] relative flex justify-center"><RiskDoughnutChart /></div>
            <div className="mt-8 space-y-3">
              {[["#E24B4A", "Alto", "15%"], ["#EF9F27", "Medio", "55%"], ["#639922", "Bajo", "30%"]].map(([color, label, pct]) => (
                <div key={label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-on-surface mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Cobertura temática (Filtrada)</h3>
            <div className="h-[300px] relative"><ThemeCoverageChart /></div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-on-surface mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Actividad por grupo de interés</h3>
            <div className="space-y-8 py-4">
              {[["Apple", 82], ["Rappi", 64]].map(([name, pct]) => (
                <div key={name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{name}</span>
                    <span className="text-xs font-bold" style={{ color: COPPER, fontFamily: "'DM Sans', sans-serif" }}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COPPER }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-on-surface mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Nivel de gobierno (Apple + Rappi)</h3>
            <div className="h-[300px] relative"><GovLevelChart /></div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-on-surface mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Mapa de calor — tema × poder</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-2">
                <thead>
                  <tr>
                    {["Tema", "Ejecutivo", "Legislativo", "Judicial"].map(h => (
                      <th key={h} className="p-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 text-center first:text-left" style={{ fontFamily: "'DM Sans', sans-serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map(row => (
                    <tr key={row.tema}>
                      <td className="p-2 font-bold text-on-surface text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{row.tema}</td>
                      {[row.ejecutivo, row.legislativo, row.judicial].map((cell, i) => (
                        <td key={i} className="p-4 text-center font-bold rounded-sm text-xs" style={{ backgroundColor: cell.bg, color: cell.text, border: cell.border ? `1px solid ${COPPER}1A` : undefined, fontFamily: "'DM Sans', sans-serif" }}>
                          {cell.nivel}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
