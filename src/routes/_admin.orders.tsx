import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Check, X, Eye, Music2, FileText, Save } from "lucide-react";

export const Route = createFileRoute("/_admin/orders")({
  component: OrdersPage,
});

type OrderStatus = "Chờ duyệt" | "Đã phê duyệt" | "Từ chối";

type OrderItem = { title: string; artist: string; price: number };

type Order = {
  id: string;
  customer: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  license?: string;
};

const initialOrders: Order[] = [
  {
    id: "OD2026-0142",
    customer: "Phạm Minh Khôi",
    email: "khoi@gmail.com",
    items: [
      { title: "Sao Sáng", artist: "Lan Anh", price: 25000 },
      { title: "Đêm Nhung", artist: "Velvet Crew", price: 20000 },
      { title: "Giai Điệu Vàng", artist: "Minh Khôi", price: 30000 },
    ],
    total: 75000,
    status: "Chờ duyệt",
    date: "14/05/2026",
  },
  {
    id: "OD2026-0141",
    customer: "Hà My",
    email: "hamy@gmail.com",
    items: [{ title: "Bầu Trời Xanh", artist: "Hà My", price: 18000 }],
    total: 18000,
    status: "Đã phê duyệt",
    date: "14/05/2026",
    license: "LIC-2026-0141 — Cấp phép sử dụng cá nhân, không thương mại.",
  },
  {
    id: "OD2026-0140",
    customer: "Nguyễn Thị Vân Anh",
    email: "vananh@gmail.com",
    items: [
      { title: "Vũ Trụ Của Em", artist: "Starlight", price: 22000 },
      { title: "Lời Thì Thầm", artist: "Lan Anh", price: 28000 },
    ],
    total: 50000,
    status: "Chờ duyệt",
    date: "13/05/2026",
  },
  {
    id: "OD2026-0139",
    customer: "Trần Lan",
    email: "lan@gmail.com",
    items: [
      { title: "Sao Sáng", artist: "Lan Anh", price: 25000 },
      { title: "Đêm Nhung", artist: "Velvet Crew", price: 20000 },
      { title: "Giai Điệu Vàng", artist: "Minh Khôi", price: 30000 },
      { title: "Bầu Trời Xanh", artist: "Hà My", price: 18000 },
      { title: "Vũ Trụ Của Em", artist: "Starlight", price: 32000 },
    ],
    total: 125000,
    status: "Đã phê duyệt",
    date: "13/05/2026",
    license: "LIC-2026-0139 — Cấp phép phát sóng nội bộ trong 12 tháng.",
  },
  {
    id: "OD2026-0138",
    customer: "Đỗ Phan",
    email: "fan@gmail.com",
    items: [{ title: "Lời Thì Thầm", artist: "Lan Anh", price: 30000 }],
    total: 30000,
    status: "Từ chối",
    date: "12/05/2026",
  },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [viewing, setViewing] = useState<Order | null>(null);
  const [licensing, setLicensing] = useState<Order | null>(null);
  const [licenseText, setLicenseText] = useState("");

  const openLicense = (o: Order) => {
    setLicenseText(
      `LIC-${o.id.replace("OD", "")} — Cấp phép sử dụng cho ${o.customer} đối với ${o.items.length} bài hát. Hiệu lực từ ngày phê duyệt.`,
    );
    setLicensing(o);
  };

  const confirmLicense = () => {
    if (!licensing) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === licensing.id
          ? { ...o, status: "Đã phê duyệt", license: licenseText }
          : o,
      ),
    );
    setLicensing(null);
  };

  const reject = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Từ chối" } : o)),
    );
  };

  return (
    <>
      <PageHeader
        title="Đơn hàng & Cấp quyền"
        subtitle="Duyệt đơn thanh toán, ghi giấy phép và cấp quyền truy cập tài nguyên nhạc số."
      />

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Bài hát</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Phê duyệt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-border/40 align-top transition hover:bg-gold/5"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gold">{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <ul className="space-y-1">
                      {o.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Music2 className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                          <span>
                            <span className="font-medium">{it.title}</span>
                            <span className="text-xs text-muted-foreground"> — {it.artist}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {o.items.length} bài
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gold">
                    {fmt(o.total)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        o.status === "Đã phê duyệt"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : o.status === "Chờ duyệt"
                            ? "bg-amber-400/15 text-amber-200"
                            : "bg-destructive/20 text-destructive-foreground"
                      }`}
                    >
                      {o.status}
                    </span>
                    {o.license && (
                      <div className="mt-1 flex items-start gap-1 text-[10px] text-muted-foreground">
                        <FileText className="mt-0.5 h-2.5 w-2.5 text-gold" />
                        <span className="line-clamp-2">{o.license}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setViewing(o)}
                        className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent/40 hover:text-foreground"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {o.status === "Chờ duyệt" && (
                        <>
                          <button
                            onClick={() => openLicense(o)}
                            className="rounded-md p-1.5 text-emerald-300 transition hover:bg-emerald-500/20"
                            title="Phê duyệt & cấp giấy phép"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => reject(o.id)}
                            className="rounded-md p-1.5 text-destructive-foreground transition hover:bg-destructive/25"
                            title="Từ chối"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <Modal onClose={() => setViewing(null)} title={`Chi tiết đơn ${viewing.id}`}>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Khách hàng</div>
              <div className="font-medium">{viewing.customer} — {viewing.email}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Danh sách bài hát</div>
              <ul className="mt-1 divide-y divide-border/40 rounded-lg border border-border/40">
                {viewing.items.map((it, i) => (
                  <li key={i} className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Music2 className="h-3.5 w-3.5 text-gold" />
                      <span className="font-medium">{it.title}</span>
                      <span className="text-xs text-muted-foreground">— {it.artist}</span>
                    </div>
                    <span className="text-gold">{fmt(it.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Tổng cộng</span>
              <span className="font-bold text-gold">{fmt(viewing.total)}</span>
            </div>
            {viewing.license && (
              <div className="rounded-lg border border-gold/30 bg-gold/5 p-3">
                <div className="mb-1 flex items-center gap-1 text-xs uppercase tracking-wider text-gold">
                  <FileText className="h-3 w-3" /> Giấy phép
                </div>
                <div className="text-xs">{viewing.license}</div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {licensing && (
        <Modal onClose={() => setLicensing(null)} title={`Cấp giấy phép — ${licensing.id}`}>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border/60 bg-sidebar/40 p-3 text-xs">
              <div className="text-muted-foreground">Khách hàng</div>
              <div className="mb-2 font-medium text-foreground">{licensing.customer} — {licensing.email}</div>
              <div className="text-muted-foreground">Bài hát ({licensing.items.length})</div>
              <ul className="mt-1 space-y-0.5">
                {licensing.items.map((it, i) => (
                  <li key={i}>• {it.title} — {it.artist}</li>
                ))}
              </ul>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                Nội dung giấy phép
              </label>
              <textarea
                value={licenseText}
                onChange={(e) => setLicenseText(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-border bg-background/40 p-3 text-sm focus:border-gold focus:outline-none"
                placeholder="Ghi rõ phạm vi sử dụng, thời hạn, điều khoản..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setLicensing(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent/30"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmLicense}
                disabled={!licenseText.trim()}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-amber-300 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition hover:scale-[1.02] disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Phê duyệt & lưu giấy phép
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-lg rounded-2xl border border-gold/30 p-5 shadow-[var(--shadow-gold)]"
      >
        <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-gold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent/30 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
