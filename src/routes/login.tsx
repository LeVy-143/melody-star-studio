import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles, Mail, Lock } from "lucide-react";
import { StarField } from "@/components/StarField";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@melodise.vn");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <StarField density={70} />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card animate-fade-in rounded-3xl p-8 shadow-[var(--shadow-velvet)]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-3 rounded-full bg-gold/15 p-3 ring-2 ring-gold/40 shadow-[0_0_30px_oklch(0.85_0.16_88/0.4)]">
              <Sparkles className="h-7 w-7 text-gold" />
            </div>
            <h1 className="text-gold-shimmer text-3xl font-bold tracking-wide">
              Melodise
            </h1>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Admin Panel
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input/40 py-2.5 pl-10 pr-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-input/40 py-2.5 pl-10 pr-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-gold via-amber-200 to-gold bg-[length:200%_100%] py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition hover:bg-[position:100%_0]"
            >
              Đăng nhập
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo: bấm Đăng nhập để vào Admin Panel ✨
          </p>
        </div>
      </div>
    </div>
  );
}
