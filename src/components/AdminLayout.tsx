import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { melodiseDb } from "@/lib/external-supabase";
import {
  LayoutDashboard,
  Users,
  Music2,
  ShoppingBag,
  BarChart3,
  LogOut,
  Sparkles,
} from "lucide-react";
import { StarField } from "./StarField";

const nav = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/accounts", label: "Tài khoản", icon: Users },
  { to: "/music", label: "Nhạc số", icon: Music2 },
  { to: "/orders", label: "Đơn hàng", icon: ShoppingBag },
  { to: "/reports", label: "Báo cáo", icon: BarChart3 },
];

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const signOut = async () => {
    await melodiseDb.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="relative min-h-screen">
      <StarField density={50} />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl md:flex">
          <div className="flex items-center gap-2 px-6 py-6">
            <Sparkles className="h-7 w-7 text-gold drop-shadow-[0_0_10px_oklch(0.85_0.16_88/0.7)]" />
            <div>
              <div className="text-gold-shimmer text-xl font-bold tracking-wide">
                Melodise
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Admin Panel
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-3">
            {nav.map(({ to, label, icon: Icon }) => {
              const active =
                to === "/" ? pathname === "/" : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-sidebar-accent text-gold shadow-[0_0_20px_oklch(0.85_0.16_88/0.25)]"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/40 hover:text-gold"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_oklch(0.85_0.16_88)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <Link
              to="/login"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 py-6 md:px-10 md:py-8">
          <div className="animate-fade-in mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
