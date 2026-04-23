import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const LENS_GROUP = ["/lens", "/dashboard", "/grupo"];

const navLinks = [
  { href: "/lens", label: "Lens", icon: "home" },
  { href: "/dashboard", label: "Dashboard", subitem: true },
  { href: "/grupo", label: "Grupo de interés", subitem: true },
  { divider: true },
  { href: "/echo", label: "Echo", icon: "sensors" },
  { href: "/tracker", label: "Tracker", icon: "account_tree" },
];

const SIDEBAR_W = 220;
const SIDEBAR_W_COLLAPSED = 60;

export default function Layout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lensOpen, setLensOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("orbit_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("orbit_sidebar_collapsed", String(next));
  };

  const w = mounted ? (collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W) : SIDEBAR_W;
  const inLensGroup = LENS_GROUP.includes(router.pathname);

  return (
    <div className="flex min-h-screen">
      <aside
        className="h-screen fixed left-0 top-0 flex flex-col z-50 shadow-xl"
        style={{
          backgroundColor: "#121212",
          width: w,
          transition: "width 0.25s ease",
          overflow: "hidden",
        }}
      >
        {/* Logo + toggle */}
        <div
          className="flex items-center py-8 shrink-0"
          style={{
            paddingLeft: collapsed ? 0 : "1.5rem",
            paddingRight: collapsed ? 0 : "1rem",
            justifyContent: collapsed ? "center" : "space-between",
            minHeight: 88,
          }}
        >
          {!collapsed && (
            <span
              className="text-2xl font-bold tracking-tight select-none whitespace-nowrap"
              style={{ color: "#B87851", fontFamily: "'DM Sans', sans-serif" }}
            >
              ● orbit
            </span>
          )}
          <button
            onClick={toggle}
            title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            className="flex items-center justify-center rounded-md transition-colors hover:bg-white/10"
            style={{ width: 28, height: 28, color: "#64748B", flexShrink: 0 }}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ transition: "transform 0.25s ease", transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              chevron_left
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-hidden">
          {navLinks.map((item, i) => {
            if (item.divider) {
              return <div key={`d-${i}`} className="mx-4 my-2 border-t-[0.5px] border-slate-200/10" />;
            }

            if (item.subitem) {
              if (collapsed || !inLensGroup || !lensOpen) return null;
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 py-1.5 transition-all"
                  style={{
                    paddingLeft: "3.5rem",
                    paddingRight: "1.5rem",
                    color: isActive ? "#60A5FA" : "#64748B",
                    borderRight: isActive ? "3px solid #B87851" : "3px solid transparent",
                    backgroundColor: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                  }}
                >
                  <span
                    className="w-1 h-1 rounded-full shrink-0"
                    style={{ backgroundColor: isActive ? "#60A5FA" : "#475569" }}
                  />
                  <span
                    className="text-xs tracking-wide font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            }

            const { href, label, icon } = item;
            const isActive = router.pathname === href || (href === "/lens" && inLensGroup && router.pathname !== "/echo" && router.pathname !== "/tracker");
            const isLens = href === "/lens";

            if (isLens && !collapsed) {
              return (
                <div
                  key={label}
                  className="my-0.5 flex items-center transition-all"
                  style={{
                    color: isActive ? "#60A5FA" : "#94A3B8",
                    borderRight: isActive ? "4px solid #B87851" : "4px solid transparent",
                    backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  }}
                >
                  <Link
                    href={href}
                    onClick={() => setLensOpen(true)}
                    className="flex items-center gap-3 py-3 flex-1 min-w-0"
                    style={{ paddingLeft: "2.5rem", color: "inherit" }}
                  >
                    <span className="material-symbols-outlined text-xl shrink-0">{icon}</span>
                    <span
                      className="text-sm tracking-wide font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </span>
                  </Link>
                  <button
                    onClick={() => setLensOpen((o) => !o)}
                    className="py-3 pr-4 pl-2 shrink-0 hover:text-white transition-colors"
                    style={{ color: "#475569", fontSize: 16, lineHeight: 1 }}
                    title={lensOpen ? "Colapsar menú" : "Expandir menú"}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ transition: "transform 0.2s ease", transform: lensOpen ? "rotate(90deg)" : "rotate(0deg)", display: "block" }}
                    >
                      chevron_right
                    </span>
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={label}
                href={href}
                onClick={isLens ? () => setLensOpen(true) : undefined}
                title={collapsed ? label : undefined}
                className="my-0.5 py-3 flex items-center transition-all"
                style={{
                  color: isActive ? "#60A5FA" : "#94A3B8",
                  borderRight: isActive ? "4px solid #B87851" : "4px solid transparent",
                  backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  paddingLeft: collapsed ? 0 : "2.5rem",
                  paddingRight: collapsed ? 0 : "1.5rem",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: collapsed ? 0 : "0.75rem",
                  minWidth: 0,
                }}
              >
                <span className="material-symbols-outlined text-xl shrink-0">{icon}</span>
                {!collapsed && (
                  <span
                    className="text-sm tracking-wide font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div
          className="py-4 mt-auto shrink-0"
          style={{ paddingLeft: collapsed ? 0 : "1.5rem", paddingRight: collapsed ? 0 : "1.5rem" }}
        >
          <div
            className="flex items-center rounded-lg"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              padding: "0.5rem",
              gap: collapsed ? 0 : "0.75rem",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
              style={{ backgroundColor: "#B87851" }}
              title={collapsed ? "Juan Delgado · Analista Senior" : undefined}
            >
              JD
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Juan Delgado
                  </p>
                  <span className="material-symbols-outlined text-slate-500 text-[18px] cursor-pointer hover:text-white transition-colors">
                    settings
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Analista Senior
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main
        className="min-h-screen flex flex-col w-full bg-surface"
        style={{ marginLeft: w, transition: "margin-left 0.25s ease" }}
      >
        {children}
      </main>
    </div>
  );
}
