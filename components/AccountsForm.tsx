
import React, { useState } from 'react';
import { Account, AccountStatus, AccountType } from '../types';
import { BANKS, STATUS_COLORS } from '../constants';
import { Plus, Bell, Trash2 } from 'lucide-react';

interface AccountsFormProps {
  accounts: Account[];
  onAdd: (account: Account) => void;
  onDelete: (id: string) => void;
}

const AccountsForm: React.FC<AccountsFormProps> = ({ accounts, onAdd, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Account>>({
    type: AccountType.PERSONAL,
    status: AccountStatus.ON_TIME,
    bank: 'Nubank',
    paymentMethod: 'Pix',
    reminder: false,
    value: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.value) return;

    const newAccount: Account = {
      id: Date.now().toString(),
      description: formData.description!,
      category: formData.category || 'Geral',
      type: formData.type!,
      paymentDate: formData.paymentDate || new Date().toISOString().split('T')[0],
      reminder: formData.reminder!,
      paymentMethod: formData.paymentMethod!,
      bank: formData.bank!,
      status: formData.status!,
      value: Number(formData.value)
    };

    onAdd(newAccount);
    setFormData({ ...formData, description: '', value: 0 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bento-card p-8 rounded-3xl" role="region" aria-labelledby="form-title">
        <h3 id="form-title" className="text-xl font-bold mb-8 uppercase text-xs tracking-[0.2em] opacity-70">Novo Lançamento</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full flex gap-4 mb-4" role="radiogroup" aria-label="Tipo de conta">
            <button
              type="button"
              role="radio"
              aria-checked={formData.type === AccountType.PERSONAL}
              onClick={() => setFormData({ ...formData, type: AccountType.PERSONAL })}
              className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                formData.type === AccountType.PERSONAL 
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                : 'border-white/10 text-gray-500 bg-white/5'
              }`}
            >
              PESSOAL
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={formData.type === AccountType.BUSINESS}
              onClick={() => setFormData({ ...formData, type: AccountType.BUSINESS })}
              className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                formData.type === AccountType.BUSINESS 
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                : 'border-white/10 text-gray-500 bg-white/5'
              }`}
            >
              BUSINESS
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="acc-desc" className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Descrição</label>
            <input
              id="acc-desc"
              type="text"
              required
              className="w-full p-4 glass-input rounded-2xl font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="Ex: Aluguel, Internet..."
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="acc-val" className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Valor (R$)</label>
            <input
              id="acc-val"
              type="number"
              step="0.01"
              required
              className="w-full p-4 glass-input rounded-2xl font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={formData.value || ''}
              onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="acc-date" className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Vencimento</label>
            <input
              id="acc-date"
              type="date"
              className="w-full p-4 glass-input rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={formData.paymentDate || ''}
              onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="acc-bank" className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Instituição</label>
            <select
              id="acc-bank"
              className="w-full p-4 glass-input rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={formData.bank}
              onChange={e => setFormData({ ...formData, bank: e.target.value })}
            >
              {BANKS.map(b => <option key={b} value={b} className="bg-slate-900">{b}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="acc-status" className="text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest ml-1">Status Atual</label>
            <select
              id="acc-status"
              className="w-full p-4 glass-input rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as AccountStatus })}
            >
              {Object.values(AccountStatus).map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
            </select>
          </div>

          <div className="flex items-center space-x-3 md:mt-8">
            <label htmlFor="acc-reminder" className="flex items-center cursor-pointer group">
              <input 
                id="acc-reminder"
                type="checkbox" 
                className="w-6 h-6 rounded-lg text-indigo-500 bg-white/10 border-white/20 focus:ring-indigo-500 focus:ring-2 mr-3 transition-all" 
                checked={formData.reminder}
                onChange={e => setFormData({ ...formData, reminder: e.target.checked })}
              />
              <span className="text-sm font-bold text-gray-400 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">Lembrete Ativo</span>
              <Bell size={18} className="text-indigo-500 ml-2 animate-pulse" aria-hidden="true" />
            </label>
          </div>

          <div className="col-span-full mt-6">
            <button
              type="submit"
              className="w-full btn-modern py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
              <Plus size={24} aria-hidden="true" />
              CONFIRMAR LANÇAMENTO
            </button>
          </div>
        </form>
      </div>

      <div className="bento-card rounded-3xl overflow-hidden" role="region" aria-labelledby="history-title">
        <div className="p-8 border-b border-white/5">
          <h3 id="history-title" className="text-lg font-bold uppercase text-xs tracking-widest opacity-60">Histórico de Movimentações</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Descrição</th>
                <th className="px-8 py-5">Vencimento</th>
                <th className="px-8 py-5">Valor</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {accounts.map(account => (
                <tr key={account.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div 
                        role="status"
                        aria-label={`Status: ${account.status}`}
                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px] shadow-current" 
                        style={{ backgroundColor: STATUS_COLORS[account.status], color: STATUS_COLORS[account.status] }} 
                      />
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: STATUS_COLORS[account.status] }}>
                        {account.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-white dark:text-white">{account.description}</span>
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{account.bank} • {account.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-400">{new Date(account.paymentDate).toLocaleDateString()}</td>
                  <td className="px-8 py-5 font-black text-lg">R$ {account.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => onDelete(account.id)}
                      aria-label={`Excluir lançamento ${account.description}`}
                      className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    >
                      <Trash2 size={20} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">Aguardando dados...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountsForm;
