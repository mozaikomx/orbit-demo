import { useState, useEffect } from "react";
import { useRouter } from "next/router";
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ActoresGuardados() {
  const router = useRouter();
  const [actores, setActores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch("/api/actores")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setActores(data);
        else setError(data.error || "Error al cargar actores");
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("¿Eliminar este actor guardado?")) return;
    setDeleting(id);
    await fetch(`/api/actores?id=${id}`, { method: "DELETE" });
    setActores((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  };

  return (
    <div className="w-full px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-slate-900 mb-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Actores guardados
          </h1>
          <p className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {actores.length} {actores.length === 1 ? "actor guardado" : "actores guardados"}
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="w-5 h-5 border-2 border-[#B87851] border-t-transparent rounded-full animate-spin" />
            Cargando...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {error}
          </div>
        )}

        {!loading && !error && actores.length === 0 && (
          <div className="text-center py-20 text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="material-symbols-outlined text-5xl mb-4 block" style={{ color: "#CBD5E1" }}>bookmark</span>
            <p className="text-sm">No hay actores guardados todavía.</p>
            <p className="text-xs mt-1">Investiga un actor en Tracker y guárdalo.</p>
          </div>
        )}

        <div className="space-y-3">
          {actores.map((actor) => {
            const perfil = actor.perfil || {};
            return (
              <div
                key={actor.id}
                onClick={() => router.push(`/tracker?actor=${actor.id}`)}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-[#B87851]/40 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: "#B87851" }}
                >
                  {(perfil.nombre || actor.nombre).split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {perfil.nombre || actor.nombre}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {perfil.cargo && (
                      <span className="text-xs text-slate-400 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {perfil.cargo}
                      </span>
                    )}
                    {perfil.partido && (
                      <>
                        <span className="text-slate-200">·</span>
                        <span className="text-xs font-bold" style={{ color: "#B87851", fontFamily: "'DM Sans', sans-serif" }}>
                          {perfil.partido}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400 whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {formatDate(actor.created_at)}
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, actor.id)}
                    disabled={deleting === actor.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ color: "#EF4444" }}>
                      {deleting === actor.id ? "hourglass_empty" : "delete"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
  );
}
