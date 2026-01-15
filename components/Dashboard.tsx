
import React, { useState } from 'react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Account, Income, AccountStatus, Note } from '../types';
import { STATUS_COLORS } from '../constants';
import { TrendingDown, TrendingUp, Wallet, Download, Activity, FileText, Table, PieChart as PieIcon, StickyNote, Plus, X, Lightbulb, Sparkles, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { generateFinancialPDF } from '../utils/pdfGenerator';
import { exportToCSV } from '../utils/exportUtils';
import { queryAIAgent } from '../services/geminiService';
import NewsTicker from './NewsTicker';

interface DashboardProps {
  accounts: Account[];
  incomes: Income[];
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, incomes, notes, setNotes }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);
  
  const totalExpense = accounts.reduce((acc, curr) => acc + curr.value, 0);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Radar de Vencimentos: Filtra contas em dia ou agendadas e ordena por data
  const upcomingBills = accounts
    .filter(a => a.status === AccountStatus.ON_TIME || a.status === AccountStatus.SCHEDULED)
    .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
    .slice(0, 4);

  const statusData = Object.values(AccountStatus).map(status => ({
    name: status,
    value: accounts.filter(a => a.status === status).reduce((acc, curr) => acc + curr.value, 0)
  })).filter(d => d.value > 0);

  const stats = [
    { label: 'Entradas Totais', val: totalIncome, icon: TrendingUp, color: '#10b981', trend: '+12%' },
    { label: 'Saídas Previstas', val: totalExpense, icon: TrendingDown, color: '#f43f5e', trend: '-2%' },
    { label: 'Capital Líquido', val: balance, icon: Wallet, color: '#6366f1', trend: 'Estável' },
  ];

  const generateTips = async () => {
    setIsGeneratingTips(true);
    const prompt = `Com base em um saldo líquido de R$ ${balance}, despesas totais de R$ ${totalExpense} e receitas de R$ ${totalIncome}, forneça 3 dicas de investimento curtas. Formate como lista separada por ';'`;
    const result = await queryAIAgent(prompt, { accounts, incomes });
    setAiTips(result.split(';').map(t => t.trim()).filter(t => t.length > 5));
    setIsGeneratingTips(false);
  };

  const addNote = () => {
    const colors = ['#fef3c7', '#dcfce7', '#e0f2fe', '#fce7f3', '#ede9fe'];
    setNotes([{ id: Date.now().toString(), content: '', color: colors[Math.floor(Math.random() * colors.length)] }, ...notes]);
  };

  const getDaysDiff = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      
      <div className="bento-card overflow-hidden">
        <NewsTicker />
      </div>

      <div className="flex justify-between items-end gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Painel Operacional</p>
          <h2 className="text-4xl font-black tracking-tighter text-theme-main">Seu Panorama 2026</h2>
        </div>
        <button onClick={() => setShowExportMenu(!showExportMenu)} className="btn-modern flex items-center gap-2 shadow-lg">
          <Download size={18} />
          <span className="text-sm">Exportar</span>
        </button>
      </div>

      {/* Grid Central: Radar de Vencimentos e Insights IA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Radar de Vencimentos (Novo) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <AlertCircle size={18} className="text-rose-500" />
              <h4 className="font-black uppercase text-xs tracking-[0.2em] text-theme-main">Radar de Vencimentos</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {upcomingBills.length > 0 ? upcomingBills.map((bill) => {
                const daysLeft = getDaysDiff(bill.paymentDate);
                const isUrgent = daysLeft <= 2;
                return (
                  <div key={bill.id} className={`p-5 rounded-3xl bento-card border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all ${isUrgent ? 'bg-rose-500/[0.03]' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${isUrgent ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-gray-400'}`}>
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-theme-main">{bill.description}</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{bill.bank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-theme-main">R$ {bill.value.toLocaleString('pt-BR')}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isUrgent ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        {daysLeft === 0 ? 'Vence Hoje' : daysLeft === 1 ? 'Vence Amanhã' : `Em ${daysLeft} dias`}
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-10 bento-card border-dashed flex items-center justify-center opacity-40 text-xs font-black uppercase tracking-widest">Céu Limpo: Sem Contas Próximas</div>
              )}
            </div>
          </div>

          {/* Insights do Oráculo (Ajustado) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <Lightbulb size={18} className="text-indigo-400" />
                <h4 className="font-black uppercase text-xs tracking-[0.2em] text-theme-main">Insights IA</h4>
              </div>
              <button onClick={generateTips} disabled={isGeneratingTips} className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                {isGeneratingTips ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              </button>
            </div>
            <div className="space-y-3">
               {aiTips.length > 0 ? aiTips.slice(0, 3).map((tip, idx) => (
                <div key={idx} className="p-5 rounded-3xl bento-card border-indigo-500/20 bg-indigo-500/[0.02]">
                  <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">"{tip}"</p>
                </div>
               )) : (
                <div className="p-10 bento-card border-dashed flex items-center justify-center opacity-40 text-xs font-black uppercase tracking-widest">Aguardando IA...</div>
               )}
            </div>
          </div>
      </div>

      {/* Sinais Ativos e Análise Consolidada */}
      <div className="space-y-8 pt-10 border-t border-white/5">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <StickyNote size={18} className="text-yellow-400" />
            <h4 className="font-black uppercase text-xs tracking-[0.2em] text-theme-main">Sinais Ativos</h4>
          </div>
          <button onClick={addNote} className="p-2 bg-white/5 text-gray-400 rounded-lg border border-white/10"><Plus size={14} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notes.slice(0, 4).map(note => (
            <div key={note.id} className="p-4 rounded-2xl relative min-h-[100px] border border-white/5" style={{ backgroundColor: `${note.color}cc` }}>
              <textarea className="w-full h-full bg-transparent border-none focus:ring-0 text-gray-800 font-bold text-[11px] resize-none leading-tight" value={note.content} onChange={e => setNotes(notes.map(n => n.id === note.id ? {...n, content: e.target.value} : n))} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {stats.map((s, i) => (
            <div key={i} className="bento-card p-8 group overflow-hidden relative border-white/10">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><s.icon size={120} /></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:border-indigo-500/50 transition-all"><s.icon size={22} style={{ color: s.color }} /></div>
                <span className="text-[10px] font-black tracking-widest uppercase py-1 px-3 bg-white/5 rounded-full text-gray-500">{s.trend}</span>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{s.label}</p>
              <h3 className="text-3xl font-black tracking-tight text-theme-main">R$ {s.val.toLocaleString('pt-BR')}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bento-card p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ name: 'Jan', val: totalIncome || 1 }, { name: 'Fev', val: (totalIncome * 0.9) }, { name: 'Mar', val: balance }]}>
                <defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="val" stroke="#6366f1" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-4 bento-card p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData.length > 0 ? statusData : [{name: 'Sem dados', value: 1}]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                  {statusData.map((e, i) => (<Cell key={i} fill={STATUS_COLORS[e.name as AccountStatus]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
