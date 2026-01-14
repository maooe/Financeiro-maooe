
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Account, Income } from '../types';

export const generateFinancialPDF = (accounts: Account[], incomes: Income[]) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('pt-BR');
  
  const totalExpense = accounts.reduce((acc, curr) => acc + curr.value, 0);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Header
  doc.setFillColor(0, 107, 63); // Cor primária maooe
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('INVEST MAOOE', 14, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório Consolidado de Investimentos e Despesas', 14, 30);
  doc.text(`Gerado em: ${dateStr}`, 160, 30);

  // Summary Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Executivo', 14, 55);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Receitas: R$ ${totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 65);
  doc.text(`Total de Despesas: R$ ${totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 72);
  
  if (balance >= 0) {
    doc.setTextColor(0, 107, 63);
    doc.text(`Saldo Líquido: R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Superavit)`, 14, 79);
  } else {
    doc.setTextColor(244, 63, 94);
    doc.text(`Saldo Líquido: R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Deficit)`, 14, 79);
  }

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalhamento de Contas a Pagar', 14, 95);
  
  (doc as any).autoTable({
    startY: 100,
    head: [['Descrição', 'Banco', 'Vencimento', 'Status', 'Valor']],
    body: accounts.map(a => [
      a.description,
      a.bank,
      a.paymentDate,
      a.status.toUpperCase(),
      `R$ ${a.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]),
    headStyles: { fillStyle: 'F', fillColor: [0, 107, 63] },
    alternateRowStyles: { fillColor: [240, 250, 245] },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.text('Detalhamento de Recebíveis', 14, finalY);

  (doc as any).autoTable({
    startY: finalY + 5,
    head: [['Cliente/Fonte', 'Serviço', 'Forma', 'Status', 'Valor']],
    body: incomes.map(i => [
      i.client,
      i.serviceType,
      i.paymentMethod,
      i.status.toUpperCase(),
      `R$ ${i.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]),
    headStyles: { fillStyle: 'F', fillColor: [0, 107, 63] },
    alternateRowStyles: { fillColor: [240, 250, 245] },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Invest maooe - Gestão Inteligente de Finanças - 2026', 70, 285);
  }

  doc.save(`relatorio-invest-maooe-${dateStr.replace(/\//g, '-')}.pdf`);
};
