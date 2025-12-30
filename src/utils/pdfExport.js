import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const exportFinancialReport = (year, summary, apartments, payments, expenses) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Syndic Financial Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'normal');
  doc.text(`Financial Year: ${year}`, pageWidth / 2, 30, { align: 'center' });
  
  // Financial Summary
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Financial Summary', 14, 45);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  const summaryData = [
    ['Total Payments Collected', `${summary.totalPayments.toFixed(2)} DH`],
    ['Total Expenses', `${summary.totalExpenses.toFixed(2)} DH`],
    ['Net Balance', `${summary.balance.toFixed(2)} DH`],
    ['Status', summary.status === 'surplus' ? 'Surplus' : 'Deficit'],
  ];
  
  doc.autoTable({
    startY: 50,
    head: [['Description', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 14, right: 14 },
  });
  
  // Monthly Breakdown
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Monthly Breakdown', 14, 20);
  
  const monthlyData = summary.monthlyData.map(m => [
    MONTHS[m.month - 1],
    `${m.income.toFixed(2)} DH`,
    `${m.expenses.toFixed(2)} DH`,
    `${m.balance.toFixed(2)} DH`,
  ]);
  
  doc.autoTable({
    startY: 25,
    head: [['Month', 'Income', 'Expenses', 'Balance']],
    body: monthlyData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 14, right: 14 },
  });
  
  // Payment Details by Apartment
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Payment Status by Apartment', 14, 20);
  
  const apartmentPayments = apartments.map(apt => {
    const aptPayments = payments.filter(p => p.apartment_id === apt.id);
    const paidCount = aptPayments.filter(p => p.status === 'paid').length;
    const totalPaid = aptPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    
    return [
      apt.apartment_number,
      apt.owner_name,
      `${paidCount}/12`,
      `${totalPaid.toFixed(2)} DH`,
    ];
  });
  
  doc.autoTable({
    startY: 25,
    head: [['Apt #', 'Owner', 'Paid Months', 'Total Paid']],
    body: apartmentPayments,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 14, right: 14 },
  });
  
  // Expenses Details
  if (expenses && expenses.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Expenses Details', 14, 20);
    
    const expenseData = expenses.map(exp => [
      new Date(exp.expense_date).toLocaleDateString(),
      exp.expense_categories?.name || 'N/A',
      exp.description.substring(0, 40) + (exp.description.length > 40 ? '...' : ''),
      `${parseFloat(exp.amount).toFixed(2)} DH`,
    ]);
    
    doc.autoTable({
      startY: 25,
      head: [['Date', 'Category', 'Description', 'Amount']],
      body: expenseData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 14, right: 14 },
    });
  }
  
  // Footer on each page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
  }
  
  // Save the PDF
  doc.save(`Syndic_Financial_Report_${year}.pdf`);
};

export const exportPaymentSheet = (year, apartments, payments, monthlyFee) => {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Annual Payment Tracking Sheet', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Year: ${year} | Monthly Fee: ${monthlyFee} DH`, pageWidth / 2, 22, { align: 'center' });
  
  // Prepare table data
  const tableData = apartments.map(apt => {
    const aptPayments = payments.filter(p => p.apartment_id === apt.id);
    const row = [apt.apartment_number, apt.owner_name];
    
    // Add payment status for each month
    for (let month = 1; month <= 12; month++) {
      const payment = aptPayments.find(p => p.month === month);
      row.push(payment?.status === 'paid' ? '✓' : '✗');
    }
    
    // Add total
    const paidCount = aptPayments.filter(p => p.status === 'paid').length;
    const totalPaid = paidCount * monthlyFee;
    row.push(`${totalPaid.toFixed(2)} DH`);
    
    return row;
  });
  
  doc.autoTable({
    startY: 28,
    head: [['Apt #', 'Owner', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], fontSize: 8 },
    bodyStyles: { fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 35 },
      14: { cellWidth: 20, fontStyle: 'bold' },
    },
    margin: { left: 10, right: 10 },
  });
  
  // Footer
  doc.setFontSize(10);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    pageWidth - 10,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'right' }
  );
  
  doc.save(`Payment_Tracking_${year}.pdf`);
};

