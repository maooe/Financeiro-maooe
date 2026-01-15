
import React, { useState, useEffect, useRef } from 'react';
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
import { syncWithGoogleSheets } from './services/googleSheetsService';
import { LayoutDashboard, Receipt, TrendingUp, UserCircle, Calendar as CalendarIcon, LayoutGrid, Palette, Globe } from 'lucide-react';

type ThemeMode = 'dark' | 'light' | 'pride' | 'bw' | 'parchment';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hasKeys, setHasKeys] = useState(true);
  
  // Ref tipada como number | null para evitar conflito com NodeJS.Timeout no build
  const syncTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('maooe_theme_mode') as ThemeMode;
    if (storedTheme) {
      setThemeMode(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }

    const params = new URLSearchParams(window.location.search);
    const scriptUrl = params.get('script');
    if (scriptUrl) {
      localStorage.setItem('maooe_google_script_url', decodeURIComponent(scriptUrl));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('maooe_theme_mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem('maooe_accounts');
    const storedIncomes = localStorage.getItem('maooe_incomes');
    const storedNotes = localStorage.getItem('maooe_notes');
    const storedAppts = localStorage.getItem('maooe_appointments');
    
    if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
    if (storedIncomes) setIncomes(JSON.parse(storedIncomes));
    if (storedNotes) setNotes(JSON.parse(storedNotes));
    if (storedAppts) setAppointments(JSON.parse(storedAppts));

    const url = process.env.SUPABASE_URL;
    if (!url || url.includes('placeholder')) setHasKeys(false);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('maooe_accounts', JSON.stringify(accounts));
    localStorage.setItem('maooe_incomes', JSON.stringify(incomes));
    localStorage.setItem('maooe_notes', JSON.stringify(notes));
    localStorage.setItem('maooe_appointments', JSON.stringify(appointments));

    const googleUrl = localStorage.getItem('maooe_google_script_url');
    if (googleUrl) {
      if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = window.setTimeout(() => {
        syncWithGoogleSheets(googleUrl, { accounts, incomes, notes, appointments });
      }, 3000); 
    }
  }, [accounts, incomes, notes, appointments]);

  const handleImportData = (data: any) => {
    if (data.accounts) setAccounts(data.accounts);
    if (data.incomes) setIncomes(data.incomes);
    if (data.notes) setNotes(data.notes);
    if (data.appointments) setAppointments(data.appointments);
  };

  const handleLogin = async () => {
    if (!hasKeys) {
      setUser({ id: 'local-user', email: 'offline@maooe.pro', user_metadata: { full_name: 'Investidor Local' } });
      return;
    }
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const nextTheme = () => {
    const modes: ThemeMode[] = ['dark', 'light', 'pride', 'bw'];
    const currentIdx = modes.indexOf(themeMode as any);
    setThemeMode(modes[(currentIdx + 1) % modes.length]);
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-6">
        <div className="bento-card p-10 md:p-14 max-w-lg w-full text-center space-y-12 border-white/10 shadow-2xl">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white">MAOOE</h1>
            <p className="text-indigo-400 font-bold uppercase text-[10px] tracking-[0.5em] ml-2">Intelligence & Assets</p>
          </div>
          <button onClick={handleLogin} className="w-full btn-modern flex items-center justify-center gap-4 py-6 shadow-2xl group text-lg">
            <Globe size={22} className="group-hover:animate-spin-slow" />
            Entrar no Terminal
          </button>
          <button onClick={() => setUser({ id: 'guest', email: 'guest@maooe.pro' })} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-indigo-400 transition-colors">
            Acessar como Visitante
          </button>
        </div>
      </div>
    );
  }

  const mobileMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'calendar', icon: CalendarIcon },
    { id: 'accounts', icon: Receipt },
    { id: 'income', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative z-10 animate-in fade-in duration-1000">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={() => setUser(null)} 
      />

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 z-[110] flex items-center justify-around p-4 pb-10">
        {mobileMenuItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500'}`}
          >
            <item.icon size={22} />
          </button>
        ))}
        <button onClick={() => setActiveTab('profile')} className={`p-4 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500'}`}>
          <UserCircle size={22} />
        </button>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-transparent">
        <header className="flex items-center justify-between p-6 md:p-10 sticky top-0 z-40 bg-[#050505]/40 md:bg-transparent backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-5">
             <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><LayoutGrid size={20} className="text-indigo-400" /></div>
             <div>
               <h1 className="text-xl md:text-2xl font-black tracking-tight text-theme-main uppercase">
                 {activeTab}
               </h1>
             </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
             <button onClick={nextTheme} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-theme-main border border-white/5 group">
               <Palette size={20} className="group-active:rotate-90 transition-transform" />
             </button>
             <div onClick={() => setActiveTab('profile')} className="flex items-center gap-4 p-1.5 md:pr-6 bg-white/5 rounded-[22px] border border-white/5 cursor-pointer hover:border-white/20 transition-all">
               <img src={user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'} className="w-10 h-10 md:w-11 md:h-11 rounded-2xl object-cover shadow-lg" alt="Profile" />
               <div className="hidden md:block text-left">
                 <p className="text-xs font-black text-theme-main leading-none mb-1.5 uppercase tracking-tighter">{user?.user_metadata?.full_name || 'Usuário Elite'}</p>
                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] opacity-80">Membro Premium</span>
               </div>
             </div>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-12 pb-32 md:pb-12">
          <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
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
            {activeTab === 'profile' && (
              <ProfileEdit 
                user={user} 
                setUser={setUser} 
                appData={{ accounts, incomes, notes, appointments }} 
                onImportData={handleImportData}
              />
            )}
          </div>
        </main>
        <AIAgent appData={{ accounts, incomes, appointments }} />
      </div>
    </div>
  );
};

export default App;
