
import React, { useState } from 'react';
import { Income, IncomeStatus } from '../types';
import { INCOME_STATUS_COLORS } from '../constants';
import { Filter, DollarSign, Plus } from 'lucide-react';

interface IncomeListProps {
  incomes: Income[];
  onAdd: (income: Income) => void;
}

const IncomeList: React.FC<IncomeListProps> = ({ incomes, onAdd }) => {
  const [filter, setFilter] = useState<IncomeStatus | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIncome, setNewIncome] = useState<Partial<Income>>({
    installments: false,
    status: IncomeStatus.PENDING,
    amount: 0
  });

  const filteredIncomes = filter === 'all' ? incomes : incomes.filter(i => i.status === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncome.client || !newIncome.amount) return;

    const income: Income = {
      id: Date.now().toString(),
      client: newIncome.client!,
      serviceType: newIncome.serviceType || 'Geral',
      amount: Number(newIncome.amount),
      installments: newIncome.installments!,
      installmentCount: newIncome.installmentCount,
      paymentDates: [new Date().toISOString().split('T')[0]],
      paymentMethod: newIncome.paymentMethod || 'Pix',
      observation: newIncome.observation || '',
      status: newIncome.status!
    };

    onAdd(income);
    setShowAddForm(false);
    setNewIncome({ installments: false, status: IncomeStatus.PENDING, amount: 0 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black tracking-tight mb-1">Ativos Financeiros</h2>
           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fluxo de Entradas e Recebíveis</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bento-card rounded-2xl px-4 py-2 text-sm relative">
            <Filter size={18} className="mr-3 text-indigo-500" aria-hidden="true" />
            <label htmlFor="income-filter" className="sr-only">Filtrar por status</label>
            <select 
              id="income-filter"
              value={filter} 
              onChange={e => setFilter(e.target.value as any)}
              className="bg-transparent border-none focus:ring-0 outline-none cursor-pointer font-black uppercase text-[10px] tracking-widest text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all" className="bg-slate-900">Todos</option>
              <option value={IncomeStatus.PENDING} className="bg-slate-900">Pendentes</option>
              <option value={IncomeStatus.RECEIVED} className="bg-slate-900">Recebidos</option>
              <option value={IncomeStatus.OVERDUE} className="bg-slate-900">Atrasados</option>
            </select>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            aria-expanded={showAddForm}
            aria-controls="add-income-form"
            className="flex items-center gap-2 btn-modern px-6 py-3 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            <Plus size={20} aria-hidden="true" />
            <span className="font-bold">Novo Ativo</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div 
          id="add-income-form"
          className="bento-card p-10 rounded-[2.5rem] animate-in fade-in zoom-in duration-300"
          role="region"
          aria-labelledby="add-income-title"
        >
          <h3 id="add-income-title" className="font-black mb-8 uppercase text-xs tracking-[0.3em] opacity-60 text-indigo-400">Registrar Injeção de Capital</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label htmlFor="client-name" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Fonte / Pagador</label>
              <input
                id="client-name"
                type="text"
                required
                className="w-full p-5 glass-input rounded-2xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Nome do cliente ou empresa"
                value={newIncome.client || ''}
                onChange={e => setNewIncome({...newIncome, client: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="service-nature" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Natureza do Serviço</label>
              <input
                id="service-nature"
                type="text"
                className="w-full p-5 glass-input rounded-2xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Consultoria, Venda, etc..."
                value={newIncome.serviceType || ''}
                onChange={e => setNewIncome({...newIncome, serviceType: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="income-amount" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Montante (R$)</label>
              <input
                id="income-amount"
                type="number"
                required
                className="w-full p-5 glass-input rounded-2xl font-black text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="0,00"
                value={newIncome.amount || ''}
                onChange={e => setNewIncome({...newIncome, amount: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pay-structure" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Estrutura de Pagamento</label>
              <select
                id="pay-structure"
                className="w-full p-5 glass-input rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={newIncome.installments ? 'sim' : 'não'}
                onChange={e => setNewIncome({...newIncome, installments: e.target.value === 'sim'})}
              >
                <option value="não" className="bg-slate-900">À Vista (Fluxo Único)</option>
                <option value="sim" className="bg-slate-900">Parcelado (Fluxo Recorrente)</option>
              </select>
            </div>
            {newIncome.installments && (
              <div className="space-y-2">
                <label htmlFor="inst-count" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nº de Amortizações</label>
                <input
                  id="inst-count"
                  type="number"
                  className="w-full p-5 glass-input rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Quantidade"
                  value={newIncome.installmentCount || ''}
                  onChange={e => setNewIncome({...newIncome, installmentCount: parseInt(e.target.value)})}
                />
              </div>
            )}
            <div className="col-span-full">
              <button type="submit" className="btn-modern w-full py-6 rounded-[1.5rem] font-black text-xl shadow-2xl transition-transform active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/50">
                REGISTRAR ATIVO
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
        {filteredIncomes.map(income => (
          <div 
            key={income.id} 
            role="listitem"
            className="bento-card p-8 rounded-[2rem] flex flex-col justify-between hover:border-indigo-500/30 transition-all"
            aria-labelledby={`income-client-${income.id}`}
          >
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl shadow-inner border border-white/5" aria-hidden="true">
                  <DollarSign size={28} />
                </div>
                <span 
                  role="status"
                  aria-label={`Status: ${income.status}`}
                  className="text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] border shadow-lg shadow-current/10" 
                  style={{ 
                    backgroundColor: `${INCOME_STATUS_COLORS[income.status]}20`,
                    color: INCOME_STATUS_COLORS[income.status],
                    borderColor: `${INCOME_STATUS_COLORS[income.status]}30`
                  }}
                >
                  {income.status}
                </span>
              </div>
              <h4 id={`income-client-${income.id}`} className="text-2xl font-black truncate mb-1">{income.client}</h4>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">{income.serviceType}</p>
              
              <div className="space-y-4 mb-8 p-6 bg-white/[0.03] rounded-3xl border border-white/5 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em]">Montante</span>
                  <span className="font-black text-2xl tracking-tight">R$ {income.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full h-px bg-white/5" aria-hidden="true"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em]">Estrutura</span>
                  <span className="font-bold text-gray-300 text-sm">{income.installments ? `Parcelado (${income.installmentCount}x)` : 'Fluxo Direto'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                aria-label={`Ver detalhes de ${income.client}`}
                className="flex-1 text-[10px] font-black text-indigo-400 bg-indigo-500/10 py-4 rounded-2xl hover:bg-indigo-500/20 transition-all uppercase tracking-[0.2em] border border-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                Detalhes
              </button>
              <button 
                aria-label={`Baixar comprovante de ${income.client}`}
                className="flex-1 text-[10px] font-black text-gray-500 bg-white/5 py-4 rounded-2xl hover:bg-white/10 transition-all uppercase tracking-[0.2em] border border-white/5 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Download
              </button>
            </div>
          </div>
        ))}
        {filteredIncomes.length === 0 && (
          <div className="col-span-full py-24 text-center bento-card border-dashed">
            <p className="text-gray-500 font-black uppercase text-xs tracking-[0.4em]">Zero Ativos Encontrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeList;
