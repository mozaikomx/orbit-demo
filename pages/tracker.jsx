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
    { id: "claudia", label: "Claudia Sheinbaum", tipo: "Persona", dominio: null },
    { id: "morena", label: "Morena", tipo: "Empresa", dominio: "morena.mx" },
    { id: "amlo", label: "Andrés Manuel López Obrador", tipo: "Persona", dominio: null },
    { id: "shcp", label: "SHCP", tipo: "Gobierno", dominio: "hacienda.gob.mx" },
    { id: "cfe", label: "CFE", tipo: "Gobierno", dominio: "cfe.mx" },
    { id: "pemex", label: "Pemex", tipo: "Gobierno", dominio: "pemex.com" },
    { id: "unam", label: "UNAM", tipo: "ONG", dominio: "unam.mx" },
    { id: "cdmx", label: "Gobierno CDMX", tipo: "Gobierno", dominio: "cdmx.gob.mx" },
    { id: "gabinete", label: "Gabinete Federal", tipo: "Gobierno", dominio: "gob.mx" },
    { id: "congreso", label: "Congreso de la Unión", tipo: "Gobierno", dominio: "congreso.gob.mx" },
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

// SVG fallback icons per node type (white icon on transparent bg, overlaid on colored circle)
function makeSvgFallback(body) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const SVG_FALLBACKS = {
  Persona: makeSvgFallback(
    `<circle cx="50" cy="36" r="19" fill="rgba(255,255,255,0.88)"/>
     <path d="M18 82 C18 60 38 52 50 52 C62 52 82 60 82 82" fill="rgba(255,255,255,0.88)"/>`
  ),
  Gobierno: makeSvgFallback(
    `<polygon points="50,14 8,48 92,48" fill="rgba(255,255,255,0.88)"/>
     <rect x="14" y="48" width="72" height="34" fill="rgba(255,255,255,0.88)"/>
     <rect x="27" y="55" width="8" height="27" fill="rgba(0,0,0,0.12)"/>
     <rect x="42" y="55" width="8" height="27" fill="rgba(0,0,0,0.12)"/>
     <rect x="57" y="55" width="8" height="27" fill="rgba(0,0,0,0.12)"/>
     <rect x="72" y="55" width="8" height="27" fill="rgba(0,0,0,0.12)"/>`
  ),
  Empresa: makeSvgFallback(
    `<rect x="18" y="22" width="64" height="64" rx="2" fill="rgba(255,255,255,0.88)"/>
     <rect x="26" y="32" width="14" height="11" rx="1" fill="rgba(0,0,0,0.12)"/>
     <rect x="46" y="32" width="14" height="11" rx="1" fill="rgba(0,0,0,0.12)"/>
     <rect x="62" y="32" width="14" height="11" rx="1" fill="rgba(0,0,0,0.12)"/>
     <rect x="26" y="50" width="14" height="11" rx="1" fill="rgba(0,0,0,0.12)"/>
     <rect x="46" y="50" width="14" height="11" rx="1" fill="rgba(0,0,0,0.12)"/>
     <rect x="62" y="50" width="14" height="11" rx="1" fill="rgba(0,0,0,0.12)"/>
     <rect x="38" y="66" width="24" height="20" rx="1" fill="rgba(0,0,0,0.12)"/>`
  ),
  ONG: makeSvgFallback(
    `<path d="M50 78 C50 78 16 58 16 36 C16 25 24 16 36 18 C43 18 48 23 50 28 C52 23 57 18 64 18 C76 16 84 25 84 36 C84 58 50 78 50 78 Z" fill="rgba(255,255,255,0.88)"/>`
  ),
};

