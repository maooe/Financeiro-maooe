
import React from 'react';
import { LayoutDashboard, Receipt, TrendingUp, StickyNote, UserCircle, LogOut, Zap, Calendar as CalendarIcon } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'calendar', label: 'Agenda Corporativa', icon: CalendarIcon },
    { id: 'accounts', label: 'Contas a Pagar', icon: Receipt },
    { id: 'income', label: 'Receitas', icon: TrendingUp },
    { id: 'notes', label: 'Sinais', icon: StickyNote },
    { id: 'profile', label: 'Ajustes', icon: UserCircle },
  ];

  return (
    <div 
      className={`hidden md:flex flex-col bg-transparent backdrop-blur-3xl border-r border-white/5 transition-all duration-500 ${collapsed ? 'w-24' : 'w-72'} h-screen sticky top-0 z-50`}
      role="navigation"
      aria-label="Menu Principal"
    >
      <div className="p-8 mb-4">
        <div className={`flex items-center gap-4 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/20" aria-hidden="true">
            <Zap size={24} className="text-white" />
          </div>
          {!collapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
              <h1 className="text-2xl font-black tracking-tighter text-theme-main">MAOOE</h1>
              <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Gestão Elite</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
            aria-label={item.label}
            className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 group relative focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              activeTab === item.id 
                ? 'bg-white/5 text-theme-main border border-white/10' 
                : 'text-theme-muted hover:text-theme-main hover:bg-white/5'
            }`}
          >
            {activeTab === item.id && (
              <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,1)]"></div>
            )}
            <item.icon size={20} className={activeTab === item.id ? 'text-indigo-400' : ''} aria-hidden="true" />
            {!collapsed && <span className="ml-4 font-bold text-sm tracking-tight">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <button 
          onClick={onLogout}
          aria-label="Sair da conta"
          className="w-full flex items-center justify-center p-4 text-theme-muted hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" aria-hidden="true" />
          {!collapsed && <span className="ml-4 font-bold text-sm">Sair</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
