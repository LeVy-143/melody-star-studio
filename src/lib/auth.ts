import { melodiseDb } from "./external-supabase";

// 3 vai trò theo yêu cầu nghiệp vụ
export type Role = "admin" | "producer" | "sales";

export type AuthUser = {
  user_id: string | number;
  email: string;
  name: string;
  role: Role;
  rawRole: string; // chuỗi gốc từ DB để hiển thị
};

const STORAGE_KEY = "melodise-current-user";

// Map chuỗi role từ DB → role key chuẩn hoá
function normalizeRole(raw: string | null | undefined): Role | null {
  const s = (raw ?? "").toLowerCase().trim();
  if (!s) return null;
  if (s.includes("cấp cao") || s.includes("cap cao") || s === "admin" || s.includes("quản lí") || s.includes("quan li") || s.includes("quản lý"))
    return "admin";
  if (s.includes("sản xuất") || s.includes("san xuat") || s.includes("producer") || s.includes("production"))
    return "producer";
  if (s.includes("kinh doanh") || s.includes("sales") || s.includes("business"))
    return "sales";
  return null;
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Quản lí cấp cao",
  producer: "Nhân viên sản xuất",
  sales: "Nhân viên kinh doanh",
};

// Ma trận quyền: tab → vai trò được vào
// Lưu ý: với sales, "music" là tra cứu (read-only) — guard riêng bằng canEditMusic
export const PERMISSIONS: Record<Role, string[]> = {
  admin: ["accounts", "music", "orders", "reports"],
  producer: ["music"],
  sales: ["music", "reports"],
};

export function hasPermission(user: AuthUser | null, tab: string): boolean {
  if (!user) return false;
  return PERMISSIONS[user.role]?.includes(tab) ?? false;
}

// Sales chỉ được TRA CỨU nhạc, không được thêm/sửa/xoá
export function canEditMusic(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === "admin" || user.role === "producer";
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  if (!email.trim() || !password.trim()) {
    return { ok: false, error: "Vui lòng nhập đầy đủ thông tin" };
  }
  const { data, error } = await melodiseDb.rpc("verify_login", {
    p_email: email.trim(),
    p_password: password,
  });
  if (error) {
    return {
      ok: false,
      error:
        "Không gọi được hàm xác thực (verify_login). Hãy chạy đoạn SQL được hướng dẫn trong dashboard Supabase.",
    };
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { ok: false, error: "Email hoặc mật khẩu không chính xác" };

  const role = normalizeRole(row.role);
  if (!role) {
    return {
      ok: false,
      error: `Vai trò "${row.role ?? "không xác định"}" chưa được hỗ trợ.`,
    };
  }

  const user: AuthUser = {
    user_id: row.user_id,
    email: row.email,
    name: row.full_name ?? row.email,
    role,
    rawRole: row.role ?? ROLE_LABEL[role],
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return { ok: true, user };
}

export function signOut() {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
