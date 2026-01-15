
import React, { useState, useEffect } from 'react';
import { Account, Income, Note, Appointment } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AccountsForm from './components/AccountsForm';
import IncomeList from './components/IncomeList';
import PostIts from './components/PostIts';
import CalendarWidget from './components/CalendarWidget';
import CalendarView from './components/CalendarView';
import AIAgent from './components/AIAgent';
import ProfileEdit from './components/ProfileEdit';
import { supabase } from './services/supabaseClient';
import { Lock, LayoutGrid, CheckCircle2, RefreshCw, Palette, Cloud, Globe, LogIn, Mail, AlertCircle } from 'lucide-react';

type ThemeMode = 'dark' | 'light' | 'pride' | 'bw' | 'parchment';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasKeys, setHasKeys] = useState(true);

  // Verifica se as chaves existem de forma segura para o build
  useEffect(() => {
    try {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_ANON_KEY;
      if (!url || !key || url.includes('placeholder') || url === "") {
        setHasKeys(false);
      }
    } catch (e) {
      setHasKeys(false);
    }
  }, []);

  // Monitora Autenticação Supabase
  useEffect(() => {
    if (!hasKeys) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setUser(session.user);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, [hasKeys]);

  // Carrega dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setIsSyncing(true);
      
      const storedAccounts = localStorage.getItem('maooe_accounts');
      const storedIncomes = localStorage.getItem('maooe_incomes');
      const storedNotes = localStorage.getItem('maooe_notes');
      const storedAppts = localStorage.getItem('maooe_appointments');
      const storedThemeMode = localStorage.getItem('maooe_theme_mode') as ThemeMode;
      
      if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
      if (storedIncomes) setIncomes(JSON.parse(storedIncomes));
      if (storedNotes) setNotes(JSON.parse(storedNotes));
      if (storedAppts) setAppointments(JSON.parse(storedAppts));
      if (storedThemeMode) setThemeMode(storedThemeMode);
      
      setIsSyncing(false);
    };

    loadData();
  }, []);

  // Persistência Local (Sempre ativa como redundância)
  useEffect(() => {
    localStorage.setItem('maooe_accounts', JSON.stringify(accounts));
    localStorage.setItem('maooe_incomes', JSON.stringify(incomes));
    localStorage.setItem('maooe_notes', JSON.stringify(notes));
    localStorage.setItem('maooe_appointments', JSON.stringify(appointments));
    localStorage.setItem('maooe_theme_mode', themeMode);
  }, [accounts, incomes, notes, appointments, themeMode]);

  const handleLogin = async () => {
    if (!hasKeys) {
      alert("Configuração Cloud pendente no Vercel. Entrando em modo Offline.");
      setUser({ id: 'local-user', email: 'offline@maooe.pro', user_metadata: { full_name: 'Usuário Local' } });
      return;
    }
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const nextTheme = () => {
    const modes: ThemeMode[] = ['dark', 'light', 'pride', 'bw', 'parchment'];
    const currentIdx = modes.indexOf(themeMode);
    setThemeMode(modes[(currentIdx + 1) % modes.length]);
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-6">
        <div className="bento-card p-12 max-w-lg w-full text-center space-y-10 border-white/10">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter text-white">MAOOE</h1>
            <p className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest">Controle Financeiro de Elite</p>
          </div>
          
          {!hasKeys && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-left">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-[10px] text-amber-200 font-bold uppercase leading-tight">
                Atenção: Chaves Supabase não detectadas no Vercel. O modo Cloud está desativado.
              </p>
            </div>
          )}

          <div className="p-8 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 italic text-sm text-gray-400">
            "Sua conta será sincronizada entre todos os seus dispositivos."
          </div>

          <button onClick={handleLogin} className="w-full btn-modern flex items-center justify-center gap-4 py-5 shadow-2xl group text-lg">
            <Globe size={20} className="group-hover:animate-spin-slow" />
            Acessar Plataforma
          </button>
          
          <button onClick={() => setUser({ id: 'guest', email: 'guest@maooe.pro' })} className="text-xs font-black uppercase tracking-widest text-gray-600 hover:text-indigo-400 transition-colors">
            Entrar em modo Demonstrativo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row relative z-10 animate-in fade-in duration-1000 theme-${themeMode}`}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => hasKeys ? supabase.auth.signOut() : setUser(null)} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="hidden md:flex items-center justify-between p-6 px-10 sticky top-0 z-40 bg-transparent backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-6">
             <div className="p-2 bg-white/5 rounded-xl border border-white/10"><LayoutGrid size={18} className="text-indigo-400" /></div>
             <div>
               <h1 className="text-xl font-bold tracking-tight text-theme-main">
                 {activeTab === 'dashboard' ? 'Painel de Controle' : 'Seção Ativa'}
               </h1>
               <div className="flex items-center gap-2 mt-0.5">
                 {session ? <Cloud size={10} className="text-indigo-400" /> : <Globe size={10} className="text-gray-500" />}
                 <span className={`text-[8px] font-black uppercase tracking-widest ${session ? 'text-indigo-400' : 'text-gray-500'}`}>
                   {session ? 'Cloud Ativo (Supabase)' : 'Local Storage (Offline)'}
                 </span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <button onClick={nextTheme} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-theme-main border border-white/5">
               <Palette size={18} />
             </button>
             <div onClick={() => setActiveTab('profile')} className="flex items-center gap-3 p-1 pr-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
               <img src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150'} className="w-10 h-10 rounded-xl object-cover" alt="" />
               <div className="text-left">
                 <p className="text-xs font-bold text-theme-main leading-none mb-1">{user?.user_metadata?.full_name || 'Investidor'}</p>
                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Membro Elite</span>
               </div>
             </div>
          </div>
        </div>

        <main className="flex-1 p-6 md:p-10 pb-32 md:pb-10">
          <div className="max-w-7xl mx-auto space-y-10">
            {activeTab === 'dashboard' && (
              <>
                <CalendarWidget onNavigate={() => setActiveTab('calendar')} />
                <Dashboard accounts={accounts} incomes={incomes} notes={notes} setNotes={setNotes} />
              </>
            )}
            {activeTab === 'calendar' && <CalendarView appointments={appointments} onUpdateAppointments={setAppointments} />}
            {activeTab === 'accounts' && <AccountsForm accounts={accounts} onAdd={(a) => setAccounts([a, ...accounts])} onDelete={(id) => setAccounts(accounts.filter(a => a.id !== id))} />}
            {activeTab === 'income' && <IncomeList incomes={incomes} onAdd={(i) => setIncomes([i, ...incomes])} />}
            {activeTab === 'notes' && <PostIts notes={notes} setNotes={setNotes} />}
            {activeTab === 'profile' && <ProfileEdit user={user} setUser={setUser} />}
          </div>
        </main>
        <AIAgent appData={{ accounts, incomes, appointments }} />
      </div>
    </div>
  );
};

export default App;
