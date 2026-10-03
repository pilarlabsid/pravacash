import React, { useRef, useState } from "react";
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

const getDayOfMonth = (dateStr, timezone) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 0;
  try {
    const day = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone || DEFAULT_DATA_TIMEZONE,
      day: "2-digit",
    }).formatToParts(date).find((part) => part.type === "day")?.value;
    return Number(day) || 0;
  } catch (error) {
    return date.getDate();
  }
};

const getWeekdayLabel = (year, month, day, timezone) => new Intl.DateTimeFormat("id-ID", {
  timeZone: timezone,
  weekday: "short",
}).format(new Date(Date.UTC(year, month - 1, day, 12)));

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
const MonthlyBarChart = ({ entries, timezone, granularity, setGranularity }) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  const currentMonthKey = getCurrentMonthKey(tz);
  const [year, month] = currentMonthKey.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDayOffset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const weekCount = Math.ceil((daysInMonth + firstDayOffset) / 7);
  const periodCount = granularity === "week" ? weekCount : daysInMonth;
  const monthlyData = Array.from({ length: periodCount }, (_, index) => ({
    label: granularity === "week"
      ? `${Math.max(1, index * 7 - firstDayOffset + 1)}-${Math.min(daysInMonth, index * 7 - firstDayOffset + 7)}`
      : `${index + 1} ${getWeekdayLabel(year, month, index + 1, tz)}`,
    inc: 0,
    exp: 0,
  }));

  entries.forEach((entry) => {
    if (getMonthKey(entry.date, tz) !== currentMonthKey) return;
    const day = getDayOfMonth(entry.date, tz);
    const index = granularity === "week"
      ? Math.floor((day + firstDayOffset - 1) / 7)
      : day - 1;
    if (index < 0 || index >= monthlyData.length) return;
    if (entry.type === "income") monthlyData[index].inc += toAmount(entry.amount);
    if (entry.type === "expense") monthlyData[index].exp += toAmount(entry.amount);
  });

  const maxBar = Math.max(...monthlyData.flatMap((m) => [m.inc, m.exp]), 1);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-3xl bg-white p-4 shadow-soft sm:p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Grafik Bulan Ini</p>
        <div className="inline-flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Kelompok waktu grafik">
          {[{ value: "day", label: "Hari" }, { value: "week", label: "Minggu" }].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGranularity(option.value)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${granularity === option.value ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              aria-pressed={granularity === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-[10px] font-medium text-slate-400">
        {granularity === "week" ? "Rentang tanggal WIB · pekan Senin–Minggu" : "Tanggal dan hari dalam WIB"}
      </p>
      <div className="mt-1 min-h-0 w-full flex-1">
        <svg viewBox="0 0 720 360" width="100%" height="100%" className="block h-full w-full" preserveAspectRatio="none" role="img" aria-label={`Perbandingan pemasukan dan pengeluaran ${granularity === "week" ? "per minggu" : "per hari"} bulan ini`}>
          {Array.from({ length: 5 }, (_, index) => 282 - (190 * index) / 4).map((y) => (
            <line key={y} x1="30" y1={y} x2="690" y2={y} stroke="#edf1f5" strokeWidth="1" />
          ))}
          {monthlyData.map((m, i) => {
            const groupWidth = 660 / periodCount;
            const barWidth = granularity === "week" ? 32 : 6;
            const barGap = granularity === "week" ? 6 : 2;
            const x0 = 30 + i * groupWidth + (groupWidth - (barWidth * 2 + barGap)) / 2;
            const incH = (m.inc / maxBar) * 190;
            const expH = (m.exp / maxBar) * 190;
            const isFinalLabelSpaced = i === periodCount - 1
              && (i + 1) % 5 !== 0
              && periodCount - Math.floor(periodCount / 5) * 5 > 3;
            const showLabel = granularity === "week" || i === 0 || (i + 1) % 5 === 0 || isFinalLabelSpaced;
            return (
              <g key={i}>
                <title>{`${granularity === "week" ? "Tanggal" : "Hari"} ${m.label} WIB. Pemasukan ${formatCurrency(m.inc)}. Pengeluaran ${formatCurrency(m.exp)}.`}</title>
                <rect x={x0} y={282 - incH} width={barWidth} height={incH || 3} rx="4" fill="#10b981" opacity="0.85" />
                <rect x={x0 + barWidth + barGap} y={282 - expH} width={barWidth} height={expH || 3} rx="4" fill="#f43f5e" opacity="0.75" />
                {showLabel && (
                  <text x={30 + i * groupWidth + groupWidth / 2} y="320" textAnchor="middle" fontSize={granularity === "week" ? "12" : "10"} fill="#94a3b8">
                    {m.label}
                  </text>
                )}
              </g>
            );
          })}
          <line x1="30" y1="282" x2="690" y2="282" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="30" y="31" width="12" height="12" rx="3" fill="#10b981" /><text x="50" y="42" fontSize="13" fill="#64748b">Pemasukan</text>
          <rect x="176" y="31" width="12" height="12" rx="3" fill="#f43f5e" /><text x="196" y="42" fontSize="13" fill="#64748b">Pengeluaran</text>
        </svg>
      </div>
    </div>
  );
};

/* ── Income & Expense Trend Chart ───────────────────── */
const TrendChart = ({ entries, timezone }) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  const currentMonthKey = getCurrentMonthKey(tz);
  const monthEntries = entries.filter((t) => getMonthKey(t.date, tz) === currentMonthKey);
  const legend = (
    <div className="mb-1 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-semibold text-slate-600">
      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Pemasukan kumulatif</span>
      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" />Pengeluaran kumulatif</span>
      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600" />Arus kas bersih</span>
    </div>
  );

  if (monthEntries.length === 0) {
    return (
      <div className="flex h-full min-h-0 flex-col rounded-3xl bg-white p-4 shadow-soft sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tren Akumulasi Bulan Ini</p>
        {legend}
        <div className="grid min-h-0 w-full flex-1 place-items-center text-sm text-slate-400">
          Belum ada transaksi bulan ini
        </div>
      </div>
    );
  }

  const [year, month] = currentMonthKey.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const currentDay = Math.min(getDayOfMonth(new Date().toISOString(), tz), daysInMonth);
  const dailyTotals = Array.from({ length: currentDay }, () => ({ income: 0, expense: 0 }));
  monthEntries.forEach((entry) => {
    const dayIndex = getDayOfMonth(entry.date, tz) - 1;
    if (dayIndex >= 0 && dayIndex < dailyTotals.length) {
      dailyTotals[dayIndex][entry.type === "income" ? "income" : "expense"] += toAmount(entry.amount);
    }
  });

  let accumulatedIncome = 0;
  let accumulatedExpense = 0;
  const pointsData = dailyTotals.map((day, index) => {
    accumulatedIncome += day.income;
    accumulatedExpense += day.expense;
    return {
      day: index + 1,
      income: accumulatedIncome,
      expense: accumulatedExpense,
      net: accumulatedIncome - accumulatedExpense,
    };
  });
  const values = pointsData.flatMap((point) => [point.income, point.expense, point.net]);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 1);
  const valueRange = Math.max(maxVal - minVal, 1);
  const w = 720, h = 190, padX = 55, padY = 92;
  const zeroY = padY + h - ((0 - minVal) / valueRange) * h;
  const getX = (index) => padX + (index * ((w - 2 * padX) / Math.max(pointsData.length - 1, 1)));
  const getY = (value) => padY + h - ((value - minVal) / valueRange) * h;
  const getLinePoints = (key) => pointsData.map((point, index) => `${getX(index)},${getY(point[key])}`).join(" ");
  const showDayLabel = (day) => day === 1 || (day % 5 === 0 && currentDay - day > 3) || day === currentDay;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-3xl bg-white p-4 shadow-soft sm:p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tren Akumulasi Bulan Ini</p>
      </div>
      {legend}
      <div className="min-h-0 w-full flex-1">
        <svg viewBox="0 0 720 360" width="100%" height="100%" className="block h-full w-full" preserveAspectRatio="none" role="img" aria-label="Pemasukan kumulatif, pengeluaran kumulatif, dan arus kas bersih per hari bulan ini">
          {Array.from({ length: 5 }, (_, index) => padY + (h * index) / 4).map((y) => (
            <line key={y} x1={padX} y1={y} x2={w - padX} y2={y} stroke="#edf1f5" strokeWidth="1" />
          ))}
          <line x1={padX} y1={zeroY} x2={w - padX} y2={zeroY} stroke="#cbd5e1" strokeWidth="1.5" />
          <polyline points={getLinePoints("income")} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={getLinePoints("expense")} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={getLinePoints("net")} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {pointsData.map((point, index) => (
            <g key={point.day}>
              {showDayLabel(point.day) && (
                <text x={getX(index)} y="320" textAnchor="middle" fontSize="10" fill="#94a3b8">
                  {point.day} {getWeekdayLabel(year, month, point.day, tz)}
                </text>
              )}
            </g>
          ))}
          <text x={padX} y="348" textAnchor="start" fontSize="9" fill="#94a3b8">Tanggal (WIB)</text>
        </svg>
      </div>
    </div>
  );
};

