import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Plus, Search, Edit2, Trash2, Shield, User } from "lucide-react";

export const Route = createFileRoute("/_admin/accounts")({
  component: AccountsPage,
});

const accounts = [
  { id: "AD001", name: "Nguyễn Cẩm Trân", email: "tran@melodise.vn", role: "Quản trị viên", status: "Hoạt động" },
  { id: "EM002", name: "Trần Lưu Tuyết Trân", email: "tuyet@melodise.vn", role: "Nhân viên", status: "Hoạt động" },
  { id: "EM003", name: "Lê Ngọc Tường Vy", email: "vy@melodise.vn", role: "Nhân viên", status: "Hoạt động" },
  { id: "US104", name: "vananh@gmail.com", email: "vananh@gmail.com", role: "Khách hàng", status: "Hoạt động" },
  { id: "US105", name: "Hà My", email: "hamy@gmail.com", role: "Khách hàng", status: "Khóa" },
];

function AccountsPage() {
  return (
    <>
      <PageHeader
        title="Quản lý tài khoản"
        subtitle="Thêm, chỉnh sửa và phân quyền người dùng hệ thống."
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-amber-300 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> Thêm tài khoản
          </button>
        }
      />

      <div className="glass-card rounded-2xl p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Tìm theo tên, email, mã..."
              className="w-full rounded-lg border border-border bg-input/40 py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select className="rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-gold focus:outline-none">
            <option>Tất cả vai trò</option>
            <option>Quản trị viên</option>
            <option>Nhân viên</option>
            <option>Khách hàng</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-3">Mã</th>
                <th className="px-3 py-3">Họ tên</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Vai trò</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border/50 transition hover:bg-gold/5"
                >
                  <td className="px-3 py-3 font-mono text-xs text-gold">{a.id}</td>
                  <td className="px-3 py-3 font-medium">{a.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{a.email}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/30 px-2.5 py-0.5 text-xs">
                      {a.role === "Quản trị viên" ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {a.role}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        a.status === "Hoạt động"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-destructive/20 text-destructive-foreground"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <button className="rounded-md p-1.5 text-muted-foreground transition hover:bg-gold/15 hover:text-gold">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/20 hover:text-destructive-foreground">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
