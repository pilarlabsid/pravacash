import { useState, useCallback } from "react";
import { getApiUrl, safeJson } from "./useApi";
import { formatDate } from "../lib/format";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../constants";
import { getNow } from "../lib/format";

const toDatetimeLocal = (isoString, timezone = 'Asia/Jakarta') => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const p = (type) => parts.find(x => x.type === type)?.value || '';
  const h = p('hour') === '24' ? '00' : p('hour');
  return `${p('year')}-${p('month')}-${p('day')}T${h}:${p('minute')}`;
};

const createInitialForm = (overrides = {}, timezone = "Asia/Jakarta") => {
  const type = overrides.type || "expense";
  const defaultCategory = type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
  return {
    description: overrides.description || "",
    category: overrides.category || defaultCategory,
    amount: overrides.amount || "",
    type,
    date: overrides.date || getNow(timezone),
    proof_url: overrides.proof_url || "",
  };
};

export const useTransactions = ({ token, isAuthenticated, settings, setToast, authenticatedFetch }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(() => createInitialForm({}, settings.timezone || "Asia/Jakarta"));
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toast_local, setToast_local] = useState(null); // not used externally

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isExportPinOpen, setIsExportPinOpen] = useState(false);
  const [isImportPinOpen, setIsImportPinOpen] = useState(false);
  const [isImportFileOpen, setIsImportFileOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingTarget, setEditingTarget] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);

  const fetchEntries = useCallback(async (silent = false) => {
    if (!token || !isAuthenticated) return;
    if (!silent) setLoading(true);
    try {
      const apiUrl = `${getApiUrl()}/api/transactions`;
      const response = await authenticatedFetch(apiUrl);
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        throw new Error(`API tidak merespons dengan benar.`);
      }
      if (!response.ok) {
        const body = await safeJson(response);
        throw new Error(body.message || "Gagal memuat data.");
      }
      const data = await response.json();
      setEntries((data ?? []).map(e => ({ ...e, amount: Number(e.amount) || 0 })));
    } catch (error) {
      if (!silent) setToast({ type: "error", message: error.message });
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, isAuthenticated, authenticatedFetch, setToast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "amount") {
      const numeric = value.replace(/[^\d]/g, "");
      setForm(prev => ({ ...prev, amount: numeric }));
      return;
    }
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === "type") next.category = value === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
      return next;
    });
  };

  const openModal = (entry = null, modalRef = null) => {
    if (entry) {
      setEditingTarget(entry.id);
      setForm(createInitialForm({
        description: entry.description, category: entry.category,
        amount: String(entry.amount), type: entry.type,
        date: toDatetimeLocal(entry.date, settings.timezone || 'Asia/Jakarta'),
        proof_url: entry.proof_url || '',
      }, settings.timezone || "Asia/Jakarta"));
    } else {
      setEditingTarget(null);
      setForm(createInitialForm({}, settings.timezone || "Asia/Jakarta"));
    }
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef?.current?.querySelector("input[name='description']")?.focus();
    }, 0);
  };

  const requestDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await authenticatedFetch(`${getApiUrl()}/api/transactions/${deleteTarget}`, { method: "DELETE" });
      if (!response.ok && response.status !== 204) {
        const body = await safeJson(response);
        throw new Error(body.message || "Gagal menghapus transaksi.");
      }
      setToast({ type: "success", message: "Transaksi dihapus." });
      fetchEntries();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      const response = await authenticatedFetch(`${getApiUrl()}/api/transactions`, { method: "DELETE" });
      if (!response.ok && response.status !== 204) {
        const body = await safeJson(response);
        throw new Error(body.message || "Gagal menghapus data.");
      }
      setToast({ type: "success", message: "Database dikosongkan." });
      fetchEntries();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setResetting(false);
      setIsConfirmOpen(false);
    }
  };

  // Parse Excel date helper
  const parseExcelDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr instanceof Date && !Number.isNaN(dateStr.getTime())) {
      return dateStr.toISOString();
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const months = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'mei': '05',
      'jun': '06', 'jul': '07', 'agu': '08', 'sep': '09', 'okt': '10',
      'nov': '11', 'des': '12', 'januari': '01', 'februari': '02',
      'maret': '03', 'april': '04', 'juni': '06', 'juli': '07',
      'agustus': '08', 'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
    };
    const m = dateStr.toString().trim().toLowerCase().match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (m && months[m[2]]) return `${m[3]}-${months[m[2]]}-${m[1].padStart(2, '0')}`;
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    }
    return null;
  };

  const normalizeHeader = (value) => String(value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const parseAmount = (value) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const normalized = String(value ?? "").replace(/[^\d,-]/g, "").replace(/\./g, "").replace(",", ".");
    return Number(normalized) || 0;
  };

  const parseExcelFile = async (file) => {
    const { utils: XLSXUtils, read: readXLSX } = await import("xlsx");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = readXLSX(data, { type: 'array', cellDates: true });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSXUtils.sheet_to_json(worksheet, { header: 1, raw: true, defval: "" });
          const headerIndex = rows.findIndex((row) => row.some((cell) => ["tanggal", "tanggalwaktu", "tanggalwaktuwib", "date"].includes(normalizeHeader(cell))));
          if (headerIndex < 0) throw new Error("Header tidak ditemukan. Gunakan kolom Tanggal, Uraian, Kategori, Tipe, dan Nominal.");
          const headers = rows[headerIndex].map(normalizeHeader);
          const column = (...names) => headers.findIndex((header) => names.includes(header));
          const dateColumn = column("tanggal", "tanggalwaktu", "tanggalwaktuwib", "date");
          const descriptionColumn = column("uraian", "deskripsi", "keterangan", "description");
          const categoryColumn = column("kategori", "category");
          const typeColumn = column("tipe", "jenis", "type");
          const amountColumn = column("nominal", "jumlah", "amount");
          const incomeColumn = column("pemasukan", "income");
          const expenseColumn = column("pengeluaran", "expense");
          if (dateColumn < 0 || descriptionColumn < 0 || (amountColumn < 0 && incomeColumn < 0 && expenseColumn < 0)) {
            throw new Error("Kolom wajib tidak lengkap. Gunakan format ekspor Prava Cash atau kolom Tanggal, Uraian, dan Nominal.");
          }
          const transactions = [];
          for (let i = headerIndex + 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row) continue;
            const tanggal = row[dateColumn];
            const uraian = row[descriptionColumn];
            if (!uraian || !uraian.toString().trim()) continue;
            const date = parseExcelDate(tanggal);
            if (!date) continue;
            const pNum = incomeColumn >= 0 ? parseAmount(row[incomeColumn]) : 0;
            const eNum = expenseColumn >= 0 ? parseAmount(row[expenseColumn]) : 0;
            const declaredType = String(row[typeColumn] || "").toLowerCase();
            const declaredAmount = amountColumn >= 0 ? parseAmount(row[amountColumn]) : 0;
            if (pNum === 0 && eNum === 0 && declaredAmount === 0) continue;
            const type = declaredType.includes("masuk") || declaredType === "income" ? "income" : declaredType.includes("keluar") || declaredType === "expense" ? "expense" : pNum >= eNum ? "income" : "expense";
            const amount = declaredAmount || (type === "income" ? pNum : eNum);
            if (amount <= 0) continue;
            transactions.push({ description: uraian.toString().trim(), category: row[categoryColumn] ? String(row[categoryColumn]).trim() : undefined, amount, type, date });
          }
          resolve(transactions);
        } catch (err) { reject(new Error(`Gagal membaca file Excel: ${err.message}`)); }
      };
      reader.onerror = () => reject(new Error("Gagal membaca file."));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setToast({ type: "error", message: "File harus berformat Excel (.xlsx atau .xls)" });
      return;
    }
    setImportFile(file);
    setImporting(true);
    try {
      const transactions = await parseExcelFile(file);
      if (transactions.length === 0) {
        setToast({ type: "error", message: "Tidak ada transaksi valid." });
        setImportFile(null);
        return;
      }
      setImportPreview(transactions);
      setIsImportFileOpen(false);
      setIsImportPinOpen(true);
    } catch (error) {
      setToast({ type: "error", message: error.message });
      setImportFile(null);
    } finally {
      setImporting(false);
    }
  };

  const downloadImportTemplate = async () => {
    const { utils: XLSXUtils, writeFile: writeXLSXFile } = await import("xlsx");
    const rows = [
      ["PRAVA CASH - TEMPLATE IMPORT TRANSAKSI"],
      ["Isi transaksi mulai dari baris 5. Waktu transaksi menggunakan WIB dan nominal ditulis sebagai angka tanpa Rp."],
      [],
      ["Tanggal & Waktu (WIB)", "Uraian", "Kategori", "Tipe", "Nominal"],
      [new Date("2026-10-03T08:30:00+07:00"), "Penjualan harian", "Penjualan", "Pemasukan", 1500000],
      [new Date("2026-10-03T12:00:00+07:00"), "Belanja bahan", "Makanan", "Pengeluaran", 250000],
    ];
    const worksheet = XLSXUtils.aoa_to_sheet(rows, { cellDates: true });
    worksheet["!cols"] = [{ wch: 24 }, { wch: 34 }, { wch: 20 }, { wch: 18 }, { wch: 18 }];
    worksheet["!autofilter"] = { ref: "A4:E6" };
    if (worksheet.A5) worksheet.A5.z = "dd mmm yyyy hh:mm";
    if (worksheet.A6) worksheet.A6.z = "dd mmm yyyy hh:mm";
    if (worksheet.E5) worksheet.E5.z = '[$Rp-421] #,##0';
    if (worksheet.E6) worksheet.E6.z = '[$Rp-421] #,##0';
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, "Template Import");
    writeXLSXFile(workbook, "template-import-transaksi-prava-cash.xlsx");
  };

  const importTransactions = async (transactions) => {
    const results = { success: 0, failed: 0, errors: [] };
    for (let i = 0; i < transactions.length; i++) {
      try {
        const res = await authenticatedFetch(`${getApiUrl()}/api/transactions`, {
          method: "POST", body: JSON.stringify(transactions[i]),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Gagal transaksi ke-${i+1}`);
        }
        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push({ index: i+1, description: transactions[i].description, error: err.message });
      }
    }
    return results;
  };

  const confirmImportWithPin = async (validatePin) => {
    if (settings.pinEnabled) {
      const ok = await validatePin();
      if (!ok) return;
    }
    if (!importPreview?.length) { setToast({ type: "error", message: "Tidak ada data untuk diimpor." }); return; }
    setImporting(true);
    try {
      const results = await importTransactions(importPreview);
      if (results.failed === 0) {
        setToast({ type: "success", message: `Berhasil mengimpor ${results.success} transaksi.` });
      } else {
        setToast({ type: "error", message: `Berhasil: ${results.success}, Gagal: ${results.failed}.` });
      }
      setIsImportPinOpen(false);
      setIsImportFileOpen(false);
      setImportPreview([]);
      setImportFile(null);
      fetchEntries();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadExcel = (runningEntries, validatePin, confirmExportWithPin) => {
    if (!runningEntries.length) {
      setToast({ type: "error", message: "Belum ada transaksi untuk diunduh." });
      return;
    }
    if (settings.pinEnabled) {
      setIsExportPinOpen(true);
    } else {
      confirmExportWithPin();
    }
  };

  const confirmExportWithPin = async (runningEntries, validatePin) => {
    if (settings.pinEnabled) {
      const ok = await validatePin();
      if (!ok) return;
    }
    setExporting(true);
    try {
      const { utils: XLSXUtils, writeFile: writeXLSXFile } = await import("xlsx");
      const timezone = settings.timezone || "Asia/Jakarta";
      const income = runningEntries.filter((entry) => entry.type === "income").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
      const expense = runningEntries.filter((entry) => entry.type === "expense").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
      const rows = [
        ["PRAVA CASH - LAPORAN TRANSAKSI"],
        [`Diekspor ${formatDate(new Date().toISOString(), timezone)}`],
        ["Ringkasan", "Pemasukan", "Pengeluaran", "Saldo Akhir"],
        ["", income, expense, income - expense],
        [],
        ["Tanggal & Waktu (WIB)", "Uraian", "Kategori", "Tipe", "Nominal", "Saldo"],
        ...runningEntries.map((entry) => [new Date(entry.date), entry.description, entry.category || (entry.type === "income" ? "Gaji" : "Lainnya"), entry.type === "income" ? "Pemasukan" : "Pengeluaran", Number(entry.amount), Number(entry.runningBalance)]),
      ];
      const ws = XLSXUtils.aoa_to_sheet(rows, { cellDates: true });
      ws["!cols"] = [{ wch: 22 }, { wch: 34 }, { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 18 }];
      ws["!autofilter"] = { ref: `A6:F${Math.max(6, runningEntries.length + 6)}` };
      ws["!freeze"] = { xSplit: 0, ySplit: 6 };
      ["B4", "C4", "D4"].forEach((cell) => { if (ws[cell]) ws[cell].z = '[$Rp-421] #,##0'; });
      for (let row = 7; row <= runningEntries.length + 6; row++) {
        if (ws[`A${row}`]) ws[`A${row}`].z = "dd mmm yyyy hh:mm";
        ["E", "F"].forEach((columnName) => { if (ws[`${columnName}${row}`]) ws[`${columnName}${row}`].z = '[$Rp-421] #,##0'; });
      }
      const wb = XLSXUtils.book_new();
      XLSXUtils.book_append_sheet(wb, ws, "Transaksi");
      writeXLSXFile(wb, `prava-cash-transactions-${new Date().toISOString().slice(0,10)}.xlsx`);
      setToast({ type: "success", message: "File Excel siap diunduh." });
      setIsExportPinOpen(false);
    } catch (error) {
      setToast({ type: "error", message: "Gagal membuat file Excel." });
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadPdf = async (runningEntries, totals, user, validatePin, granularity = "week") => {
    if (!runningEntries.length) { setToast({ type: "error", message: "Belum ada transaksi untuk diunduh." }); return; }
    if (settings.pinEnabled && !(await validatePin())) return;
    try {
      const { generateTransactionPDF } = await import("../utils/pdfExport");
      generateTransactionPDF({ transactions: runningEntries, summary: totals, user, timezone: settings.timezone || "Asia/Jakarta", granularity });
      setToast({ type: "success", message: "Laporan PDF siap diunduh." });
    } catch (error) {
      setToast({ type: "error", message: "Gagal membuat laporan PDF." });
    }
  };

  return {
    entries, setEntries, loading, form, setForm,
    submitting, setSubmitting, deleting, exporting, resetting,
    isModalOpen, setIsModalOpen, isConfirmOpen, setIsConfirmOpen,
    isDeleteConfirmOpen, setIsDeleteConfirmOpen,
    isExportPinOpen, setIsExportPinOpen,
    isImportPinOpen, setIsImportPinOpen,
    isImportFileOpen, setIsImportFileOpen,
    deleteTarget, setDeleteTarget,
    editingTarget, setEditingTarget,
    pendingPayload, setPendingPayload,
    importing, importFile, setImportFile,
    importPreview, setImportPreview,
    fetchEntries, handleChange, openModal,
    requestDelete, handleReset,
    handleFileUpload, downloadImportTemplate, confirmImportWithPin,
    handleDownloadExcel, confirmExportWithPin, handleDownloadPdf,
    createInitialForm,
  };
};
