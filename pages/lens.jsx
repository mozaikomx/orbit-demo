import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const carouselCards = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGpDDNNLOMmaBbnk-FgPwDRf4KzllRMFMbxUB9WLofwQZ_KNUNGkV0aaWZ8y9hpMFcREAnUxvzaXFH-edDh_RPR0lNcr6H9vpaB5iUqOqKH1GoXWl2HIzyLCgqUgCFIajT-7SiChCdqohlQvluFaNDWkfDuzKzRY-LgcgUtaE-3bsX0uYYescFrIPrSy7eSjJ7hJh_SEx3kY3VXCex_NQ2oCtf1nKuMwA7SEechZfLaGrFR9JM6BW0OcCGjZKxIOjeuVGCHpDsDTI",
    tag: "LABORAL",
    date: "Hace 1 día · Ley Federal del Trabajo",
    title: "Iniciativa que reforma la fracción II del artículo 53 y la fracción III del artículo 76 Bis de la Ley Federal de Protección al Consumidor",
    summary: "Esta iniciativa reforma la Ley Federal de Protección al Consumidor para garantizar mecanismos de asistencia humana en la atención al consumidor en el comercio elec...",
    eventHref: "/evento/1",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP6jmHtSMZ1yPoeorX9klqgqRlfGw7-rEK8Nim1vFLQwUnxH9AgukhbfAYiybMeJLWGIE4t8nsAERbWUAwKT7VDDSKdfwUOe3IYwirLAPW-fXUh831NHrjIJlZAlpNtGndhU3suJwPy1fU6tumRLlnsER7LPmPqO7mrLBxzgteFsAq7_z4Z53wjNd6Z51kXhzZLo2hEJddcDFxNTtZzdm1DtbomQT54fEWtejXOwY7B9Zuaph5lk1iyzZ5ILY7S0VyqwulpZ7s3Vk",
    tag: "PROTECCIÓN DIGITAL",
    date: "24 feb 2026 · Gaceta Parlamentaria",
    title: "Iniciativa que reforma y adiciona diversas disposiciones de la Constitución Política de los Estados Unidos Mexicanos",
    summary: "Establece Estrategia Nacional para Prevención de Adicciones Digitales con control parental obligatorio...",
    eventHref: "/evento/2",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7p3WLMuC-pzbCXMdt59eWtOcbhw_LxQga3Yd5tNhciMbJxFcHCHXl5G4QnlJo92d0gWh7beQUpxx8_1dghnjJYBhTaVtZIsXYzFK5hOGhpGfr4i0HqFX4_JOWLQ0L9qMM3gLaqNpMF-yoXCXeeAwUJBsm3Tk1YLP3aT9w1_u_H0CUm7c4oiZ4aFvPHtFycCbRmRRWLcg7E27IsnOHjjWoX21M0ygzgJxP2CTP86XHaNbtQ_30UsYp9RgNZJljcHdsfoc0ez1SohI",
    tag: "GÉNERO",
    date: "24 feb 2026 · Gaceta Parlamentaria",
    title: "Reforma tipifica violencia digital y mediática en el Código Penal Federal",
    summary: "Busca sancionar conductas como difusión de contenido íntimo sin consentimiento en plataformas...",
    eventHref: "/evento/3",
  },
  {
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tag: "CONSUMIDOR",
    date: "24 feb 2026 · Gaceta Parlamentaria",
    title: "Iniciativa obliga a plataformas de e-commerce a garantizar atención humana",
    summary: "Decisiones complejas o irreversibles deben ser gestionadas por operador humano, no por sistemas automatizados...",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP6jmHtSMZ1yPoeorX9klqgqRlfGw7-rEK8Nim1vFLQwUnxH9AgukhbfAYiybMeJLWGIE4t8nsAERbWUAwKT7VDDSKdfwUOe3IYwirLAPW-fXUh831NHrjIJlZAlpNtGndhU3suJwPy1fU6tumRLlnsER7LPmPqO7mrLBxzgteFsAq7_z4Z53wjNd6Z51kXhzZLo2hEJddcDFxNTtZzdm1DtbomQT54fEWtejXOwY7B9Zuaph5lk1iyzZ5ILY7S0VyqwulpZ7s3Vk",
    tag: "LABORAL",
    date: "24 feb 2026 · Gaceta Parlamentaria",
    title: "Iniciativa constitucionaliza jornada de 40 horas y derecho a desconexión digital",
    summary: "Reforma el Artículo 123 constitucional estableciendo jornada máxima semanal y prohibición de contacto fuera de horario...",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7p3WLMuC-pzbCXMdt59eWtOcbhw_LxQga3Yd5tNhciMbJxFcHCHXl5G4QnlJo92d0gWh7beQUpxx8_1dghnjJYBhTaVtZIsXYzFK5hOGhpGfr4i0HqFX4_JOWLQ0L9qMM3gLaqNpMF-yoXCXeeAwUJBsm3Tk1YLP3aT9w1_u_H0CUm7c4oiZ4aFvPHtFycCbRmRRWLcg7E27IsnOHjjWoX21M0ygzgJxP2CTP86XHaNbtQ_30UsYp9RgNZJljcHdsfoc0ez1SohI",
    tag: "DERECHOS DE AUTOR",
    date: "24 feb 2026 · Gaceta Parlamentaria",
    title: "Decreto protege a artistas intérpretes frente al uso no autorizado de IA",
    summary: "Prohíbe reproducción de voz e imagen de artistas mediante inteligencia artificial sin consentimiento expreso y remunerado...",
  },
];

