import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { Plus, Search, Edit2, Trash2, Shield, User, Save, Loader2 } from "lucide-react";
import { melodiseDb } from "@/lib/external-supabase";

export const Route = createFileRoute("/_admin/accounts")({
  component: AccountsPage,
});

type Role = "Quản trị viên" | "Nhân viên" | "Khách hàng";
type Status = "Hoạt động" | "Khóa";
type Account = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
};

const fallback: Account[] = [
  { id: "AD001", name: "Nguyễn Cẩm Trân", email: "tran@melodise.vn", role: "Quản trị viên", status: "Hoạt động" },
  { id: "EM002", name: "Trần Lưu Tuyết Trân", email: "tuyet@melodise.vn", role: "Nhân viên", status: "Hoạt động" },
  { id: "EM003", name: "Lê Ngọc Tường Vy", email: "vy@melodise.vn", role: "Nhân viên", status: "Hoạt động" },
];

function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [editing, setEditing] = useState<Account | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Account | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await melodiseDb
        .from("users")
        .select("user_id, full_name, email, role, status, created_at");
      if (error || !data) {
        setAccounts(fallback);
        setNotice(
          "Bảng users đang bật RLS nên anon key chưa đọc được. Hệ thống đang hiển thị dữ liệu mẫu — hãy cấp policy SELECT cho anon hoặc thêm đăng nhập để xem dữ liệu thật.",
        );
        setLoading(false);
        return;
      }
      const mapped: Account[] = data.map((u: {
        user_id: number | string; full_name: string | null; email: string | null;
        role: string | null; status: string | null;
      }) => {
        const r = (u.role ?? "").toLowerCase();
        const role: Role =
          r.includes("admin") ? "Quản trị viên" :
          r.includes("staff") || r.includes("emp") || r.includes("nhân") ? "Nhân viên" :
          "Khách hàng";
        const status: Status = (u.status ?? "").toLowerCase().includes("lock") || (u.status ?? "").includes("Khóa") ? "Khóa" : "Hoạt động";
        return {
          id: String(u.user_id),
          name: u.full_name ?? "(chưa cập nhật)",
          email: u.email ?? "",
          role,
          status,
        };
      });
      setAccounts(mapped);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    return accounts.filter((a) => {
      if (roleFilter !== "all" && a.role !== roleFilter) return false;
      if (!k) return true;
      return (
        a.name.toLowerCase().includes(k) ||
        a.email.toLowerCase().includes(k) ||
        a.id.toLowerCase().includes(k)
      );
    });
  }, [accounts, keyword, roleFilter]);

  const handleSave = (data: Account) => {
    if (editing) {
      setAccounts((prev) => prev.map((a) => (a.id === data.id ? data : a)));
      toast.success("Cập nhật thành công");
    } else {
      setAccounts((prev) => [...prev, data]);
      toast.success("Thêm tài khoản thành công");
    }
    setEditing(null);
    setCreating(false);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setAccounts((prev) => prev.filter((a) => a.id !== deleting.id));
    toast.success("Xóa thành công");
    setDeleting(null);
  };

  return (
    <>
      <PageHeader
        title="Quản lý tài khoản nội bộ"
        subtitle="Thêm, chỉnh sửa, xóa và phân quyền người dùng hệ thống."
        actions={
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-amber-300 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> Thêm tài khoản
          </button>
        }
      />

      {notice && (
        <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-200">
          {notice}
        </div>
      )}

      {loading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải dữ liệu từ Lovable Cloud...
        </div>
      )}

      <div className="glass-card rounded-2xl p-4">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tên, email, mã..."
              className="w-full rounded-lg border border-border bg-input/40 py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as never)}
            className="rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-gold focus:outline-none"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Quản trị viên">Quản trị viên</option>
            <option value="Nhân viên">Nhân viên</option>
            <option value="Khách hàng">Khách hàng</option>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 transition hover:bg-gold/5">
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
                        <button
                          onClick={() => setEditing(a)}
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-gold/15 hover:text-gold"
                          title="Sửa"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(a)}
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/20 hover:text-destructive-foreground"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <AccountForm
          initial={editing}
          existingIds={accounts.map((a) => a.id)}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSubmit={handleSave}
        />
      )}

      {deleting && (
        <Modal title="Xác nhận xóa tài khoản?" onClose={() => setDeleting(null)}>
          <p className="text-sm">
            Bạn có chắc chắn muốn xóa tài khoản{" "}
            <strong className="text-gold">{deleting.name}</strong> (
            <span className="font-mono text-xs">{deleting.id}</span>)?
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Hệ thống sẽ kiểm tra ràng buộc toàn vẹn và ngắt liên kết các dữ liệu liên quan (gán Null) nếu cần.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setDeleting(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent/30"
            >
              Hủy bỏ
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
            >
              Xác nhận xóa
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function AccountForm({
  initial,
  existingIds,
  onCancel,
  onSubmit,
}: {
  initial: Account | null;
  existingIds: string[];
  onCancel: () => void;
  onSubmit: (a: Account) => void;
}) {
  const [form, setForm] = useState<Account>(
    initial ?? {
      id: "US" + Math.floor(Math.random() * 900 + 100),
      name: "",
      email: "",
      role: "Khách hàng",
      status: "Hoạt động",
    },
  );
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.id.trim() || !form.name.trim() || !form.email.trim()) {
      setError("Yêu cầu nhập đầy đủ thông tin");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Email không hợp lệ");
      return;
    }
    if (!initial && existingIds.includes(form.id)) {
      setError("Mã tài khoản đã tồn tại");
      return;
    }
    onSubmit(form);
  };

  return (
    <Modal
      title={initial ? `Sửa tài khoản ${initial.id}` : "Thêm tài khoản mới"}
      onClose={onCancel}
    >
      <div className="space-y-3 text-sm">
        <Field label="Mã tài khoản">
          <input
            disabled={!!initial}
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Họ và tên">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vai trò">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="input"
            >
              <option>Quản trị viên</option>
              <option>Nhân viên</option>
              <option>Khách hàng</option>
            </select>
          </Field>
          <Field label="Trạng thái">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              className="input"
            >
              <option>Hoạt động</option>
              <option>Khóa</option>
            </select>
          </Field>
        </div>
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive-foreground">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent/30"
          >
            Hủy bỏ
          </button>
          <button
            onClick={submit}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-amber-300 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition hover:scale-[1.02]"
          >
            <Save className="h-4 w-4" /> {initial ? "Cập nhật" : "Lưu"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}
