
import React from 'react';
import { AccountStatus, IncomeStatus, Theme } from './types';

export const STATUS_COLORS: Record<AccountStatus, string> = {
  [AccountStatus.ON_TIME]: '#3b82f6', // blue
  [AccountStatus.PAID]: '#10b981',    // green
  [AccountStatus.SCHEDULED]: '#f59e0b', // amber
  [AccountStatus.IN_ANALYSIS]: '#8b5cf6', // purple
  [AccountStatus.LATE]: '#ef4444',     // red
  [AccountStatus.CANCELLED]: '#6b7280'  // gray
};

export const INCOME_STATUS_COLORS: Record<IncomeStatus, string> = {
  [IncomeStatus.PENDING]: '#f59e0b',
  [IncomeStatus.RECEIVED]: '#10b981',
  [IncomeStatus.OVERDUE]: '#ef4444'
};

export const THEMES: Theme[] = [
  {
    id: 'maooe',
    name: 'maooe Default',
    primary: '#006b3f',
    secondary: '#7fbc41',
    gradient: 'linear-gradient(180deg, #006b3f 0%, #7fbc41 100%)'
  },
  {
    id: 'dark',
    name: 'Night Mode',
    primary: '#1e293b',
    secondary: '#334155',
    gradient: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#581c87',
    secondary: '#a855f7',
    gradient: 'linear-gradient(180deg, #581c87 0%, #a855f7 100%)'
  }
];

export const BANKS = [
  'Pic Pay', 'Mercado pago', 'Nubank', 'Itaú', 'Caixa', 
  'Bradesco', 'Santander', 'Unicred', 'Sicoob', 'Sicred', 'Outro'
];

export const PAYMENT_METHODS = ['Pix', 'Débito em conta', 'Cartão'];
