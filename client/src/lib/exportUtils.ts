import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function downloadCSV(data: any[], filename: string, headers: string[]) {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header.toLowerCase().replace(/ /g, '')] || 
                     row[header.toLowerCase().replace(/ /g, '_')] || 
                     row[header] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadExcel(data: any[], filename: string, sheetName: string = 'Report') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function downloadPDF(
  title: string,
  data: any[],
  columns: { header: string; dataKey: string }[],
  filename: string,
  summary?: { label: string; value: string | number }[]
) {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  let startY = 40;
  
  if (summary && summary.length > 0) {
    doc.setFontSize(12);
    doc.text('Summary:', 14, startY);
    startY += 8;
    
    doc.setFontSize(10);
    summary.forEach((item, index) => {
      doc.text(`${item.label}: ${item.value}`, 14, startY + (index * 6));
    });
    startY += summary.length * 6 + 10;
  }
  
  autoTable(doc, {
    startY: startY,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.dataKey] ?? '')),
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
  });
  
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
