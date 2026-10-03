import React from "react";
import { DEFAULT_DATA_TIMEZONE, formatCurrency } from "../../lib/format";

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const getMonthKey = (dateStr, timezone) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
    }).formatToParts(d);
    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    return year && month ? `${year}-${month}` : "";
  } catch (e) {
    return (dateStr || "").slice(0, 7);
  }
};

const getCurrentMonthKey = (timezone) => {
  return getMonthKey(new Date().toISOString(), timezone || DEFAULT_DATA_TIMEZONE);
};

// Helper: get last N month keys in a given timezone
const getLastNMonthKeys = (n, timezone) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  const result = [];
  const curMonthKey = getCurrentMonthKey(tz);
  // parse curMonthKey to get year/month
  const [curYear, curMonth] = curMonthKey.split("-").map(Number);
  for (let i = n - 1; i >= 0; i--) {
    let m = curMonth - i;
    let y = curYear;
    while (m <= 0) { m += 12; y--; }
    const key = `${y}-${String(m).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: tz })
      .format(new Date(Date.UTC(y, m - 1, 1, 12)));
    result.push({ key, label });
  }
  return result;
};

const CATEGORY_COLORS = {
  Makanan: "#f43f5e",
  Transport: "#3b82f6",
  Tagihan: "#f59e0b",
  Hiburan: "#8b5cf6",
  Belanja: "#ec4899",
  Investasi: "#10b981",
  Lainnya: "#64748b",
};
const FALLBACK_PALETTE = ["#06b6d4", "#14b8a6", "#84cc16", "#e11d48", "#6366f1"];
const getColor = (cat, idx) => CATEGORY_COLORS[cat] || FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];

/* ── Monthly Bar Chart ──────────────────────────────── */
const MonthlyBarChart = ({ entries, timezone }) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  const monthlyData = (() => {
    const months = getLastNMonthKeys(6, tz);
    return months.map(({ key, label }) => {
      const inc = entries.filter((t) => t.type === "income" && getMonthKey(t.date, tz) === key).reduce((sum, t) => sum + toAmount(t.amount), 0);
      const exp = entries.filter((t) => t.type === "expense" && getMonthKey(t.date, tz) === key).reduce((sum, t) => sum + toAmount(t.amount), 0);
      return { label, inc, exp };
    });
  })();
  const maxBar = Math.max(...monthlyData.flatMap((m) => [m.inc, m.exp]), 1);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Grafik 6 Bulan Terakhir</p>
      <div className="w-full -mt-8">
        <svg viewBox="0 0 720 300" width="100%" height="250" className="block w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Perbandingan pemasukan dan pengeluaran enam bulan terakhir">
          {monthlyData.map((m, i) => {
            const bW = 42, gap = 112, x0 = 42 + i * gap;
            const incH = (m.inc / maxBar) * 150;
            const expH = (m.exp / maxBar) * 150;
            return (
              <g key={i}>
                <rect x={x0} y={232 - incH} width={bW} height={incH || 3} rx="6" fill="#10b981" opacity="0.85" />
                <rect x={x0 + bW + 8} y={232 - expH} width={bW} height={expH || 3} rx="6" fill="#f43f5e" opacity="0.75" />
                <text x={x0 + bW + 4} y="264" textAnchor="middle" fontSize="18" fill="#94a3b8">{m.label}</text>
              </g>
            );
          })}
          <line x1="30" y1="232" x2="690" y2="232" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="30" y="30" width="14" height="14" rx="3" fill="#10b981" /><text x="54" y="42" fontSize="16" fill="#64748b">Pemasukan</text>
          <rect x="190" y="30" width="14" height="14" rx="3" fill="#f43f5e" /><text x="214" y="42" fontSize="16" fill="#64748b">Pengeluaran</text>
        </svg>
      </div>
    </div>
  );
};

/* ── Income & Expense Trend Chart ───────────────────── */
const TrendChart = ({ entries, timezone }) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  const currentMonthKey = getCurrentMonthKey(tz);
  const monthEntries = entries.filter((t) => getMonthKey(t.date, tz) === currentMonthKey).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (monthEntries.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tren Pemasukan & Pengeluaran (Bulan Ini)</p>
        <p className="mt-4 text-sm text-slate-400">Belum ada transaksi bulan ini</p>
      </div>
    );
  }


  let totalInc = 0, totalExp = 0;
  const pointsData = monthEntries.map((t) => {
    if (t.type === "income") totalInc += toAmount(t.amount);
    if (t.type === "expense") totalExp += toAmount(t.amount);
    return { date: t.date, inc: totalInc, exp: totalExp };
  });

  const maxVal = Math.max(...pointsData.map((d) => Math.max(d.inc, d.exp)), 1);
  const w = 720, h = 155, padX = 55, padY = 48;
  const getX = (i) => padX + (i * ((w - 2 * padX) / Math.max(pointsData.length - 1, 1)));
  const getY = (val) => padY + h - (val / maxVal) * h;

  const ptsInc = pointsData.map((d, i) => `${getX(i)},${getY(d.inc)}`).join(" ");
  const ptsExp = pointsData.map((d, i) => `${getX(i)},${getY(d.exp)}`).join(" ");
  const areaInc = `${getX(0)},${padY + h} ${ptsInc} ${getX(pointsData.length - 1)},${padY + h}`;
  const areaExp = `${getX(0)},${padY + h} ${ptsExp} ${getX(pointsData.length - 1)},${padY + h}`;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tren Pemasukan & Pengeluaran (Bulan Ini)</p>
      </div>
      <div className="w-full -mt-8">
        <svg viewBox="0 0 720 300" width="100%" height="250" className="block w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Tren pemasukan dan pengeluaran bulan ini">
          <defs>
            <linearGradient id="incGradTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.25" /><stop offset="100%" stopColor="#10b981" stopOpacity="0.0" /></linearGradient>
            <linearGradient id="expGradTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.20" /><stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" /></linearGradient>
          </defs>
          <line x1={padX} y1={padY} x2={w - padX} y2={padY} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={padX} y1={padY + h / 2} x2={w - padX} y2={padY + h / 2} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={padX} y1={padY + h} x2={w - padX} y2={padY + h} stroke="#e2e8f0" strokeWidth="1" />
          <polygon points={areaInc} fill="url(#incGradTrend)" />
          <polygon points={areaExp} fill="url(#expGradTrend)" />
          <polyline points={ptsInc} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={ptsExp} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {pointsData.map((d, i) => (
            <g key={i}>
              <circle cx={getX(i)} cy={getY(d.inc)} r="7" fill="#fff" stroke="#10b981" strokeWidth="4"><title>{`Pemasukan: ${formatCurrency(d.inc)}`}</title></circle>
              <circle cx={getX(i)} cy={getY(d.exp)} r="7" fill="#fff" stroke="#f43f5e" strokeWidth="4"><title>{`Pengeluaran: ${formatCurrency(d.exp)}`}</title></circle>
            </g>
          ))}
          <g transform={`translate(${padX}, ${padY + h + 42})`}>
            <circle cx="7" cy="5" r="7" fill="#10b981" /><text x="23" y="11" fontSize="16" fontWeight="600" fill="#047857">Pemasukan: {formatCurrency(totalInc)}</text>
            <circle cx="350" cy="5" r="7" fill="#f43f5e" /><text x="366" y="11" fontSize="16" fontWeight="600" fill="#b91c1c">Pengeluaran: {formatCurrency(totalExp)}</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

/* ── Ratio Donut Chart ──────────────────────────────── */
const RatioChart = ({ totals }) => {
  const totalInc = toAmount(totals.income);
  const totalExp = toAmount(totals.expense);
  const grandTotal = totalInc + totalExp;

  if (grandTotal === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-soft flex flex-col justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Rasio Pemasukan vs Pengeluaran</p>
        <div className="py-10 text-center text-sm text-slate-400">Belum ada data transaksi</div>
      </div>
    );
  }

  const r = 36, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  const incPct = Math.round((totalInc / grandTotal) * 100);
  const expPct = 100 - incPct;
  const incArc = (totalInc / grandTotal) * circ;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Rasio Pemasukan vs Pengeluaran</p>
        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${totalInc >= totalExp ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"}`}>
          {totalInc >= totalExp ? "Arus Kas Sehat" : "Defisit"}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto pt-2">
        <div className="relative flex-shrink-0">
          <svg width="130" height="130" viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fecdd3" strokeWidth="12" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={`${incArc} ${circ - incArc}`} strokeLinecap="round" className="transition-all duration-700 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-slate-800">{incPct}%</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pemasukan</span>
          </div>
        </div>
        <div className="w-full space-y-3.5">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm"></span>Pemasukan</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalInc)} ({incPct}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${incPct}%` }}></div></div>
          </div>
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block shadow-sm"></span>Pengeluaran</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalExp)} ({expPct}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-rose-400 transition-all duration-500" style={{ width: `${expPct}%` }}></div></div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Saldo Bersih:</span>
            <span className={`font-bold ${totals.balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {totals.balance >= 0 ? "+" : ""}{formatCurrency(totals.balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Category Breakdown Donut ───────────────────────── */
const CategoryBreakdown = ({ entries, timezone }) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  const currentMonthKey = getCurrentMonthKey(tz);
  const monthExp = entries.filter((t) => t.type === "expense" && getMonthKey(t.date, tz) === currentMonthKey);

  if (monthExp.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-soft flex flex-col justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pengeluaran per Kategori (Bulan Ini)</p>
        <div className="py-10 text-center text-sm text-slate-400">Belum ada pengeluaran bulan ini</div>
      </div>
    );
  }

  const catTotals = {};
  monthExp.forEach((t) => {
    const cat = t.category || "Lainnya";
    catTotals[cat] = (catTotals[cat] || 0) + toAmount(t.amount);
  });
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const totalMExp = sortedCats.reduce((s, [, amt]) => s + amt, 0);

  const r = 36, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  let currentOffset = 0;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pengeluaran per Kategori (Bulan Ini)</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto pt-2">
        <div className="relative flex-shrink-0">
          <svg width="130" height="130" viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
            {sortedCats.map(([cat, amt], i) => {
              const pct = amt / totalMExp;
              const arcLength = pct * circ;
              const dashoffset = -currentOffset;
              currentOffset += arcLength;
              if (pct === 0) return null;
              return (
                <circle key={cat} cx={cx} cy={cy} r={r} fill="none" stroke={getColor(cat, i)} strokeWidth="12" strokeDasharray={`${Math.max(arcLength - 1.5, 0.5)} ${circ - Math.max(arcLength - 1.5, 0.5)}`} strokeDashoffset={dashoffset} strokeLinecap="round" className="transition-all duration-700 ease-out">
                  <title>{`${cat}: ${formatCurrency(amt)} (${Math.round(pct * 100)}%)`}</title>
                </circle>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Keluar</span>
            <span className="text-xs font-black text-slate-800 leading-tight">
              {totalMExp >= 1000000 ? `${(totalMExp / 1000000).toFixed(1)}jt` : totalMExp >= 1000 ? `${(totalMExp / 1000).toFixed(0)}rb` : totalMExp}
            </span>
          </div>
        </div>
        <div className="w-full space-y-2.5 max-h-44 overflow-y-auto pr-1">
          {sortedCats.map(([cat, amt], i) => {
            const pct = Math.round((amt / totalMExp) * 100);
            const color = getColor(cat, i);
            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
                    <span className="font-semibold text-slate-700 truncate" title={cat}>{cat}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 text-slate-800 font-bold">
                    <span>{formatCurrency(amt)}</span>
                    <span className="text-[11px] text-slate-400 font-medium w-8 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ── Main Export ─────────────────────────────────────── */
export const UserFinancialCharts = ({ entries = [], totals = { income: 0, expense: 0, balance: 0 }, timezone }) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;

  return (
    <section className="mb-6 grid gap-6 md:grid-cols-2">
      <MonthlyBarChart entries={entries} timezone={tz} />
      <TrendChart entries={entries} timezone={tz} />
      <RatioChart totals={totals} />
      <CategoryBreakdown entries={entries} timezone={tz} />
    </section>
  );
};

export default UserFinancialCharts;