function testImageLoad(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

const POLITICAL_KW = ["méxico", "político", "diputado", "senador", "gobierno", "partido", "secretar", "ministro", "presidente"];

function snippetIsRelevant(snippet) {
  const text = (snippet || "").toLowerCase();
  return POLITICAL_KW.some((kw) => text.includes(kw));
}

async function wikiSearchThumb(lang, searchTerm, filterRelevance = false) {
  try {
    const searchResp = await fetch(
      `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srprop=snippet&srlimit=3&format=json&origin=*`
    );
    const searchData = await searchResp.json();
    const results = searchData?.query?.search || [];
    if (results.length === 0) return null;

    for (let i = 0; i < Math.min(2, results.length); i++) {
      const result = results[i];
      if (filterRelevance && !snippetIsRelevant(result.snippet)) continue;
      const imgResp = await fetch(
        `https://${lang}.wikipedia.org/w/api.php?action=query&pageids=${result.pageid}&prop=pageimages&format=json&pithumbsize=120&origin=*`
      );
      const imgData = await imgResp.json();
      const page = Object.values(imgData?.query?.pages || {})[0];
      if (page?.thumbnail?.source) return page.thumbnail.source;
    }
    return null;
  } catch {
    return null;
  }
}

async function getNodeImageUrl(nodeData, searchTerm) {
  const { tipo, dominio } = nodeData;

  if (tipo === "Persona") {
    // searchTerm (main actor) already carries full context; other personas get political context added
    const term = searchTerm || `${nodeData.label} político México`;
    return (
      (await wikiSearchThumb("es", term, true)) ||
      (await wikiSearchThumb("en", term, true))
    );
  }

  // Gobierno / Empresa / ONG — Clearbit first, then Wikipedia
  const term = nodeData.label;
  if (dominio) {
    const clearbitUrl = `https://logo.clearbit.com/${dominio}`;
    if (await testImageLoad(clearbitUrl)) return clearbitUrl;
  }
  return (await wikiSearchThumb("es", term)) || (await wikiSearchThumb("en", term));
}

function Graph({ data, onNodeClick }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;
    let cancelled = false;

    const container = svgRef.current.parentElement;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    d3.select(svgRef.current).selectAll("*").remove();
    d3.selectAll(".orbit-tooltip").remove();

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    const g = svg.append("g");

    svg.call(
      d3.zoom().scaleExtent([0.3, 3]).on("zoom", (event) => g.attr("transform", event.transform))
    );

    const mainActorId = data.nodos[0].id;
    const rMain = 25;
    const rNode = 18;
    const getR = (d) => (d.id === mainActorId ? rMain : rNode);
    const safeId = (id) => id.replace(/[^a-zA-Z0-9]/g, "_");

    const nodes = data.nodos.map((n) => ({ ...n }));
    const links = data.conexiones.map((l) => ({ ...l }));

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(44));

    const defs = g.append("defs");

    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28).attr("refY", 0)
      .attr("markerWidth", 6).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#94A3B8")
      .attr("d", "M0,-5L10,0L0,5");

    // ClipPath per node
    nodes.forEach((nd) => {
      defs.append("clipPath")
        .attr("id", `clip-${safeId(nd.id)}`)
        .append("circle")
        .attr("r", nd.id === mainActorId ? rMain : rNode)
        .attr("cx", 0).attr("cy", 0);
    });

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "orbit-tooltip")
      .style("position", "fixed")
      .style("background", "white")
      .style("border", "1px solid #E2E8F0")
      .style("border-radius", "12px")
      .style("padding", "10px 14px")
      .style("font-family", "'DM Sans', sans-serif")
      .style("box-shadow", "0 4px 20px rgba(0,0,0,0.14)")
      .style("pointer-events", "none")
      .style("z-index", "9999")
      .style("opacity", "0")
      .style("max-width", "210px")
      .style("transition", "opacity 0.12s");

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", (d) => (d.id === mainActorId ? "grab" : "pointer"))
      .call(
        d3.drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      );

    // Colored background circle
    node.append("circle")
      .attr("r", getR)
      .attr("fill", (d) => nodeColors[d.tipo] || "#94A3B8")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.15))");

    // Image element — starts with SVG fallback, replaced async with real image
    node.append("image")
      .attr("data-node-id", (d) => d.id)
      .attr("clip-path", (d) => `url(#clip-${safeId(d.id)})`)
      .attr("width", (d) => getR(d) * 2)
      .attr("height", (d) => getR(d) * 2)
      .attr("x", (d) => -getR(d))
      .attr("y", (d) => -getR(d))
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("href", (d) => SVG_FALLBACKS[d.tipo] || SVG_FALLBACKS.Persona);

    // Below-circle label
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => getR(d) + 13)
      .attr("font-size", 9)
      .attr("fill", "#334155")
      .attr("font-family", "'DM Sans', sans-serif")
      .style("pointer-events", "none")
      .text((d) => d.label.split(" ").slice(0, 2).join(" "));

    // Hover helpers
    const srcId = (l) => (typeof l.source === "object" ? l.source.id : l.source);
    const tgtId = (l) => (typeof l.target === "object" ? l.target.id : l.target);

    node
      .on("mouseover", (event, d) => {
        const connectedIds = new Set();
        links.forEach((l) => {
          if (srcId(l) === d.id) connectedIds.add(tgtId(l));
          if (tgtId(l) === d.id) connectedIds.add(srcId(l));
        });

        node.style("opacity", (n) => (n.id === d.id || connectedIds.has(n.id) ? 1 : 0.2));
        link
          .style("opacity", (l) => (srcId(l) === d.id || tgtId(l) === d.id ? 1 : 0.08))
          .attr("stroke-width", (l) => (srcId(l) === d.id || tgtId(l) === d.id ? 3 : 1.5))
          .attr("stroke", (l) => (srcId(l) === d.id || tgtId(l) === d.id ? "#B87851" : "#CBD5E1"));

        d3.select(event.currentTarget).select("circle")
          .transition().duration(150)
          .attr("r", getR(d) * 1.4);

        const mainRelation = data.conexiones.find((c) => {
          const s = typeof c.source === "object" ? c.source.id : c.source;
          const t = typeof c.target === "object" ? c.target.id : c.target;
          return (s === d.id && t === mainActorId) || (t === d.id && s === mainActorId);
        });

        tooltip
          .html(`
            <div style="font-weight:700;font-size:13px;color:#0F172A;margin-bottom:3px">${d.label}</div>
            <div style="font-size:10px;font-weight:700;color:${nodeColors[d.tipo] || "#94A3B8"};text-transform:uppercase;letter-spacing:0.08em;${mainRelation ? "margin-bottom:7px" : ""}">${d.tipo}</div>
            ${mainRelation ? `<div style="font-size:11px;color:#64748B;border-top:1px solid #F1F5F9;padding-top:6px">Relación: <strong style="color:#334155">${mainRelation.tipo}</strong></div>` : ""}
          `)
          .style("opacity", "1");
      })
      .on("mousemove", (event) => {
        tooltip.style("left", event.clientX + 16 + "px").style("top", event.clientY - 44 + "px");
      })
      .on("mouseout", (event, d) => {
        node.style("opacity", 1);
        link.style("opacity", 1).attr("stroke-width", 1.5).attr("stroke", "#CBD5E1");
        d3.select(event.currentTarget).select("circle")
          .transition().duration(150)
          .attr("r", getR(d));
        tooltip.style("opacity", "0");
      })
      .on("click", (event, d) => {
        if (d.id === mainActorId) return;
        const relations = data.conexiones
          .filter((c) => {
            const s = typeof c.source === "object" ? c.source.id : c.source;
            const t = typeof c.target === "object" ? c.target.id : c.target;
            return s === d.id || t === d.id;
          })
          .map((c) => {
            const s = typeof c.source === "object" ? c.source.id : c.source;
            const t = typeof c.target === "object" ? c.target.id : c.target;
            const otherId = s === d.id ? t : s;
            const other = data.nodos.find((n) => n.id === otherId);
            return { tipo: c.tipo, direction: s === d.id ? "out" : "in", otherLabel: other?.label || otherId };
          });
        onNodeClick(d, relations);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Async image loading — fires after initial render, non-blocking
    nodes.forEach(async (nd) => {
      const searchTerm = nd.id === mainActorId && data.perfil?.nombre
        ? `${data.perfil.nombre} ${data.perfil.cargo || "político"} México`
        : undefined;
      const url = await getNodeImageUrl(nd, searchTerm);
      if (cancelled || !url || !svgRef.current) return;
      const imgEl = svgRef.current.querySelector(`image[data-node-id="${nd.id}"]`);
      if (imgEl) imgEl.setAttribute("href", url);
    });

    return () => {
      cancelled = true;
      simulation.stop();
      tooltip.remove();
    };
  }, [data]);

  return <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />;
}

