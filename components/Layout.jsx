import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/lens", label: "Lens", icon: "home" },
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/grupo", label: "Grupo de interés setup", icon: "group" },
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
        {/* Logo + toggle button */}
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
            style={{
              width: 28,
              height: 28,
              color: "#64748B",
              flexShrink: 0,
            }}
          >
            <span
              className="material-symbols-outlined text-[18px] transition-transform duration-250"
              style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              chevron_left
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-hidden">
          {navLinks.map((item, i) => {
            if (item.divider) {
              return <div key={`divider-${i}`} className="mx-4 my-2 border-t-[0.5px] border-slate-200/10" />;
            }
            const { href, label, icon } = item;
            const isActive = router.pathname === href;
            return (
              <Link
                key={label}
                href={href}
                title={collapsed ? label : undefined}
                className="my-1 py-3 flex items-center transition-all"
                style={{
                  color: isActive ? "#60A5FA" : "#94A3B8",
                  borderRight: isActive ? "4px solid #B87851" : "4px solid transparent",
                  backgroundColor: isActive ? "rgba(255, 255, 255, 0.06)" : "transparent",
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
        <div className="py-4 mt-auto shrink-0" style={{ paddingLeft: collapsed ? 0 : "1.5rem", paddingRight: collapsed ? 0 : "1.5rem" }}>
          <div
            className="flex items-center rounded-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
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
        style={{
          marginLeft: w,
          transition: "margin-left 0.25s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
}
