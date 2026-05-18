// Local auth — danh sách tài khoản cố định theo use case
export type Role = "admin" | "staff";

export type AuthUser = {
  email: string;
  name: string;
  role: Role;
};

type AccountRecord = AuthUser & { password: string };

const ACCOUNTS: AccountRecord[] = [
  { email: "admin@melodise.vn", password: "admin123", name: "Nguyễn Cẩm Trân", role: "admin" },
  { email: "staff@melodise.vn", password: "staff123", name: "Trần Lưu Tuyết Trân", role: "staff" },
];

const STORAGE_KEY = "melodise-current-user";

// Quyền truy cập từng tab cho mỗi vai trò
export const PERMISSIONS: Record<Role, string[]> = {
  admin: ["dashboard", "accounts", "music", "orders", "reports"],
  staff: ["dashboard", "music", "orders"],
};

export function signIn(email: string, password: string): { ok: true; user: AuthUser } | { ok: false; error: string } {
  if (!email.trim() || !password.trim()) {
    return { ok: false, error: "Vui lòng nhập đầy đủ thông tin" };
  }
  const acc = ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
  );
  if (!acc) return { ok: false, error: "Email hoặc mật khẩu không chính xác" };
  const user: AuthUser = { email: acc.email, name: acc.name, role: acc.role };
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

export function hasPermission(user: AuthUser | null, tab: string): boolean {
  if (!user) return false;
  return PERMISSIONS[user.role]?.includes(tab) ?? false;
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Quản trị viên",
  staff: "Nhân viên",
};
