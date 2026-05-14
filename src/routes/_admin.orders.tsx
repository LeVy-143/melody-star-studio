import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Check, X, Eye } from "lucide-react";

export const Route = createFileRoute("/_admin/orders")({
  component: OrdersPage,
});

const orders = [
  { id: "OD2026-0142", user: "khoi@gmail.com", items: 3, total: 75000, status: "Chờ duyệt", date: "14/05/2026" },
  { id: "OD2026-0141", user: "hamy@gmail.com", items: 1, total: 18000, status: "Đã cấp quyền", date: "14/05/2026" },
  { id: "OD2026-0140", user: "user@gmail.com", items: 2, total: 50000, status: "Chờ duyệt", date: "13/05/2026" },
  { id: "OD2026-0139", user: "lan@gmail.com", items: 5, total: 125000, status: "Đã cấp quyền", date: "13/05/2026" },
  { id: "OD2026-0138", user: "fan@gmail.com", items: 1, total: 30000, status: "Từ chối", date: "12/05/2026" },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function OrdersPage() {
  return (
    <>
      <PageHeader
        title="Đơn hàng & Cấp quyền"
        subtitle="Duyệt đơn thanh toán và cấp quyền truy cập tài nguyên nhạc số."
      />

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Số bài</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-border/40 transition hover:bg-gold/5"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gold">{o.id}</td>
                  <td className="px-4 py-3">{o.user}</td>
                  <td className="px-4 py-3">{o.items}</td>
                  <td className="px-4 py-3 font-semibold text-gold">
                    {fmt(o.total)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        o.status === "Đã cấp quyền"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : o.status === "Chờ duyệt"
                            ? "bg-amber-400/15 text-amber-200"
                            : "bg-destructive/20 text-destructive-foreground"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent/40 hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                      {o.status === "Chờ duyệt" && (
                        <>
                          <button className="rounded-md p-1.5 text-emerald-300 transition hover:bg-emerald-500/20">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="rounded-md p-1.5 text-destructive-foreground transition hover:bg-destructive/25">
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
    </>
  );
}
