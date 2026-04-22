import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const EXAMPLE_DATA = {
  nombre: "Claudia Sheinbaum",
  perfil: {
    nombre: "Claudia Sheinbaum Pardo",
    cargo: "Presidenta de México",
    partido: "Morena",
    descripcion:
      "Primera mujer en ocupar la Presidencia de México. Científica e ingeniera ambiental. Gobernó la Ciudad de México de 2018 a 2023. Ganó las elecciones del 2 de junio de 2024 con más del 59% de los votos.",
    tags: ["Presidenta", "Morena", "Científica", "CDMX"],
  },
  nodos: [
    { id: "claudia", label: "Claudia Sheinbaum", tipo: "Persona" },
    { id: "morena", label: "Morena", tipo: "Empresa" },
    { id: "amlo", label: "Andrés Manuel López Obrador", tipo: "Persona" },
    { id: "shcp", label: "SHCP", tipo: "Gobierno" },
    { id: "cfe", label: "CFE", tipo: "Gobierno" },
    { id: "pemex", label: "Pemex", tipo: "Gobierno" },
    { id: "unam", label: "UNAM", tipo: "ONG" },
    { id: "cdmx", label: "Gobierno CDMX", tipo: "Gobierno" },
    { id: "gabinete", label: "Gabinete Federal", tipo: "Gobierno" },
    { id: "congreso", label: "Congreso de la Unión", tipo: "Gobierno" },
  ],
  conexiones: [
    { source: "claudia", target: "morena", tipo: "Miembro" },
    { source: "claudia", target: "amlo", tipo: "Aliado político" },
    { source: "claudia", target: "shcp", tipo: "Supervisión" },
    { source: "claudia", target: "cfe", tipo: "Supervisión" },
    { source: "claudia", target: "pemex", tipo: "Supervisión" },
    { source: "claudia", target: "unam", tipo: "Egresada" },
    { source: "claudia", target: "cdmx", tipo: "Ex gobernadora" },
    { source: "claudia", target: "gabinete", tipo: "Dirige" },
    { source: "claudia", target: "congreso", tipo: "Interacción" },
    { source: "morena", target: "amlo", tipo: "Fundador" },
    { source: "gabinete", target: "shcp", tipo: "Incluye" },
    { source: "gabinete", target: "cfe", tipo: "Incluye" },
  ],
};

const nodeColors = {
  Persona: "#3B82F6",
  Gobierno: "#EF4444",
  Empresa: "#8B5CF6",
  ONG: "#10B981",
};

function Graph({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const container = svgRef.current.parentElement;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g");

    svg.call(
      d3.zoom().scaleExtent([0.3, 3]).on("zoom", (event) => {
        g.attr("transform", event.transform);
      })
    );

    const nodes = data.nodos.map((n) => ({ ...n }));
    const links = data.conexiones.map((l) => ({ ...l }));

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(40));

    g.append("defs").selectAll("marker")
      .data(["arrow"])
      .join("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#94A3B8")
      .attr("d", "M0,-5L10,0L0,5");

    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    const linkLabel = g
      .append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("font-size", 9)
      .attr("fill", "#94A3B8")
      .attr("font-family", "'DM Sans', sans-serif")
      .text((d) => d.tipo);

    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "grab")
      .call(
        d3.drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .append("circle")
      .attr("r", (d) => (d.id === "claudia" ? 28 : 18))
      .attr("fill", (d) => nodeColors[d.tipo] || "#94A3B8")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.15))");

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", (d) => (d.id === "claudia" ? 10 : 8))
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .attr("font-family", "'DM Sans', sans-serif")
      .text((d) => d.label.split(" ")[0]);

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.id === "claudia" ? 42 : 32))
      .attr("font-size", 9)
      .attr("fill", "#334155")
      .attr("font-family", "'DM Sans', sans-serif")
      .text((d) => d.label.split(" ").slice(0, 2).join(" "));

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      linkLabel
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2 - 4);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [data]);

  return <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />;
}

export default function Tracker() {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(EXAMPLE_DATA);
  const [error, setError] = useState(null);

  const handleInvestigate = async () => {
    if (!nombre.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim() }),
      });
      if (!res.ok) throw new Error("Error al consultar la API");
      const json = await res.json();
      setData({ nombre: nombre.trim(), ...json });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const perfil = data?.perfil;

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Left panel */}
      <div className="w-[340px] shrink-0 flex flex-col border-r border-slate-100 bg-white overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-on-surface mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Tracker
          </h2>
          <p className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Mapa de actores e influencia.
          </p>
        </div>

        <div className="p-6 border-b border-slate-100 space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Nombre del actor
          </label>
          <input
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B87851]/30 focus:border-[#B87851]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            placeholder="Ej: Claudia Sheinbaum"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInvestigate()}
          />
          <button
            onClick={handleInvestigate}
            disabled={loading || !nombre.trim()}
            className="w-full py-2.5 rounded-lg font-bold text-sm text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "#B87851", fontFamily: "'DM Sans', sans-serif" }}
          >
            {loading ? "Investigando..." : "Investigar"}
          </button>
          {error && (
            <p className="text-xs text-red-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
          )}
        </div>

        {perfil && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: "#B87851" }}
              >
                {perfil.nombre.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{perfil.nombre}</p>
                <p className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{perfil.cargo}</p>
              </div>
            </div>

            {perfil.partido && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Partido</p>
                <p className="text-sm text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif" }}>{perfil.partido}</p>
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Perfil</p>
              <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{perfil.descripcion}</p>
            </div>

            {perfil.tags && (
              <div className="flex flex-wrap gap-2">
                {perfil.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: "#B87851", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Tipos de nodo</p>
              {Object.entries(nodeColors).map(([tipo, color]) => (
                <div key={tipo} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>{tipo}</span>
                </div>
              ))}
            </div>

            {data?.nodos && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {data.nodos.length} actores · {data.conexiones.length} conexiones
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: D3 Graph */}
      <div className="flex-1 relative bg-slate-50">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#B87851] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Construyendo grafo...</p>
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4 text-[11px] text-slate-400 z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Arrastra nodos · Scroll para zoom
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          {data && <Graph key={data.nombre} data={data} />}
        </div>
      </div>
    </div>
  );
}