/* ── Ratio Donut Chart ──────────────────────────────── */
const RatioChart = ({ entries, timezone }) => {
  const tz = timezone || DEFAULT_DATA_TIMEZONE;
  const currentMonthKey = getCurrentMonthKey(tz);
  const monthTotals = entries.reduce((result, entry) => {
    if (getMonthKey(entry.date, tz) === currentMonthKey) {
      if (entry.type === "income") result.income += toAmount(entry.amount);
      if (entry.type === "expense") result.expense += toAmount(entry.amount);
    }
    return result;
  }, { income: 0, expense: 0 });
  const totalInc = monthTotals.income;
  const totalExp = monthTotals.expense;
  const netBalance = totalInc - totalExp;
  const grandTotal = totalInc + totalExp;

  if (grandTotal === 0) {
    return (
      <div className="flex min-h-[270px] flex-col justify-between rounded-3xl bg-white p-4 shadow-soft sm:min-h-[300px] sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Rasio Bulan Ini</p>
        <div className="flex flex-1 items-center justify-center text-center text-sm text-slate-400">Belum ada data transaksi</div>
      </div>
    );
  }

  const r = 36, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  const incPct = Math.round((totalInc / grandTotal) * 100);
  const expPct = 100 - incPct;
  const incArc = (totalInc / grandTotal) * circ;

  return (
    <div className="flex min-h-[270px] flex-col justify-between rounded-3xl bg-white p-4 shadow-soft sm:min-h-[300px] sm:p-6">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Rasio Bulan Ini</p>
        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${totalInc >= totalExp ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"}`}>
          {totalInc >= totalExp ? "Arus Kas Sehat" : "Defisit"}
        </span>
      </div>
      <div className="flex flex-row items-center justify-between gap-2 my-auto pt-2 sm:gap-6">
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90 sm:h-[130px] sm:w-[130px]">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fecdd3" strokeWidth="12" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={`${incArc} ${circ - incArc}`} strokeLinecap="round" className="transition-all duration-700 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-slate-800">{incPct}%</span>
            <span className="text-[9px] font-semibold uppercase leading-none tracking-normal text-slate-400">Pemasukan</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-3 sm:space-y-3.5">
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
            <span className={`font-bold ${netBalance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {netBalance >= 0 ? "+" : ""}{formatCurrency(netBalance)}
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
      <div className="flex min-h-[270px] flex-col justify-between rounded-3xl bg-white p-4 shadow-soft sm:min-h-[300px] sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pengeluaran per Kategori (Bulan Ini)</p>
        <div className="flex flex-1 items-center justify-center text-center text-sm text-slate-400">Belum ada pengeluaran bulan ini</div>
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
    <div className="flex min-h-[270px] flex-col justify-between rounded-3xl bg-white p-4 shadow-soft sm:min-h-[300px] sm:p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pengeluaran per Kategori (Bulan Ini)</p>
      </div>
      <div className="flex flex-row items-center justify-between gap-2 my-auto pt-2 sm:gap-6">
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90 sm:h-[130px] sm:w-[130px]">
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
            <span className="text-[9px] font-semibold uppercase leading-none tracking-normal text-slate-400">Total Keluar</span>
            <span className="text-xs font-black text-slate-800 leading-tight">
              {totalMExp >= 1000000 ? `${(totalMExp / 1000000).toFixed(1)}jt` : totalMExp >= 1000 ? `${(totalMExp / 1000).toFixed(0)}rb` : totalMExp}
            </span>
          </div>
        </div>
        <div className="min-w-0 max-h-36 flex-1 space-y-2.5 overflow-y-auto pr-1">
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
export const UserFinancialCharts = ({ entries = [], totals = { income: 0, expense: 0, balance: 0 }, chartGranularity = "week", setChartGranularity }) => {
  const tz = DEFAULT_DATA_TIMEZONE;
  const carouselRef = useRef(null);
  const [activeChart, setActiveChart] = useState(0);
  const charts = [
    { label: "Arus Kas Bersih Bulan Ini", content: <TrendChart entries={entries} timezone={tz} /> },
    { label: "Grafik Bulan Ini", content: <MonthlyBarChart entries={entries} timezone={tz} granularity={chartGranularity} setGranularity={setChartGranularity} /> },
    { label: "Rasio Bulan Ini", content: <RatioChart entries={entries} timezone={tz} /> },
    { label: "Pengeluaran per Kategori", content: <CategoryBreakdown entries={entries} timezone={tz} /> },
  ];

  return (
    <section className="min-w-0">
      <div
        ref={carouselRef}
        onScroll={(event) => {
          const container = event.currentTarget;
          const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
          let closestIndex = 0;
          let closestDistance = Infinity;
          Array.from(container.children).forEach((slide, index) => {
            const slideRect = slide.getBoundingClientRect();
            const distance = Math.abs(slideRect.left + slideRect.width / 2 - containerCenter);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });
          setActiveChart(closestIndex);
        }}
        className="flex w-full min-w-0 items-stretch gap-3 snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:snap-none"
        role="region"
        aria-label="Carousel grafik keuangan"
        aria-roledescription="carousel"
        tabIndex={0}
      >
        {charts.map((chart, index) => (
          <div
            key={chart.label}
            className="flex min-h-[270px] w-full min-w-0 shrink-0 basis-full snap-center flex-col [&>*]:min-w-0 [&>*]:w-full [&>*]:flex-1 md:min-h-0 md:w-auto md:basis-auto md:snap-none"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} dari ${charts.length}: ${chart.label}`}
          >
            {chart.content}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2 md:hidden">
        {charts.map((chart, index) => (
          <button
            key={chart.label}
            type="button"
            onClick={() => {
              const container = carouselRef.current;
              const slide = container?.children[index];
              if (!container || !slide) return;
              const containerRect = container.getBoundingClientRect();
              const slideRect = slide.getBoundingClientRect();
              const targetLeft = container.scrollLeft + slideRect.left - containerRect.left
                - (container.clientWidth - slide.clientWidth) / 2;
              container.scrollTo({ left: targetLeft, behavior: "smooth" });
            }}
            className={`h-2.5 rounded-full transition-all ${activeChart === index ? "w-6 bg-emerald-600" : "w-2.5 bg-slate-300"}`}
            aria-label={`Tampilkan grafik: ${chart.label}`}
            aria-pressed={activeChart === index}
          />
        ))}
      </div>
    </section>
  );
};

export default UserFinancialCharts;
