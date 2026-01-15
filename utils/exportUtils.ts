
import { Account, Income } from '../types';

/**
 * Converte os dados financeiros em uma string CSV e dispara o download.
 * Formatação otimizada para Google Sheets e importação direta no Drive.
 */
export const exportToCSV = (accounts: Account[], incomes: Income[]) => {
  const headers = ['Módulo', 'Descrição', 'Fonte/Banco', 'Data Vencimento/Recebimento', 'Status Atual', 'Valor Bruto (R$)'];
  
  const accountRows = accounts.map(a => [
    'SAÍDA (Conta)',
    a.description,
    a.bank,
    a.paymentDate,
    a.status.toUpperCase(),
    a.value.toFixed(2).replace('.', ',') // Formato brasileiro para planilhas
  ]);

  const incomeRows = incomes.map(i => [
    'ENTRADA (Receita)',
    i.serviceType,
    i.client,
    i.paymentDates[0] || '',
    i.status.toUpperCase(),
    i.amount.toFixed(2).replace('.', ',')
  ]);

  // BOM para garantir acentuação correta no Excel/Sheets
  const BOM = '\uFEFF';
  const csvContent = [
    headers.join(';'), // Ponto e vírgula é melhor aceito por planilhas BR
    ...accountRows.map(row => row.join(';')),
    ...incomeRows.map(row => row.join(';'))
  ].join('\n');

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `maooe-finance-export-${dateStr}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
