import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate, getTimezoneLabel } from "../lib/format";

/**
 * Generate PDF report transaksi seperti laporan bank
 * @param {Object} params - Parameter untuk generate PDF
 * @param {Array} params.transactions - Data transaksi
 * @param {Object} params.summary - Summary data (income, expense, balance)
 * @param {Object} params.user - User data
 * @param {string} params.dateRange - Range tanggal (opsional)
 * @param {string} params.granularity - Agregasi chart bulan berjalan (day atau week)
 * @param {string} params.sourceUrl - URL aplikasi tempat laporan diunduh
 */
export const generateTransactionPDF = ({ transactions, summary, user, dateRange = null, timezone = "Asia/Jakarta", granularity = "week", sourceUrl = "" }) => {
    const doc = new jsPDF();

    // ... (kode header dan summary tetap sama)

    // ============================================
    // HEADER - Logo & Judul
    // ============================================
    // Konfigurasi warna brand
    const brandColor = [4, 120, 87]; // Emerald-700
    const lightGray = [248, 250, 252];
    const darkGray = [51, 65, 85];
    const greenColor = [16, 185, 129]; // Emerald-500
    const redColor = [239, 68, 68]; // Rose-500

    const nameLines = doc.splitTextToSize(String(user?.name || "User"), 78);
    const emailLines = doc.splitTextToSize(String(user?.email || "-"), 78);
    const identityLineCount = Math.max(nameLines.length, emailLines.length);
    const identityValueY = 34;
    const identityBottomY = identityValueY + (identityLineCount - 1) * 4.5;
    const identityDividerY = identityBottomY + 4;
    const headerHeight = identityDividerY + 4;
    const drawPageHeader = (includeUserDetails = false) => {
        doc.setFillColor(...brandColor);
        doc.rect(0, 0, 210, 2, "F");
        doc.setTextColor(...brandColor);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text("PRAVA CASH", 20, 12);
        doc.setTextColor(...darkGray);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("LAPORAN TRANSAKSI KEUANGAN", 190, 12, { align: "right" });

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.35);
        doc.line(20, 18, 190, 18);

        if (includeUserDetails) {
            doc.setFillColor(240, 253, 244);
            doc.roundedRect(20, 21, 170, identityDividerY - 21, 2, 2, "F");
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(100, 116, 139);
            doc.text("NAMA", 20, 25);
            doc.text("EMAIL", 105, 25);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...darkGray);
            doc.text(nameLines, 20, identityValueY, { lineHeightFactor: 1.15 });
            doc.text(emailLines, 105, identityValueY, { lineHeightFactor: 1.15 });
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.35);
            doc.line(20, identityDividerY, 190, identityDividerY);
        }
    };

    drawPageHeader(true);

    let yPosition = headerHeight + 8;

    // INFO PERIODE
    doc.setTextColor(...darkGray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const currentDate = new Date().toLocaleDateString('id-ID', {
        timeZone: timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    if (dateRange) {
        doc.text(`Periode: ${dateRange}`, 20, yPosition);
        yPosition += 5;
    }

    yPosition += 8;

    // SUMMARY STATISTICS
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("RINGKASAN KEUANGAN", 20, yPosition);

    yPosition += 8;

    // Box untuk statistics
    const boxWidth = 170;
    const boxHeight = 35;
    const startX = 20;

    // Background box
    doc.setFillColor(...lightGray);
    doc.roundedRect(startX, yPosition, boxWidth, boxHeight, 3, 3, 'F');

    // Grid untuk 3 kolom
    const colWidth = boxWidth / 3;

    // Draw vertical separators
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(startX + colWidth, yPosition, startX + colWidth, yPosition + boxHeight);
    doc.line(startX + (colWidth * 2), yPosition, startX + (colWidth * 2), yPosition + boxHeight);

    // PEMASUKAN
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Total Pemasukan", startX + colWidth / 2, yPosition + 10, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...greenColor);
    doc.text(formatCurrency(summary.income), startX + colWidth / 2, yPosition + 21, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(`${transactions.filter((transaction) => transaction.type === "income").length} transaksi`, startX + colWidth / 2, yPosition + 28, { align: "center" });

    // PENGELUARAN
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Total Pengeluaran", startX + colWidth + colWidth / 2, yPosition + 10, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...redColor);
    doc.text(formatCurrency(summary.expense), startX + colWidth + colWidth / 2, yPosition + 21, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(`${transactions.filter((transaction) => transaction.type === "expense").length} transaksi`, startX + colWidth + colWidth / 2, yPosition + 28, { align: "center" });

    // SALDO
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Saldo Akhir", startX + (colWidth * 2) + colWidth / 2, yPosition + 10, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const balanceColor = summary.balance >= 0 ? greenColor : redColor;
    doc.setTextColor(...balanceColor);
    doc.text(formatCurrency(summary.balance), startX + (colWidth * 2) + colWidth / 2, yPosition + 21, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(`Total: ${transactions.length} transaksi`,
        startX + (colWidth * 2) + colWidth / 2, yPosition + 28, { align: "center" });

    const getDateParts = (value) => new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date(value));
    const getMonthKey = (value) => {
        const parts = getDateParts(value);
        return `${parts.find((part) => part.type === "year")?.value}-${parts.find((part) => part.type === "month")?.value}`;
    };
    const getDayOfMonth = (value) => Number(getDateParts(value).find((part) => part.type === "day")?.value) || 0;
    const getWeekdayLabel = (day) => new Intl.DateTimeFormat("id-ID", {
        timeZone: timezone,
        weekday: "short",
    }).format(new Date(Date.UTC(currentYear, currentMonth - 1, day, 12)));
    const now = new Date();
    const currentKey = getMonthKey(now);
    const [currentYear, currentMonth] = currentKey.split("-").map(Number);
    const daysInMonth = new Date(Date.UTC(currentYear, currentMonth, 0)).getUTCDate();
    const firstDayOffset = (new Date(Date.UTC(currentYear, currentMonth - 1, 1)).getUTCDay() + 6) % 7;
    const weekCount = Math.ceil((daysInMonth + firstDayOffset) / 7);
    const currentDay = Math.min(getDayOfMonth(now), daysInMonth);
    const trendEntries = transactions.filter((transaction) => getMonthKey(transaction.date) === currentKey);
    const chartPeriodCount = granularity === "day" ? daysInMonth : weekCount;
    const chartPeriods = Array.from({ length: chartPeriodCount }, () => ({ income: 0, expense: 0 }));
    const dailyTotals = Array.from({ length: currentDay }, () => ({ income: 0, expense: 0 }));
    const currentMonthTotals = { income: 0, expense: 0 };

    trendEntries.forEach((transaction) => {
        const amount = Number(transaction.amount) || 0;
        const day = getDayOfMonth(transaction.date);
        const periodIndex = granularity === "day" ? day - 1 : Math.floor((day + firstDayOffset - 1) / 7);
        if (periodIndex >= 0 && periodIndex < chartPeriods.length) {
            chartPeriods[periodIndex][transaction.type === "income" ? "income" : "expense"] += amount;
        }
        if (day > 0 && day <= dailyTotals.length) {
            dailyTotals[day - 1][transaction.type === "income" ? "income" : "expense"] += amount;
        }
        currentMonthTotals[transaction.type === "income" ? "income" : "expense"] += amount;
    });

    let accumulatedIncome = 0;
    let accumulatedExpense = 0;
    const trendPoints = dailyTotals.map((day) => {
        accumulatedIncome += day.income;
        accumulatedExpense += day.expense;
        return { income: accumulatedIncome, expense: accumulatedExpense, net: accumulatedIncome - accumulatedExpense };
    });
    const categoryColors = {
        Makanan: [244, 63, 94],
        Transport: [59, 130, 246],
        Tagihan: [245, 158, 11],
        Hiburan: [139, 92, 246],
        Belanja: [236, 72, 153],
        Investasi: [16, 185, 129],
        Lainnya: [100, 116, 139],
    };
    const fallbackCategoryColors = [[6, 182, 212], [20, 184, 166], [132, 204, 22], [225, 29, 72], [99, 102, 241]];
    const getCategoryColor = (category, index) => categoryColors[category] || fallbackCategoryColors[index % fallbackCategoryColors.length];
    const drawPanel = (x, y, title) => {
        doc.setFillColor(...lightGray);
        doc.roundedRect(x, y, 82, 68, 3, 3, "F");
        doc.setTextColor(...darkGray);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(title, x + 5, y + 8);
    };
    const drawDonut = (centerX, centerY, portions, colors) => {
        const radius = 12;
        let start = -Math.PI / 2;
        doc.setLineWidth(7);
        portions.forEach((portion, index) => {
            const end = start + (Math.max(portion, 0) * Math.PI * 2);
            doc.setDrawColor(...colors[index]);
            for (let angle = start; angle < end; angle += 0.04) {
                const next = Math.min(angle + 0.04, end);
                doc.line(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius, centerX + Math.cos(next) * radius, centerY + Math.sin(next) * radius);
            }
            start = end;
        });
    };

    // Empat grafik ditempatkan rapat pada halaman ringkasan pertama.
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("GRAFIK RINGKASAN", 20, 116);

    // Pemasukan dan pengeluaran bulan ini per hari atau minggu.
    drawPanel(108, 122, granularity === "day" ? "BULAN INI / HARI" : "BULAN INI / MINGGU");
    const monthlyMax = Math.max(...chartPeriods.flatMap((period) => [period.income, period.expense]), 1);
    const barChartLeft = 115, barChartWidth = 69, barChartBaseline = 160, barChartHeight = 20;
    doc.setDrawColor(237, 241, 245); doc.setLineWidth(0.2);
    for (let index = 0; index <= 4; index++) {
        const y = barChartBaseline - barChartHeight + (barChartHeight * index) / 4;
        doc.line(barChartLeft, y, barChartLeft + barChartWidth, y);
    }
    chartPeriods.forEach((period, index) => {
        const groupWidth = barChartWidth / chartPeriodCount;
        const barWidth = granularity === "day" ? 0.65 : 3.4;
        const barGap = granularity === "day" ? 0.25 : 1;
        const x = barChartLeft + index * groupWidth + (groupWidth - (barWidth * 2 + barGap)) / 2;
        const incomeHeight = (period.income / monthlyMax) * barChartHeight;
        const expenseHeight = (period.expense / monthlyMax) * barChartHeight;
        doc.setFillColor(...greenColor); doc.roundedRect(x, barChartBaseline - incomeHeight, barWidth, Math.max(incomeHeight, 0.5), 0.25, 0.25, "F");
        doc.setFillColor(...redColor); doc.roundedRect(x + barWidth + barGap, barChartBaseline - expenseHeight, barWidth, Math.max(expenseHeight, 0.5), 0.25, 0.25, "F");
        const day = index + 1;
        const isFinalLabelSpaced = day === daysInMonth
            && day % 5 !== 0
            && daysInMonth - Math.floor(daysInMonth / 5) * 5 > 3;
        const showLabel = granularity === "week" || day === 1 || day % 5 === 0 || isFinalLabelSpaced;
        if (showLabel) {
            doc.setFont("helvetica", "normal"); doc.setFontSize(4.5); doc.setTextColor(100, 116, 139);
            const weekStart = index * 7 - firstDayOffset + 1;
            const weekEnd = Math.min(daysInMonth, weekStart + 6);
            const label = granularity === "week"
                ? `${Math.max(1, weekStart)}-${weekEnd}`
                : `${day} ${getWeekdayLabel(day)}`;
            doc.text(label, barChartLeft + index * groupWidth + groupWidth / 2, 166, { align: "center" });
        }
    });
    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.4); doc.line(barChartLeft, barChartBaseline, barChartLeft + barChartWidth, barChartBaseline);
    doc.setFontSize(4.5); doc.setTextColor(100, 116, 139); doc.text("Tanggal dan hari (WIB)", 115, 171);
    doc.setFontSize(4.5); doc.setTextColor(...greenColor); doc.text("Pemasukan", 115, 180);
    doc.setTextColor(...redColor); doc.text("Pengeluaran", 149, 180);

    // Tren pemasukan, pengeluaran, dan arus kas bersih harian.
    drawPanel(20, 122, "TREN AKUMULASI BULAN INI");
    const trendValues = trendPoints.flatMap((point) => [point.income, point.expense, point.net]);
    const trendMin = Math.min(...trendValues, 0);
    const trendMax = Math.max(...trendValues, 1);
    const trendRange = Math.max(trendMax - trendMin, 1);
    const trendLeft = 27, trendRight = 95, trendTop = 139, trendBottom = 160;
    const trendX = (index) => trendLeft + index * ((trendRight - trendLeft) / Math.max(trendPoints.length - 1, 1));
    const trendY = (value) => trendBottom - ((value - trendMin) / trendRange) * (trendBottom - trendTop);
    doc.setDrawColor(237, 241, 245); doc.setLineWidth(0.2);
    for (let index = 0; index <= 4; index++) {
        const y = trendTop + ((trendBottom - trendTop) * index) / 4;
        doc.line(trendLeft, y, trendRight, y);
    }
    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.4); doc.line(trendLeft, trendY(0), trendRight, trendY(0));
    const trendSeries = [
        { key: "income", color: greenColor },
        { key: "expense", color: redColor },
        { key: "net", color: [37, 99, 235] },
    ];
    trendSeries.forEach(({ key, color }) => {
        doc.setDrawColor(...color); doc.setLineWidth(0.8);
        for (let index = 1; index < trendPoints.length; index++) {
            doc.line(trendX(index - 1), trendY(trendPoints[index - 1][key]), trendX(index), trendY(trendPoints[index][key]));
        }
    });
    if (!trendEntries.length) { doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(100, 116, 139); doc.text("Belum ada transaksi", 61, 147, { align: "center" }); }
    trendPoints.forEach((point, index) => {
        const showLabel = point.day === 1 || (point.day % 5 === 0 && currentDay - point.day > 3) || point.day === currentDay;
        if (showLabel) {
            doc.setFont("helvetica", "normal"); doc.setFontSize(4.5); doc.setTextColor(100, 116, 139);
            doc.text(`${point.day} ${getWeekdayLabel(point.day)}`, trendX(index), 166, { align: "center" });
        }
    });
    doc.setFont("helvetica", "normal"); doc.setFontSize(4.5); doc.setTextColor(100, 116, 139);
    doc.text("Tanggal (WIB)", 27, 171);
    doc.setTextColor(...greenColor); doc.text("Pemasukan", 27, 180);
    doc.setTextColor(...redColor); doc.text("Pengeluaran", 45, 180);
    doc.setTextColor(37, 99, 235); doc.text("Bersih", 68, 180);

    // 3. Rasio pemasukan dan pengeluaran bulan ini.
    drawPanel(20, 194, "RASIO BULAN INI");
    const totalFlow = currentMonthTotals.income + currentMonthTotals.expense;
    const incomeRatio = totalFlow ? currentMonthTotals.income / totalFlow : 0;
    if (totalFlow) {
        drawDonut(61, 222, [incomeRatio, 1 - incomeRatio], [greenColor, redColor]);
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(...darkGray); doc.text(`${Math.round(incomeRatio * 100)}%`, 61, 221, { align: "center" });
        doc.setFont("helvetica", "normal"); doc.setFontSize(4.5); doc.setTextColor(...greenColor); doc.text("Pemasukan", 61, 226, { align: "center" });
    } else {
        doc.setFont("helvetica", "normal"); doc.setFontSize(6); doc.setTextColor(100, 116, 139); doc.text("Belum ada data", 61, 222, { align: "center" });
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(5.5); doc.setTextColor(...greenColor); doc.text(`Pemasukan ${formatCurrency(currentMonthTotals.income)}`, 27, 243);
    doc.setTextColor(...redColor); doc.text(`Pengeluaran ${formatCurrency(currentMonthTotals.expense)}`, 27, 250);

    // 4. Pengeluaran berdasarkan kategori bulan ini
    drawPanel(108, 194, "PENGELUARAN KATEGORI");
    const categoryTotals = new Map();
    trendEntries.filter((transaction) => transaction.type === "expense").forEach((transaction) => {
        const category = transaction.category || "Lainnya";
        categoryTotals.set(category, (categoryTotals.get(category) || 0) + (Number(transaction.amount) || 0));
    });
    const categories = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1]);
    const categoryTotal = categories.reduce((sum, [, amount]) => sum + amount, 0);
    if (categoryTotal) {
        drawDonut(149, 222, categories.map(([, amount]) => amount / categoryTotal), categories.map(([category], index) => getCategoryColor(category, index)));
        const compactCategoryTotal = categoryTotal >= 1000000
            ? `${(categoryTotal / 1000000).toFixed(1)}jt`
            : categoryTotal >= 1000
                ? `${(categoryTotal / 1000).toFixed(0)}rb`
                : String(categoryTotal);
        doc.setFont("helvetica", "normal"); doc.setFontSize(4.5); doc.setTextColor(100, 116, 139); doc.text("Total Keluar", 149, 220, { align: "center" });
        doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); doc.setTextColor(...darkGray); doc.text(compactCategoryTotal, 149, 226, { align: "center" });
        categories.slice(0, 3).forEach(([category], index) => {
            const amount = categories[index][1];
            const percentage = Math.round((amount / categoryTotal) * 100);
            doc.setFillColor(...getCategoryColor(category, index)); doc.rect(116, 241 + index * 5, 2.5, 2.5, "F");
            doc.setFont("helvetica", "normal"); doc.setFontSize(4.8); doc.setTextColor(100, 116, 139); doc.text(`${category.slice(0, 11)} ${percentage}% ${formatCurrency(amount)}`, 121, 243.5 + index * 5);
        });
    } else { doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(100, 116, 139); doc.text("Belum ada pengeluaran", 149, 222, { align: "center" }); }

    doc.addPage();
    yPosition = 30;

    // ============================================
    // RIWAYAT TRANSAKSI
    // ============================================
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("RIWAYAT TRANSAKSI", 20, yPosition);

    yPosition += 8;

    // Prepare table data
    const sortedTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    const tableData = sortedTransactions
        .map((transaction, index) => [
            index + 1,
            formatDate(transaction.date, timezone),
            transaction.description,
            transaction.category || "-",
            transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
            transaction.type === 'income'
                ? `+ ${formatCurrency(transaction.amount)}`
                : `- ${formatCurrency(transaction.amount)}`,
        ]);

    // AutoTable untuk tabel transaksi - PANGGIL LANGSUNG autoTable(doc, options)
    autoTable(doc, {
        startY: yPosition,
        head: [['No', 'Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: brandColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 3,
            valign: 'middle',
        },
        bodyStyles: {
            fontSize: 8,
            cellPadding: 2,
            valign: 'middle',
        },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' }, // No
            1: { cellWidth: 35, halign: 'center' }, // Tanggal
            2: { cellWidth: 38 }, // Deskripsi
            3: { cellWidth: 30 }, // Kategori
            4: { cellWidth: 27, halign: 'center' }, // Tipe
            5: { cellWidth: 28, halign: 'right', fontStyle: 'bold' }, // Jumlah
        },
        didParseCell: function (data) {
            // Warna untuk kolom jumlah
            if (data.column.index === 5 && data.section === 'body') {
                const rowData = sortedTransactions[data.row.index];
                if (rowData) {
                    if (rowData.type === 'income') {
                        data.cell.styles.textColor = greenColor;
                    } else {
                        data.cell.styles.textColor = redColor;
                    }
                }
            }

            // Warna untuk kolom tipe
            if (data.column.index === 4 && data.section === 'body') {
                const rowData = sortedTransactions[data.row.index];
                if (rowData) {
                    if (rowData.type === 'income') {
                        data.cell.styles.fillColor = [209, 250, 229]; // green-100
                        data.cell.styles.textColor = [5, 150, 105]; // green-700
                    } else {
                        data.cell.styles.fillColor = [254, 226, 226]; // red-100
                        data.cell.styles.textColor = [185, 28, 28]; // red-700
                    }
                }
            }
        },
        didDrawPage: () => drawPageHeader(),
        alternateRowStyles: {
            fillColor: [249, 250, 251],
        },
        margin: { top: 34, left: 20, right: 20, bottom: 20 },
    });
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(20, 282, 190, 282);

        // Footer print details, source link, and pagination
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        const pageLabel = `Halaman ${i} dari ${pageCount}`;
        const sourcePrefix = `Dicetak pada ${currentDate} ${getTimezoneLabel(timezone)} | Sumber: Prava Cash (`;
        const sourceAddress = sourceUrl || window.location.origin;
        const sourceSuffix = ")";
        let footerFontSize = 6;
        doc.setFontSize(footerFontSize);
        const availableWidth = 190 - doc.getTextWidth(pageLabel) - 5 - 20;
        const getSourceLabelWidth = () => {
            doc.setFont("helvetica", "normal");
            const prefixWidth = doc.getTextWidth(sourcePrefix);
            doc.setFont("helvetica", "italic");
            const addressWidth = doc.getTextWidth(sourceAddress);
            doc.setFont("helvetica", "normal");
            return prefixWidth + addressWidth + doc.getTextWidth(sourceSuffix);
        };
        while (footerFontSize > 4.5 && getSourceLabelWidth() > availableWidth) {
            footerFontSize -= 0.25;
            doc.setFontSize(footerFontSize);
        }
        doc.setFont("helvetica", "normal");
        doc.text(sourcePrefix, 20, 287);
        const sourceX = 20 + doc.getTextWidth(sourcePrefix);
        doc.setFont("helvetica", "normal");
        doc.text(sourceAddress, sourceX, 287);
        const sourceAddressWidth = doc.getTextWidth(sourceAddress);
        if (sourceAddress) {
            doc.link(sourceX, 282, sourceAddressWidth, 7, { url: sourceAddress });
        }
        doc.setFont("helvetica", "normal");
        doc.text(sourceSuffix, sourceX + sourceAddressWidth, 287);
        doc.setTextColor(120, 120, 120);
        doc.text(pageLabel, 190, 287, { align: "right" });
    }

    // ============================================
    // SAVE PDF
    // ============================================
    const safeUserName = String(user?.name || "User")
        .trim()
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
        .replace(/\s+/g, "-") || "User";
    const fileName = `Laporan-Transaksi-${safeUserName}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return fileName;
};
