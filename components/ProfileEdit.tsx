
import React, { useState } from 'react';
import { Camera, Save, User, Mail, ShieldCheck, Download, Upload, Trash2, AlertTriangle, Cloud, LogOut } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface ProfileEditProps {
  user: any;
  setUser: (user: any) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, setUser }) => {
  const [name, setName] = useState(user?.user_metadata?.full_name || user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photo, setPhoto] = useState(user?.user_metadata?.avatar_url || user?.photoURL || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Atualiza no Supabase se houver sessão
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });
    
    if (!error) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 bento-card p-10 space-y-10">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <User size={24} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Identidade Nuvem</h2>
              <p className="text-sm text-gray-400 font-medium">Sincronizado com Supabase</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <img src={photo} className="w-32 h-32 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-2xl" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome de Exibição</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 glass-input rounded-2xl font-bold text-lg focus:outline-none"
                  placeholder="Seu nome"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail da Conta</label>
                <input 
                  type="email" 
                  value={email}
                  readOnly
                  className="w-full p-4 glass-input rounded-2xl font-bold text-lg opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="flex-1 btn-modern flex items-center justify-center gap-3 py-5 text-xl">
                <Save size={24} />
                Salvar
              </button>
              <button type="button" onClick={handleLogout} className="p-5 border border-rose-500/20 text-rose-500 rounded-2xl hover:bg-rose-500/5 transition-all">
                <LogOut size={24} />
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bento-card p-8 space-y-6 border-indigo-500/20 bg-indigo-500/[0.02]">
            <div className="flex items-center gap-3">
              <Cloud className="text-indigo-400" size={24} />
              <h3 className="font-black text-white uppercase text-xs tracking-widest">Status Supabase</h3>
            </div>
            <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
              <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Conexão Segura</p>
              <p className="text-xs text-green-300">Seus dados estão sendo criptografados e sincronizados com a infraestrutura cloud do Supabase em tempo real.</p>
            </div>
          </div>

          <div className="bento-card p-8 border-rose-500/20">
            <h3 className="font-black text-rose-500 uppercase text-xs tracking-widest mb-4">Gerenciar Dispositivo</h3>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="w-full py-4 border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Limpar Cache Local
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