const newsItems = [
  {
    impactoItems: [{ label: "Apple", color: "#E24B4A" }, { label: "Rappi", color: "#F59E0B" }],
    tag: "Tecnología", tagColor: "bg-rose-100 text-rose-700",
    date: "24 FEB, 2026",
    title: "Iniciativa del Ejecutivo federal con proyecto de decreto por el que se reforman y adicionan diversas disposiciones de la Ley Federal del Trabajo y de la Ley Federal del Derecho de Autor, en materia de derechos de las personas trabajadoras artistas intérpretes o ejecutantes",
    summary: "Prohíbe reproducción de voz e imagen de artistas mediante IA sin consentimiento expreso, informado y remunerado...",
    fuente: "Gaceta Parlamentaria",
    href: "/evento/1",
  },
  {
    impactoItems: [{ label: "Apple", color: "#F59E0B" }],
    tag: "COMERCIO EXTERIOR", tagColor: "bg-orange-100 text-orange-700",
    date: "12 FEB, 2026",
    title: "Acuerdo por el que se modifica el diverso por el que la Secretaría de Economía emite Reglas y criterios de carácter general en materia de comercio exterior",
    summary: "Actualiza requisitos para importación automática de productos siderúrgicos e incorpora nuevos países al Proceso Kimberley...",
    fuente: "DOF",
  },
  {
    impactoItems: [{ label: "Apple", color: "#E24B4A" }, { label: "Rappi", color: "#F59E0B" }],
    tag: "Tecnología", tagColor: "bg-slate-100 text-slate-600",
    date: "24 FEB, 2026",
    title: "Iniciativa que adiciona un artículo 101 Bis 4 a la Ley General de los Derechos de Niñas, Niños y Adolescentes, en materia de prevención de adicciones digitales",
    summary: "Establece Estrategia Nacional para la Prevención de Adicciones Digitales, con obligaciones de verificación de edad...",
    fuente: "Gaceta Parlamentaria",
    href: "/evento/3",
  },
  {
    impactoItems: [{ label: "Apple", color: "#E24B4A" }, { label: "Rappi", color: "#F59E0B" }],
    tag: "SEGURIDAD", tagColor: "bg-red-100 text-red-700",
    date: "24 FEB, 2026",
    title: "Iniciativa que reforma diversas disposiciones del Código Penal Federal y de la Ley General de Acceso de las Mujeres a una Vida Libre de Violencias",
    summary: "Sanciona la difusión de contenido íntimo sin consentimiento y reconoce el impacto de la tecnología...",
    fuente: "Gaceta Parlamentaria",
  },
  {
    impactoItems: [{ label: "Apple", color: "#E24B4A" }, { label: "Rappi", color: "#E24B4A" }],
    tag: "TECNOLOGÍA", tagColor: "bg-indigo-100 text-indigo-700",
    date: "24 FEB, 2026",
    title: "Iniciativa que reforma la fracción II del artículo 53 y la fracción III del artículo 76 Bis de la Ley Federal de Protección al Consumidor, en materia de garantía de asistencia humana en mecanismos de atención al consumidor en el comercio electrónico",
    summary: "Obliga a proveedores a asegurar que decisiones complejas sean gestionadas por operador humano...",
    fuente: "Gaceta Parlamentaria",
    href: "/evento/2",
  },
  {
    impactoItems: [{ label: "Apple", color: "#E24B4A" }, { label: "Rappi", color: "#F59E0B" }],
    tag: "LABORAL", tagColor: "bg-green-100 text-green-700",
    date: "24 FEB, 2026",
    title: "Iniciativa que reforma y adiciona diversas disposiciones de la Constitución Política de los Estados Unidos Mexicanos, en materia de jornada máxima de cuarenta horas semanales y derecho a la desconexión digital",
    summary: "Reforma el Artículo 123 constitucional. Implementación gradual sin reducción salarial. Congreso tiene 90 días...",
    fuente: "Gaceta Parlamentaria",
  },
  {
    impactoItems: [{ label: "Apple", color: "#F59E0B" }],
    tag: "COMERCIO", tagColor: "bg-blue-100 text-blue-700",
    date: "23 FEB, 2026",
    title: "Decreto por el que se reforman, adicionan y derogan diversas disposiciones del Reglamento de la Ley Aduanera",
    summary: "Crea Agencias Aduanales y el Consejo Aduanero, e integra a la ANAM en la normativa...",
    fuente: "DOF",
  },
];

