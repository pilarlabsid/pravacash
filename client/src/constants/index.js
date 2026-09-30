import { getNow } from "../lib/format";

export const INCOME_CATEGORIES = ["Gaji", "Bonus", "Investasi", "Lainnya"];
export const EXPENSE_CATEGORIES = ["Makanan", "Transport", "Tagihan", "Hiburan", "Belanja", "Lainnya"];

// PIN Code default (akan di-override oleh user settings)
export const DEFAULT_PIN_CODE = import.meta.env.VITE_PIN_CODE || "6745";

export const createInitialForm = (overrides = {}, timezone = "Asia/Jakarta") => {
  const type = overrides.type || "expense";
  const defaultCategory = type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
  return {
    description: "",
    amount: "",
    type: "expense",
    date: getNow(timezone),
    category: defaultCategory,
    ...overrides,
  };
};

export const STAT_STYLES = {
  income: "from-emerald-500 via-emerald-400 to-emerald-500 text-white",
  expense: "from-rose-500 via-rose-400 to-rose-500 text-white",
  balance: "from-indigo-500 via-blue-500 to-sky-500 text-white",
};

export const inputClasses =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100";
