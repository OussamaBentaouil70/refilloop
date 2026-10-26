import { adminStorageKeys, adminSeedUsers, type AdminRole, type AdminUser } from "@/admin/mock-data";

export type AdminLoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type AdminSignUpInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: AdminRole;
};

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function passwordStrength(password: string) {
  if (!password) return { score: 0, label: "Empty" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[Math.min(score, labels.length - 1)] };
}

export function validatePassword(password: string) {
  const strength = passwordStrength(password);
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message: "Use at least 8 characters, including one uppercase letter, one number, and one symbol.",
      strength,
    };
  }

  return { valid: true, message: "Strong password", strength };
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function hashPassword(password: string, salt?: string) {
  const textSalt = salt ?? crypto.getRandomValues(new Uint8Array(16)).reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
  const encoded = new TextEncoder().encode(`${textSalt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  const hash = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return { hash, salt: textSalt };
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureAdminSeed() {
  const existing = readLocal<AdminUser[]>(adminStorageKeys.users, []);
  if (existing.length > 0) return existing;

  const seeded = adminSeedUsers.map((user) => ({ ...user, passwordHash: "", passwordSalt: "" }));
  writeLocal(adminStorageKeys.users, seeded);
  return seeded;
}

export async function seedAdminAccounts() {
  const users = ensureAdminSeed();
  const update = [...users];
  let changed = false;

  for (const user of update) {
    if (!user.passwordHash || !user.passwordSalt) {
      const { hash, salt } = await hashPassword("Admin123!");
      user.passwordHash = hash;
      user.passwordSalt = salt;
      changed = true;
    }
  }

  if (changed) {
    writeLocal(adminStorageKeys.users, update);
  }

  return update;
}

export function getStoredAdminUsers(): AdminUser[] {
  const users = ensureAdminSeed();
  const needsSeed = users.some((user) => !user.passwordHash || !user.passwordSalt);
  if (!needsSeed) return users;

  const seeded = users.map((user) => ({
    ...user,
    passwordHash: user.passwordHash || "",
    passwordSalt: user.passwordSalt || "",
  }));
  writeLocal(adminStorageKeys.users, seeded);
  return seeded;
}

export async function createAdminAccount(input: AdminSignUpInput): Promise<AdminUser> {
  const trimmedEmail = input.email.trim().toLowerCase();
  const users = getStoredAdminUsers();
  if (users.some((user) => user.email.toLowerCase() === trimmedEmail)) {
    throw new Error("An admin account with this email already exists.");
  }

  const passwordResult = validatePassword(input.password);
  if (!passwordResult.valid) {
    throw new Error(passwordResult.message);
  }

  if (input.password !== input.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const { hash, salt } = await hashPassword(input.password);
  const newAdmin: AdminUser = {
    id: `admin-${Date.now()}`,
    name: input.name.trim(),
    email: trimmedEmail,
    role: input.role,
    status: "Active",
    createdAt: new Date().toISOString(),
    lastLogin: "",
    emailVerified: false,
    twoFactorEnabled: false,
    passwordHash: hash,
    passwordSalt: salt,
  };

  writeLocal(adminStorageKeys.users, [...users, newAdmin]);
  return newAdmin;
}

export async function signInAdmin(input: AdminLoginInput) {
  const users = await seedAdminAccounts();
  const account = users.find((user) => user.email.toLowerCase() === input.email.trim().toLowerCase());
  if (!account) {
    throw new Error("No admin account matches this email.");
  }

  const { hash } = await hashPassword(input.password, account.passwordSalt);
  if (hash !== account.passwordHash) {
    throw new Error("Incorrect password.");
  }

  const session = {
    userId: account.id,
    rememberMe: !!input.rememberMe,
    expiresAt: input.rememberMe ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() : new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
  };

  writeLocal(adminStorageKeys.session, session);
  const updatedUser: AdminUser = { ...account, lastLogin: new Date().toISOString() };
  const nextUsers = users.map((user) => (user.id === account.id ? updatedUser : user));
  writeLocal(adminStorageKeys.users, nextUsers);
  return updatedUser;
}

export function getStoredAdminSession() {
  return readLocal<{ userId: string; rememberMe: boolean; expiresAt: string } | null>(adminStorageKeys.session, null);
}

export function signOutAdmin() {
  localStorage.removeItem(adminStorageKeys.session);
}

export function getAdminUserById(id: string) {
  return getStoredAdminUsers().find((user) => user.id === id) ?? null;
}

export function getCurrentAdminUser(): AdminUser | null {
  const session = getStoredAdminSession();
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    signOutAdmin();
    return null;
  }
  return getAdminUserById(session.userId);
}

export async function changeAdminPassword(userId: string, currentPassword: string, nextPassword: string) {
  const users = getStoredAdminUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) throw new Error("Admin account not found.");

  const { hash } = await hashPassword(currentPassword, user.passwordSalt);
  if (hash !== user.passwordHash) {
    throw new Error("Current password is incorrect.");
  }

  const passwordResult = validatePassword(nextPassword);
  if (!passwordResult.valid) {
    throw new Error(passwordResult.message);
  }

  const { hash: nextHash, salt: nextSalt } = await hashPassword(nextPassword);
  const nextUsers = users.map((item) => item.id === userId ? { ...item, passwordHash: nextHash, passwordSalt: nextSalt } : item);
  writeLocal(adminStorageKeys.users, nextUsers);
  return true;
}

export async function sendPasswordResetEmail(email: string) {
  const users = getStoredAdminUsers();
  const account = users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
  if (!account) return { sent: false, message: "If an admin account exists for that email, a reset link has been sent." };
  const token = `reset-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem("refillloop-admin-reset-token", JSON.stringify({ email: account.email, token, createdAt: Date.now() }));
  return { sent: true, message: "A secure reset link has been generated for this admin account.", token };
}

export async function resetAdminPassword(token: string, password: string, confirmPassword: string) {
  const resetEntry = readLocal<{ email: string; token: string; createdAt: number } | null>("refillloop-admin-reset-token", null);
  if (!resetEntry || resetEntry.token !== token) {
    throw new Error("This reset link is invalid or expired.");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const passwordResult = validatePassword(password);
  if (!passwordResult.valid) {
    throw new Error(passwordResult.message);
  }

  const users = getStoredAdminUsers();
  const user = users.find((item) => item.email.toLowerCase() === resetEntry.email.toLowerCase());
  if (!user) {
    throw new Error("Admin account not found.");
  }

  const { hash, salt } = await hashPassword(password);
  const nextUsers = users.map((item) => item.id === user.id ? { ...item, passwordHash: hash, passwordSalt: salt } : item);
  writeLocal(adminStorageKeys.users, nextUsers);
  localStorage.removeItem("refillloop-admin-reset-token");
  return true;
}

export function getAdminRolePermissions(role: AdminRole): string[] {
  const permissions: Record<AdminRole, string[]> = {
    "Super Admin": ["all"],
    Editor: ["content", "products", "articles", "blog", "media", "pages", "reviews"],
    "Store Manager": ["products", "categories", "orders", "customers", "subscriptions", "coupons", "settings"],
  };
  return permissions[role];
}

export function canAccessAdminSection(role: AdminRole, section: string) {
  const permissions = getAdminRolePermissions(role);
  return permissions.includes("all") || permissions.includes(section);
}
