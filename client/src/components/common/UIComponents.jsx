import React from "react";

// Loading Spinner Component
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
    xl: "h-12 w-12 border-4",
  };
  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-indigo-600 border-t-transparent`}
      />
    </div>
  );
};

// Loading Button Component
export const LoadingButton = ({ loading, children, className = "", disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`${className} ${loading || disabled ? "cursor-not-allowed opacity-70" : ""}`}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <LoadingSpinner size="sm" className="border-current" />}
        {children}
      </div>
    </button>
  );
};

// Loading Overlay Component
export const LoadingOverlay = ({ message = "Memuat..." }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-semibold text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export const Field = ({ label, children }) => (
  <label className="text-sm font-medium leading-tight text-slate-600">
    {label}
    <div className="mt-1.5 sm:mt-2">{children}</div>
  </label>
);

export const StatCard = ({ label, value, className }) => (
  <div
    className={`w-full rounded-2xl bg-gradient-to-br px-5 py-3.5 sm:px-6 sm:py-4 shadow-soft transition-all hover:shadow-md ${className}`}
  >
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
      {label}
    </p>
    <p className="mt-1 text-2xl font-bold tracking-tight text-white">{value}</p>
  </div>
);

export const Badge = ({ label, variant, size = "md" }) => {
  const variants = {
    income: "bg-emerald-50 text-emerald-600",
    expense: "bg-rose-50 text-rose-600",
    neutral: "bg-slate-100 text-slate-600",
  };
  const sizes = {
    md: "text-xs px-3 py-1.5",
    sm: "text-[11px] px-2.5 py-1",
  };
  return (
    <span
      className={`inline-flex rounded-full font-semibold ${
        variants[variant] ?? variants.neutral
      } ${sizes[size] ?? sizes.md}`}
    >
      {label}
    </span>
  );
};

export const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-slate-200 py-14 text-center">
    <p className="text-base font-semibold text-slate-800">
      Belum ada transaksi
    </p>
    <p className="mt-1 text-sm text-slate-500">
      Mulai catat pemasukan atau pengeluaran pertama Anda.
    </p>
  </div>
);
