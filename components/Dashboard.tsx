
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Line, Legend, ComposedChart, Area, AreaChart } from 'recharts';
import { Account, Income, AccountStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { TrendingDown, TrendingUp, Wallet, Download, ArrowUpRight, Zap, PieChart as PieIcon, Activity, FileText, Table } from 'lucide-react';
import { generateFinancialPDF } from '../utils/pdfGenerator';
import { exportToCSV } from '../utils/exportUtils';

interface DashboardProps {
  accounts: Account[];
  incomes: Income[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, incomes }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const totalExpense = accounts.reduce((acc, curr) => acc + curr.value, 0);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const statusData = Object.values(AccountStatus).map(status => ({
    name: status,
    value: accounts.filter(a => a.status === status).reduce((acc, curr) => acc + curr.value, 0)
  })).filter(d => d.value > 0);

  const stats = [
    { label: 'Entradas Totais', val: totalIncome, icon: TrendingUp, color: '#10b981', trend: '+12%' },
    { label: 'Saídas Previstas', val: totalExpense, icon: TrendingDown, color: '#f43f5e', trend: '-2%' },
    { label: 'Capital Líquido', val: balance, icon: Wallet, color: '#6366f1', trend: 'Estável' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Monitoramento Global</p>
          <h2 className="text-4xl font-black tracking-tighter">Análise Consolidada</h2>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            aria-haspopup="true"
            aria-expanded={showExportMenu}
            aria-controls="export-dropdown"
            className="btn-modern !py-3 !px-6 flex items-center gap-2 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            <Download size={18} aria-hidden="true" />
            <span className="text-sm">Exportar Dados</span>
          </button>
          
          {showExportMenu && (
            <div 
              id="export-dropdown"
              role="menu"
              className="absolute right-0 mt-3 w-56 bento-card border border-white/10 p-2 z-[110] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <button 
                role="menuitem"
                onClick={() => { generateFinancialPDF(accounts, incomes); setShowExportMenu(false); }}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-left group focus:outline-none focus:bg-white/10"
              >
                <div className="p-2 bg-red-500/10 text-red-400 rounded-lg group-hover:scale-110 transition-transform" aria-hidden="true">
                  <FileText size={16} />
                </div>
                <span className="text-xs font-bold text-gray-300">Relatório PDF</span>
              </button>
              <button 
                role="menuitem"
                onClick={() => { exportToCSV(accounts, incomes); setShowExportMenu(false); }}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-left group mt-1 focus:outline-none focus:bg-white/10"
              >
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg group-hover:scale-110 transition-transform" aria-hidden="true">
                  <Table size={16} />
                </div>
                <span className="text-xs font-bold text-gray-300">Planilha CSV</span>
              </button>
            </div>
          )}
          {showExportMenu && <div className="fixed inset-0 z-[105]" onClick={() => setShowExportMenu(false)}></div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
        {stats.map((s, i) => (
          <div key={i} role="listitem" className="bento-card p-8 group overflow-hidden relative" aria-labelledby={`stat-label-${i}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
              <s.icon size={120} />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:border-indigo-500/50 transition-all" aria-hidden="true">
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase py-1 px-3 bg-white/5 rounded-full text-gray-500">{s.trend}</span>
            </div>
            <p id={`stat-label-${i}`} className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{s.label}</p>
            <h3 className="text-3xl font-black tracking-tight">R$ {s.val.toLocaleString('pt-BR')}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bento-card p-8 h-[500px]" role="region" aria-label="Gráfico de Fluxo de Caixa">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-indigo-400" aria-hidden="true" />
              <h4 className="font-black uppercase text-xs tracking-[0.2em]">Fluxo de Caixa Mensal</h4>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={[
              { name: 'Set', val: 3200 }, { name: 'Out', val: 4500 }, 
              { name: 'Nov', val: 3800 }, { name: 'Dez', val: 5100 }, 
              { name: 'Jan', val: totalIncome || 1 }
            ]}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="val" stroke="#6366f1" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-4 bento-card p-8 h-[500px] flex flex-col" role="region" aria-label="Distribuição de Gastos">
          <div className="flex items-center gap-3 mb-8">
            <PieIcon size={18} className="text-purple-400" aria-hidden="true" />
            <h4 className="font-black uppercase text-xs tracking-[0.2em]">Distribuição de Saídas</h4>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData.length > 0 ? statusData : [{name: 'Sem dados', value: 1}]} cx="50%" cy="45%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                  {statusData.length > 0 ? statusData.map((e, i) => (
                    <Cell key={i} fill={STATUS_COLORS[e.name as AccountStatus] || '#888'} fillOpacity={0.8} />
                  )) : <Cell fill="#333" />}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
             {statusData.slice(0, 3).map((d, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[d.name as AccountStatus] }} aria-hidden="true"></div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.name}</span>
                 </div>
                 <span className="text-xs font-black">R$ {d.value.toLocaleString('pt-BR')}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