export default function Lens() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const total = carouselCards.length;

  const goTo = (index) => {
    if (index < 0 || index >= total) return;
    setCurrent(index);
  };

  const prev = (current - 1 + total) % total;
  const next = (current + 1) % total;

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md flex justify-end items-center px-8 py-6 border-b border-slate-200/15" style={{ backgroundColor: "rgba(247,249,251,0.8)" }}>
        <div className="flex items-center gap-4">
          <div className="relative group flex-1 max-w-2xl">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              className="border-none rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 w-64"
              style={{ backgroundColor: "#eceef0", fontFamily: "'DM Sans', sans-serif" }}
              placeholder="Buscar legislación..."
              type="text"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 p-8 gap-8" style={{ overflow: "hidden" }}>
        <section className="flex-1 min-w-0" style={{ maxWidth: "calc(100% - 280px - 2rem)", overflowX: "hidden" }}>
          <div className="mb-10">
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-bold tracking-tight text-on-surface mb-2">
              Eventos recomendados para ti
            </h1>
          </div>

          {/* Carousel */}
          <div className="relative mb-16">
            <div className="carousel-perspective">
              {carouselCards.map((card, i) => {
                let cls = "carousel-card w-full md:w-[480px] h-[420px] rounded-lg overflow-hidden shadow-2xl group cursor-pointer";
                let visible = true;
                if (i === current) cls += " card-center";
                else if (i === prev) cls += " card-fan-left";
                else if (i === next) cls += " card-fan-right";
                else visible = false;

                if (!visible) return null;
                return (
                  <div key={i} className={cls} style={{ position: "absolute" }}>
                    <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={card.img} alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Alto impacto
                      </span>
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: "#B87851", fontFamily: "'DM Sans', sans-serif" }}>
                        {card.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 backdrop-blur-sm bg-black/20">
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{card.date}</p>
                      <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-white leading-tight mb-4 line-clamp-2">{card.title}</h2>
                      <p className="text-white/80 text-sm line-clamp-2 mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>{card.summary}</p>
                      {card.eventHref && (
                        <button
                          className="bg-white text-[#0F172A] px-6 py-2 rounded-full font-bold text-xs hover:opacity-90 transition-colors flex items-center gap-2"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          onClick={() => router.push(card.eventHref)}
                        >
                          Leer más <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                className="carousel-prev absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all z-40 hover:text-white"
                style={{ color: "#B87851", opacity: current === 0 ? 0.3 : 1 }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B87851'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => goTo(current + 1)}
                disabled={current === total - 1}
                className="carousel-next absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all z-40"
                style={{ color: "#B87851", opacity: current === total - 1 ? 0.3 : 1 }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B87851'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {carouselCards.map((_, i) => (
                <span
                  key={i}
                  onClick={() => goTo(i)}
                  className="h-1.5 rounded-full cursor-pointer transition-all"
                  style={{
                    width: i === current ? "2rem" : "0.375rem",
                    backgroundColor: i === current ? "#B87851" : "#CBD5E1",
                  }}
                />
              ))}
            </div>
          </div>

          {/* News list */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold tracking-tight text-slate-500 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>EVENTOS</h3>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[#8A887F]" style={{ fontFamily: "'DM Sans', sans-serif" }}>IMPACTO</span>
                <div className="flex gap-[3px] w-[120px] h-[6px]">
                  <div className="flex-1 bg-[#22C55E] rounded-[3px]" />
                  <div className="flex-1 bg-[#EF9F27] rounded-[3px]" />
                  <div className="flex-1 bg-[#E24B4A] rounded-[3px]" />
                </div>
                <div className="flex justify-between w-[120px]">
                  <span className="text-[10px] font-semibold text-[#22C55E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Bajo</span>
                  <span className="text-[10px] font-semibold text-[#EF9F27]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Medio</span>
                  <span className="text-[10px] font-semibold text-[#E24B4A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Alto</span>
                </div>
              </div>
            </div>

            {newsItems.map((item, i) => {
              const inner = (
                <article key={i} className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex gap-6 group" style={{ backgroundColor: "#ffffff" }}>
                  <div className="flex flex-col items-center min-w-[80px] border-r border-slate-100 pr-4">
                    <p className="text-[9px] font-bold uppercase text-[#9CA3AF] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Impacto</p>
                    <div className="flex flex-col gap-2 w-full">
                      {item.impactoItems.map((imp, j) => (
                        <span key={j} className="text-white text-[10px] font-bold px-3 py-1 rounded-full text-center" style={{ backgroundColor: imp.color, fontFamily: "'DM Sans', sans-serif" }}>
                          {imp.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${item.tagColor}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {item.tag}
                      </span>
                      <time className="text-[11px] text-slate-400 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.date}</time>
                    </div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h4>
                    <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.summary}</p>
                    <div className="border-t border-[#F3F4F6] pt-2 mt-auto flex items-center gap-[6px]">
                      <span className="text-[10px] text-[#9CA3AF] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Fuente:</span>
                      <span className="text-[10px] text-[#6B7280] font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.fuente}</span>
                    </div>
                  </div>
                </article>
              );
              return item.href ? (
                <Link key={i} href={item.href} className="block">{inner}</Link>
              ) : inner;
            })}
          </div>
        </section>

        {/* Right Panel */}
        <aside className="w-[280px] flex flex-col gap-4 shrink-0">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-on-surface" style={{ fontFamily: "'Playfair Display', serif" }}>Filtros</h4>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors"
                style={{ color: "#64748B" }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ transition: "transform 0.25s ease", transform: filtersOpen ? "rotate(0deg)" : "rotate(180deg)" }}
                >
                  expand_less
                </span>
              </button>
            </div>

            {filtersOpen && (
              <>
                <FilterSection label="Grupo de Interés">
                  <div className="relative bg-[#F3F4F6] h-8 rounded-full flex p-1 items-center">
                    <div className="absolute inset-y-1 left-1 w-[calc(33.33%-4px)] bg-white rounded-full shadow-sm" />
                    <button className="flex-1 text-[10px] font-bold z-10 text-on-surface text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>Todas</button>
                    <button className="flex-1 text-[10px] font-bold z-10 text-slate-500 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>Rappi</button>
                    <button className="flex-1 text-[10px] font-bold z-10 text-slate-500 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>Apple</button>
                  </div>
                </FilterSection>

                <FilterSection label="Fuente">
                  <div className="flex flex-wrap gap-2">
                    <PillBtn active>Todas</PillBtn>
                    <PillBtn accent>DOF</PillBtn>
                    <PillBtn>CONAMER</PillBtn>
                    <PillBtn>PROFECO</PillBtn>
                  </div>
                </FilterSection>

                <FilterSection label="Tema">
                  <div className="flex flex-wrap gap-2">
                    <PillBtn active>Todas</PillBtn>
                    <PillBtn accent>Salud</PillBtn>
                    <PillBtn>Seguridad</PillBtn>
                    <PillBtn>Laboral</PillBtn>
                    <PillBtn>Economía</PillBtn>
                    <PillBtn>Gobierno</PillBtn>
                  </div>
                </FilterSection>

                <FilterSection label="Poder">
                  <div className="flex flex-wrap gap-2">
                    <PillBtn active>Todas</PillBtn>
                    <PillBtn accent>Ejecutivo</PillBtn>
                    <PillBtn>Legislativo</PillBtn>
                    <PillBtn>Judicial</PillBtn>
                  </div>
                </FilterSection>

                <FilterSection label="Nivel de gobierno">
                  <div className="flex flex-wrap gap-2">
                    <PillBtn active>Todas</PillBtn>
                    <PillBtn accent>Federal</PillBtn>
                    <PillBtn>Estatal</PillBtn>
                    <PillBtn>Local</PillBtn>
                  </div>
                </FilterSection>

                <FilterSection label="Ver desde:">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">calendar_today</span>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2" type="date" defaultValue="2023-10-15" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                </FilterSection>

                <div className="pt-2 space-y-3">
                  <button className="w-full text-white py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all" style={{ backgroundColor: "#B87851", fontFamily: "'DM Sans', sans-serif" }}>
                    Aplicar filtros
                  </button>
                  <button className="w-full text-center text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Restablecer
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 mt-2">
            <button className="w-full text-white py-3.5 rounded-full font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ backgroundColor: "#B87851", fontFamily: "'DM Sans', sans-serif" }}>
              <span className="material-symbols-outlined text-lg">download</span>
              Descargar reporte (PDF)
            </button>
            <button className="w-full border-2 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{ borderColor: "#B87851", color: "#B87851", fontFamily: "'DM Sans', sans-serif" }}>
              <span className="material-symbols-outlined text-lg">calendar_today</span>
              Descargar datos (CSV)
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

function FilterSection({ label, children }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      {children}
      <div className="border-b border-[#F3F4F6] mt-2" />
    </div>
  );
}

function PillBtn({ children, active, accent }) {
  let bg = "border border-slate-300 text-slate-600 hover:bg-slate-50";
  if (active) bg = "bg-[#0F172A] text-white";
  if (accent) bg = "text-white";
  return (
    <button
      className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${bg}`}
      style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: accent ? "#B87851" : undefined }}
    >
      {children}
    </button>
  );
}
