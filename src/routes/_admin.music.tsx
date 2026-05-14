import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Plus, Music2, Edit2, Trash2, Disc3 } from "lucide-react";

export const Route = createFileRoute("/_admin/music")({
  component: MusicPage,
});

const tracks = [
  { id: "T001", title: "Sao Sáng", artist: "Lan Anh", category: "Pop", price: 25000, status: "Đang bán" },
  { id: "T002", title: "Đêm Nhung", artist: "Velvet Crew", category: "R&B", price: 20000, status: "Đang bán" },
  { id: "T003", title: "Giai Điệu Vàng", artist: "Minh Khôi", category: "Acoustic", price: 30000, status: "Đang bán" },
  { id: "T004", title: "Bầu Trời Xanh", artist: "Hà My", category: "Indie", price: 18000, status: "Bản nháp" },
  { id: "T005", title: "Vũ Trụ Của Em", artist: "Starlight", category: "Pop", price: 22000, status: "Đang bán" },
  { id: "T006", title: "Lời Thì Thầm", artist: "Lan Anh", category: "Ballad", price: 28000, status: "Ngừng bán" },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function MusicPage() {
  return (
    <>
      <PageHeader
        title="Quản lý nhạc số"
        subtitle="Thêm bài hát, cập nhật giá và quản lý danh mục."
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-amber-300 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> Thêm bài hát
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((t) => (
          <div
            key={t.id}
            className="glass-card group relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-1 hover:border-gold/50"
          >
            <div className="flex items-start gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold/40 via-accent/40 to-primary/30 ring-2 ring-gold/30">
                <Disc3 className="h-8 w-8 text-gold animate-spin [animation-duration:8s] group-hover:[animation-duration:2s]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] text-gold/70">{t.id}</div>
                <div className="truncate text-lg font-semibold">{t.title}</div>
                <div className="truncate text-sm text-muted-foreground">
                  {t.artist}
                </div>
                <div className="mt-1 inline-block rounded-full bg-accent/30 px-2 py-0.5 text-[10px] uppercase tracking-wider">
                  <Music2 className="mr-1 inline h-2.5 w-2.5" />
                  {t.category}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div>
                <div className="text-lg font-bold text-gold">{fmt(t.price)}</div>
                <div
                  className={`mt-0.5 text-[10px] uppercase tracking-wider ${
                    t.status === "Đang bán"
                      ? "text-emerald-300"
                      : t.status === "Bản nháp"
                        ? "text-amber-300"
                        : "text-destructive-foreground"
                  }`}
                >
                  {t.status}
                </div>
              </div>
              <div className="flex gap-1">
                <button className="rounded-md p-2 text-muted-foreground transition hover:bg-gold/15 hover:text-gold">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/20 hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
