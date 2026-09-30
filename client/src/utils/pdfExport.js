import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "../lib/format";

/**
 * Generate PDF report transaksi seperti laporan bank
 * @param {Object} params - Parameter untuk generate PDF
 * @param {Array} params.transactions - Data transaksi
 * @param {Object} params.summary - Summary data (income, expense, balance)
 * @param {Object} params.user - User data
 * @param {string} params.dateRange - Range tanggal (opsional)
 */
export const generateTransactionPDF = ({ transactions, summary, user, dateRange = null }) => {
    const doc = new jsPDF();

    // ... (kode header dan summary tetap sama)

    // ============================================
    // HEADER - Logo & Judul
    // ============================================
    // Konfigurasi warna brand
    const brandColor = [79, 70, 229]; // Indigo-600
    const lightGray = [248, 250, 252];
    const darkGray = [51, 65, 85];
    const greenColor = [16, 185, 129]; // Emerald-500
    const redColor = [239, 68, 68]; // Rose-500

    let yPosition = 20;

    // HEADER - Logo & Judul
    doc.setFillColor(...brandColor);
    doc.rect(0, 0, 210, 35, 'F');

    // Judul
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("PRAVA CASH", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Laporan Transaksi Keuangan", 105, 22, { align: "center" });

    // Info user dan tanggal
    doc.setFontSize(9);
    doc.text(`${user?.name || 'User'}`, 105, 28, { align: "center" });

    yPosition = 45;

    // INFO PERIODE
    doc.setTextColor(...darkGray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const currentDate = new Date().toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    doc.text(`Tanggal Cetak: ${currentDate} WIB`, 20, yPosition);

    if (dateRange) {
        doc.text(`Periode: ${dateRange}`, 20, yPosition + 5);
        yPosition += 10;
    } else {
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
    doc.text(`${summary.incomeCount || 0} transaksi`, startX + colWidth / 2, yPosition + 28, { align: "center" });

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
    doc.text(`${summary.expenseCount || 0} transaksi`, startX + colWidth + colWidth / 2, yPosition + 28, { align: "center" });

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
    doc.text(`Total: ${(summary.incomeCount || 0) + (summary.expenseCount || 0)} transaksi`,
        startX + (colWidth * 2) + colWidth / 2, yPosition + 28, { align: "center" });

    yPosition += boxHeight + 12;

    // ============================================
    // RIWAYAT TRANSAKSI
    // ============================================
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("RIWAYAT TRANSAKSI", 20, yPosition);

    yPosition += 5;

    // Prepare table data
    const tableData = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((transaction, index) => [
            index + 1,
            formatDate(transaction.date),
            transaction.description,
            transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
            transaction.type === 'income'
                ? `+ ${formatCurrency(transaction.amount)}`
                : `- ${formatCurrency(transaction.amount)}`,
        ]);

    // AutoTable untuk tabel transaksi - PANGGIL LANGSUNG autoTable(doc, options)
    autoTable(doc, {
        startY: yPosition,
        head: [['No', 'Tanggal', 'Deskripsi', 'Tipe', 'Jumlah']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: brandColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 4,
        },
        bodyStyles: {
            fontSize: 8,
            cellPadding: 3,
        },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' }, // No
            1: { cellWidth: 28, halign: 'center' }, // Tanggal
            2: { cellWidth: 70 }, // Deskripsi
            3: { cellWidth: 28, halign: 'center' }, // Tipe
            4: { cellWidth: 32, halign: 'right', fontStyle: 'bold' }, // Jumlah
        },
        didParseCell: function (data) {
            // Warna untuk kolom jumlah
            if (data.column.index === 4 && data.section === 'body') {
                const rowData = transactions[data.row.index];
                if (rowData) {
                    if (rowData.type === 'income') {
                        data.cell.styles.textColor = greenColor;
                    } else {
                        data.cell.styles.textColor = redColor;
                    }
                }
            }

            // Warna untuk kolom tipe
            if (data.column.index === 3 && data.section === 'body') {
                const rowData = transactions[data.row.index];
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
        alternateRowStyles: {
            fillColor: [249, 250, 251],
        },
        margin: { left: 20, right: 20 },
    });

    // ============================================
    // FOOTER
    // ============================================
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(20, 282, 190, 282);

        // Footer text
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);

        doc.text(
            `Prava Cash - Cashflow Management System`,
            105,
            288,
            { align: "center" }
        );

        doc.text(
            `Halaman ${i} dari ${pageCount}`,
            190,
            288,
            { align: "right" }
        );

        doc.text(
            `Dokumen ini dibuat oleh sistem`,
            20,
            288
        );
    }

    // ============================================
    // SAVE PDF
    // ============================================
    const fileName = `Laporan-Transaksi-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return fileName;
};
