
export enum AccountStatus {
  ON_TIME = 'em dia',
  PAID = 'pago',
  SCHEDULED = 'agendado',
  IN_ANALYSIS = 'em análise',
  LATE = 'em atraso',
  CANCELLED = 'cancelado'
}

export enum IncomeStatus {
  PENDING = 'pendente',
  RECEIVED = 'recebido',
  OVERDUE = 'atrasado'
}

export enum AccountType {
  PERSONAL = 'Pessoal',
  BUSINESS = 'Empresarial'
}

export interface Account {
  id: string;
  description: string;
  category: string;
  type: AccountType;
  paymentDate: string;
  reminder: boolean;
  paymentMethod: string;
  bank: string;
  status: AccountStatus;
  value: number;
}

export interface Income {
  id: string;
  client: string;
  serviceType: string;
  amount: number;
  installments: boolean;
  installmentCount?: number;
  paymentDates: string[];
  paymentMethod: string;
  observation: string;
  status: IncomeStatus;
}

export interface Note {
  id: string;
  content: string;
  color: string;
}

export interface Appointment {
  id: string;
  date: string; // Formato YYYY-MM-DD
  title: string;
  time: string;
  category: string;
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
}
