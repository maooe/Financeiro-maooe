
import React, { useState, useEffect, useRef } from 'react';
import { Account, Income, AccountType, Note } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AccountsForm from './components/AccountsForm';
import IncomeList from './components/IncomeList';
import PostIts from './components/PostIts';
import CalendarWidget from './components/CalendarWidget';
import AIAgent from './components/AIAgent';
import ProfileEdit from './components/ProfileEdit';
import NewsTicker from './components/NewsTicker';
import { Home, Receipt, TrendingUp, StickyNote, User, Lock, Database, Download, Upload, Moon, Sun, LayoutGrid, CheckCircle2, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Estados para o Sistema de Auto-Save
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    const storedAccounts = localStorage.getItem('maooe_accounts');
    const storedIncomes = localStorage.getItem('maooe_incomes');
    const storedNotes = localStorage.getItem('maooe_notes');
    const storedColor = localStorage.getItem('maooe_theme_color');
    const storedUser = localStorage.getItem('maooe_user');
    const storedThemeMode = localStorage.getItem('maooe_theme_mode') as any;
    
    if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
    if (storedIncomes) setIncomes(JSON.parse(storedIncomes));
    if (storedNotes) setNotes(JSON.parse(storedNotes));
    if (storedColor) setPrimaryColor(storedColor);
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedThemeMode) setThemeMode(storedThemeMode);
  }, []);

  // Efeito de Persistência (Auto-Save)
  useEffect(() => {
    const persistData = () => {
      setSaveStatus('saving');
      
      localStorage.setItem('maooe_accounts', JSON.stringify(accounts));
      localStorage.setItem('maooe_incomes', JSON.stringify(incomes));
      localStorage.setItem('maooe_notes', JSON.stringify(notes));
      localStorage.setItem('maooe_theme_color', primaryColor);
      localStorage.setItem('maooe_theme_mode', themeMode);
      if (user) localStorage.setItem('maooe_user', JSON.stringify(user));
      
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.setAttribute('data-theme', themeMode);

      // Simula um delay de rede/processamento para o feedback visual ser perceptível
      setTimeout(() => {
        setSaveStatus('saved');
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }, 600);
    };

    persistData();
  }, [accounts, incomes, notes, primaryColor, user, themeMode]);

  const handleLogin = () => {
    const defaultUser = {
      displayName: 'Investidor Premium',
      email: 'investidor@maooe.pro',
      photoURL: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=150',
      protocol: 'ID-' + Math.floor(Math.random() * 99999).toString()
    };
    setUser(defaultUser);
  };

  const exportData = () => {
    const data = { accounts, incomes, notes, theme: primaryColor, user };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-maooe-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.accounts) setAccounts(json.accounts);
        if (json.incomes) setIncomes(json.incomes);
        if (json.notes) setNotes(json.notes);
        if (json.theme) setPrimaryColor(json.theme);
        if (json.user) setUser(json.user);
        alert("Sistema restaurado com sucesso!");
      } catch (err) {
        alert("Erro ao importar arquivo. Verifique se o formato está correto.");
      }
    };
    reader.readAsText(file);
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#050505]">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="bento-card p-12 max-w-lg w-full text-center space-y-10 relative z-10 border border-white/10" role="main">
          <div className="space-y-4">
            <h1 className="text-7xl font-black italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
              MAOOE
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Gestão Patrimonial de Elite</p>
          </div>
          
          <button 
            onClick={handleLogin} 
            className="w-full btn-modern flex items-center justify-center gap-4 py-5 shadow-2xl focus:ring-4 focus:ring-indigo-500/40 outline-none"
            aria-label="Acessar painel financeiro"
          >
            <Lock size={20} aria-hidden="true" />
            <span className="text-lg">Entrar no Sistema</span>
          </button>
          
          <p className="text-[10px] text-gray-400 font-medium">Autenticação segura via Ecossistema MAOOE.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative z-10">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onLogout={() => setUser(null)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <NewsTicker />

        <div className="hidden md:flex items-center justify-between p-6 px-10 sticky top-0 z-40 bg-transparent backdrop-blur-md border-b border-white/5" role="banner">
          <div className="flex items-center gap-6">
             <div className="p-2 bg-white/5 rounded-xl border border-white/10" aria-hidden="true">
               <LayoutGrid size={18} className="text-indigo-400" />
             </div>
             <div>
               <h1 className="text-xl font-bold tracking-tight text-theme-main">
                 {activeTab === 'dashboard' ? 'Painel de Controle' : 
                  activeTab === 'accounts' ? 'Contas a Pagar' : 
                  activeTab === 'income' ? 'Gestão de Receitas' : 
                  activeTab === 'notes' ? 'Sinais de Alerta' : 
                  activeTab === 'profile' ? 'Configurações de Perfil' : 'Inteligência Artificial'}
               </h1>
               <div className="flex items-center gap-2 mt-0.5" aria-live="polite">
                 {saveStatus === 'saving' ? (
                   <>
                     <RefreshCw size={10} className="text-indigo-400 animate-spin" />
                     <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Salvando alterações...</span>
                   </>
                 ) : (
                   <>
                     <CheckCircle2 size={10} className="text-green-500" />
                     <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Sincronizado {lastSaved && `às ${lastSaved}`}</span>
                   </>
                 )}
               </div>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} 
                  className="p-2 hover:bg-white/10 rounded-xl transition-all focus:ring-2 focus:ring-indigo-500/50 outline-none text-theme-main"
                  aria-label={themeMode === 'dark' ? "Ativar modo claro" : "Ativar modo escuro"}
                >
                  {themeMode === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" aria-hidden="true"></div>
                <button 
                  onClick={exportData} 
                  title="Exportar Backup" 
                  className="p-2 hover:bg-white/10 rounded-xl transition-all focus:ring-2 focus:ring-indigo-500/50 outline-none text-theme-main"
                  aria-label="Fazer backup dos dados localmente"
                >
                  <Download size={18} aria-hidden="true" />
                </button>
                <label className="p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500/50 outline-none text-theme-main" title="Importar Backup">
                  <Upload size={18} aria-hidden="true" />
                  <input type="file" className="hidden" accept=".json" onChange={importData} aria-label="Restaurar dados de um arquivo JSON" />
                </label>
             </div>

             <button 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 p-1 pr-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all focus:ring-2 focus:ring-indigo-500/50 outline-none"
              aria-label="Acessar ajustes de perfil"
             >
               <img src={user.photoURL} className="w-10 h-10 rounded-xl object-cover" alt="" aria-hidden="true" />
               <div className="text-left">
                 <p className="text-xs font-bold text-theme-main leading-none mb-1">{user.displayName}</p>
                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{user.protocol}</span>
               </div>
             </button>
          </div>
        </div>

        <main className="flex-1 p-6 md:p-10 pb-32 md:pb-10" role="main" id="main-content">
          <div className="max-w-7xl mx-auto space-y-10">
            {activeTab === 'dashboard' && (
              <>
                <CalendarWidget />
                <Dashboard accounts={accounts} incomes={incomes} />
              </>
            )}
            
            {activeTab === 'accounts' && (
              <AccountsForm accounts={accounts} onAdd={(a) => setAccounts([a, ...accounts])} onDelete={(id) => setAccounts(accounts.filter(a => a.id !== id))} />
            )}

            {activeTab === 'income' && (
              <IncomeList incomes={incomes} onAdd={(i) => setIncomes([i, ...incomes])} />
            )}

            {activeTab === 'notes' && (
              <PostIts notes={notes} setNotes={setNotes} />
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <ProfileEdit user={user} setUser={setUser} />
                <section className="max-w-2xl mx-auto bento-card p-10 border-dashed border-indigo-500/30" aria-labelledby="data-management-title">
                  <div className="flex items-center gap-4 mb-6">
                    <Database size={24} className="text-indigo-400" aria-hidden="true" />
                    <h3 id="data-management-title" className="text-xl font-bold">Gestão Local de Dados</h3>
                  </div>
                  <p className="text-sm text-theme-muted mb-8 leading-relaxed">
                    Seus lançamentos são armazenados automaticamente neste navegador. Para usar em outro dispositivo ou prevenir perda de dados, utilize as ferramentas de exportação abaixo.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={exportData} className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm border border-white/10 focus:ring-2 focus:ring-indigo-500/50 outline-none text-theme-main">
                      <Download size={18} aria-hidden="true" />
                      Exportar Backup (.json)
                    </button>
                    <label className="flex items-center justify-center gap-3 p-4 bg-indigo-500/10 rounded-2xl hover:bg-indigo-500/20 transition-all font-bold text-sm border border-indigo-500/20 cursor-pointer text-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/50 outline-none">
                      <Upload size={18} aria-hidden="true" />
                      Restaurar de Arquivo
                      <input type="file" className="hidden" accept=".json" onChange={importData} />
                    </label>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>

        <AIAgent appData={{ accounts, incomes }} />

        <nav 
          className="md:hidden fixed bottom-6 left-6 right-6 bento-card p-2 flex justify-around items-end z-[101] border-white/10 shadow-2xl backdrop-blur-2xl bg-black/40"
          role="navigation" 
          aria-label="Navegação inferior mobile"
        >
          {[
            { id: 'dashboard', icon: Home, label: 'Painel' },
            { id: 'accounts', icon: Receipt, label: 'Contas' },
            { id: 'income', icon: TrendingUp, label: 'Ganhos' },
            { id: 'notes', icon: StickyNote, label: 'Sinais' },
            { id: 'profile', icon: User, label: 'Perfil' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-300 relative group outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                activeTab === tab.id ? 'text-indigo-400 -translate-y-1' : 'text-gray-400'
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute -top-1 w-1 h-1 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
              )}
              <tab.icon size={22} className={`${activeTab === tab.id ? 'scale-110' : 'group-active:scale-90 transition-transform'}`} aria-hidden="true" />
              <span className="text-[9px] font-black uppercase tracking-tighter transition-all">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