const DEPTH_OPTIONS = [
  { label: "Rápido", value: 8 },
  { label: "Estándar", value: 15 },
  { label: "Profundo", value: 25 },
];

export default function Tracker() {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(EXAMPLE_DATA);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeRelations, setNodeRelations] = useState([]);
  const [profundidad, setProfundidad] = useState(15);
  const [highDemand, setHighDemand] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const LOADING_MESSAGES = [
    "Investigando actor...",
    "Analizando conexiones políticas...",
    "Mapeando relaciones de influencia...",
    "Construyendo grafo de actores...",
    "Casi listo...",
  ];

  const handleInvestigate = async () => {
    if (!nombre.trim()) return;
    setLoading(true);
    setError(null);
    setHighDemand(false);
    setSelectedNode(null);
    setLoadingMessage(LOADING_MESSAGES[0]);

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = Math.min(msgIndex + 1, LOADING_MESSAGES.length - 1);
      setLoadingMessage(LOADING_MESSAGES[msgIndex]);
    }, 4000);

    try {
      const res = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), profundidad }),
      });
      const json = await res.json();
      if (json.error === "high_demand") {
        setHighDemand(true);
        return;
      }
      if (!res.ok) throw new Error(json.error || "Error desconocido");
      setData({ nombre: nombre.trim(), ...json });
    } catch (e) {
      setError(e.message);
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleNodeClick = (node, relations) => {
    setSelectedNode(node);
    setNodeRelations(relations);
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
            placeholder="Ej: Claudia Sheinbaum, presidenta de México"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInvestigate()}
          />
          <div className="flex gap-2">
            {DEPTH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setProfundidad(opt.value)}
                className="flex-1 py-1.5 rounded-full text-[11px] font-bold border transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: profundidad === opt.value ? "#B87851" : "white",
                  color: profundidad === opt.value ? "white" : "#94A3B8",
                  borderColor: profundidad === opt.value ? "#B87851" : "#CBD5E1",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleInvestigate}
            disabled={loading || !nombre.trim()}
            className="w-full py-2.5 rounded-lg font-bold text-sm text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "#B87851", fontFamily: "'DM Sans', sans-serif" }}
          >
            {loading ? "Investigando..." : "Investigar"}
          </button>
          {highDemand && (
            <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: "#FFF8F3", border: "1px solid #F0D5C0" }}>
              <p className="text-sm font-medium leading-snug" style={{ color: "#B87851", fontFamily: "'DM Sans', sans-serif" }}>
                ⚠️ El servicio está experimentando alta demanda. Intenta de nuevo en unos segundos.
              </p>
              <button
                onClick={handleInvestigate}
                className="w-full py-2 rounded-lg font-bold text-sm border transition-all hover:opacity-80"
                style={{ borderColor: "#B87851", color: "#B87851", fontFamily: "'DM Sans', sans-serif" }}
              >
                Reintentar
              </button>
            </div>
          )}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
          )}
        </div>

        {selectedNode ? (
          <div className="p-6 space-y-5">
            <button
              onClick={() => setSelectedNode(null)}
              className="flex items-center gap-1.5 text-xs font-bold hover:opacity-70 transition-opacity"
              style={{ color: "#B87851", fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Volver al perfil
            </button>

            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: nodeColors[selectedNode.tipo] || "#94A3B8" }}
              >
                {selectedNode.label.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{selectedNode.label}</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: nodeColors[selectedNode.tipo] || "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>{selectedNode.tipo}</p>
              </div>
            </div>

            {nodeRelations.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Conexiones ({nodeRelations.length})
                </p>
                <div className="space-y-2">
                  {nodeRelations.map((rel, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 py-1.5 border-b border-slate-50 last:border-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <span className="material-symbols-outlined text-sm text-slate-400 mt-0.5 shrink-0">
                        {rel.direction === "out" ? "arrow_forward" : "arrow_back"}
                      </span>
                      <span>
                        <span className="font-bold text-slate-700">{rel.tipo}</span>
                        <span className="text-slate-400"> · </span>
                        {rel.otherLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : perfil && (
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
                  <span key={tag} className="text-[11px] font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: "#B87851", fontFamily: "'DM Sans', sans-serif" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

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
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-[3px] border-[#B87851] border-t-transparent rounded-full animate-spin" />
              <p
                className="text-sm font-semibold transition-all duration-500"
                style={{ color: "#B87851", fontFamily: "'DM Sans', sans-serif" }}
              >
                {loadingMessage}
              </p>
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4 text-[11px] text-slate-400 z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Arrastra nodos · Scroll para zoom · Click para ver detalle
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          {data && <Graph key={data.nombre} data={data} onNodeClick={handleNodeClick} />}
        </div>
      </div>
    </div>
  );
}
