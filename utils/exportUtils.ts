
import { Account, Income } from '../types';

/**
 * Converte os dados financeiros em uma string CSV e dispara o download.
 */
export const exportToCSV = (accounts: Account[], incomes: Income[]) => {
  const headers = ['Tipo', 'Descrição/Fonte', 'Instituição/Serviço', 'Data', 'Status', 'Valor'];
  
  const accountRows = accounts.map(a => [
    'Despesa',
    a.description,
    a.bank,
    a.paymentDate,
    a.status,
    a.value.toFixed(2)
  ]);

  const incomeRows = incomes.map(i => [
    'Receita',
    i.client,
    i.serviceType,
    i.paymentDates[0] || '',
    i.status,
    i.amount.toFixed(2)
  ]);

  const csvContent = [
    headers.join(','),
    ...accountRows.map(row => row.join(',')),
    ...incomeRows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio-financeiro-maooe-${dateStr}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
