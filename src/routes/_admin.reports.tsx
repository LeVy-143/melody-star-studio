import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Download, TrendingUp, Music2 } from "lucide-react";

export const Route = createFileRoute("/_admin/reports")({
  component: ReportsPage,
});

const monthly = [
  { month: "T1", revenue: 42 },
  { month: "T2", revenue: 51 },
  { month: "T3", revenue: 58 },
  { month: "T4", revenue: 67 },
  { month: "T5", revenue: 82 },
];

const top = [
  { title: "Sao Sáng", artist: "Lan Anh", sold: 412, revenue: "10.3M" },
  { title: "Đêm Nhung", artist: "Velvet Crew", sold: 388, revenue: "7.7M" },
  { title: "Giai Điệu Vàng", artist: "Minh Khôi", sold: 301, revenue: "9.0M" },
  { title: "Vũ Trụ Của Em", artist: "Starlight", sold: 254, revenue: "5.5M" },
];

function ReportsPage() {
  const max = Math.max(...monthly.map((m) => m.revenue));

  return (
    <>
      <PageHeader
        title="Báo cáo"
        subtitle="Doanh thu, nhạc bán chạy và xu hướng kinh doanh."
        actions={
          <button className="flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/20">
            <Download className="h-4 w-4" /> Xuất báo cáo
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h2 className="text-lg font-semibold">Doanh thu theo tháng (triệu ₫)</h2>
          </div>
          <div className="flex h-64 items-end gap-4">
            {monthly.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-accent via-gold/60 to-gold shadow-[0_-4px_20px_oklch(0.85_0.16_88/0.4)] transition-all hover:from-gold hover:to-amber-200"
                    style={{ height: `${(m.revenue / max) * 100}%` }}
                  >
                    <div className="-mt-6 text-center text-xs font-bold text-gold">
                      {m.revenue}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <Music2 className="h-5 w-5 text-gold" />
            <h2 className="text-lg font-semibold">Top bài bán chạy</h2>
          </div>
          <ol className="space-y-3">
            {top.map((t, i) => (
              <li
                key={t.title}
                className="flex items-center gap-3 rounded-lg border border-transparent p-2 transition hover:border-gold/30 hover:bg-gold/5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.artist}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gold">{t.revenue}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {t.sold} bán
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
