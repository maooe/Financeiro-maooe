
import React, { useState, useEffect } from 'react';
import { Camera, Save, User, Cloud, LogOut, FileSpreadsheet, Database, Info, CheckCircle2, Link as LinkIcon, RefreshCw, Copy, ExternalLink, ShieldCheck, AlertTriangle, ChevronRight, Zap, HelpCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { syncWithGoogleSheets } from '../services/googleSheetsService';

interface ProfileEditProps {
  user: any;
  setUser: (user: any) => void;
  appData?: any;
  onImportData?: (data: any) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, setUser, appData, onImportData }) => {
  const [name, setName] = useState(user?.user_metadata?.full_name || user?.displayName || 'Investidor');
  const [isSaved, setIsSaved] = useState(false);
  const [googleScriptUrl, setGoogleScriptUrl] = useState(localStorage.getItem('maooe_google_script_url') || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  useEffect(() => {
    setCurrentOrigin(window.location.origin);
  }, []);

  const isConnected = googleScriptUrl.startsWith('https://script.google.com/macros/s/') && googleScriptUrl.includes('/exec');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maooe_google_script_url', googleScriptUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const copyOrigin = () => {
    navigator.clipboard.writeText(currentOrigin);
    alert("Link do Terminal Copiado!\n\nCole este link na variável VERCEL_URL no arquivo 'google_redirect.html' do Google.");
  };

  const handleManualSync = async () => {
    if (!isConnected) return;
    setIsSyncing(true);
    try {
      await syncWithGoogleSheets(googleScriptUrl, appData);
      alert("Terminal Sincronizado!");
    } catch (e) {
      alert("Erro ao enviar. Verifique se o link está correto e se o acesso está para 'Qualquer Pessoa'.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImport = async () => {
    if (!isConnected) return;
    setIsSyncing(true);
    try {
      const response = await fetch(googleScriptUrl + (googleScriptUrl.includes('?') ? '&api=true' : '?api=true'));
      const data = await response.json();
      if (onImportData) onImportData(data);
      alert("Dados Baixados da Planilha!");
    } catch (e) {
      alert("Erro 404 ou Conexão: O link do Google parece inválido ou expirado.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Fix: Defined handleLogout to resolve the "Cannot find name 'handleLogout'" error on line 200.
  const handleLogout = async () => {
    if (supabase && supabase.auth) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* SEÇÃO DE CONEXÃO CLOUD */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.6rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bento-card p-8 md:p-12 border-white/20 bg-black/60 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-6 bg-indigo-500 rounded-3xl shadow-2xl shadow-indigo-500/40 text-white">
                <Cloud size={32} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-2">Cloud Infrastructure</p>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Conexão Google Sheets</h2>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
               <button onClick={() => setShowGuide(!showGuide)} className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:bg-white/10 transition-all flex items-center gap-2">
                 <HelpCircle size={14} /> Guia de Instalação
               </button>
               <button onClick={() => setShowTroubleshoot(!showTroubleshoot)} className="px-5 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/20 transition-all flex items-center gap-2">
                 <AlertCircle size={14} /> Erro 404?
               </button>
            </div>
          </div>

          {showTroubleshoot && (
            <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-3xl animate-in zoom-in-95 duration-300 space-y-4">
              <h4 className="text-rose-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={16} /> Resolvendo Erro 404 / Deployment Not Found
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Este erro significa que o ID no seu link do Google mudou ou foi deletado. Siga exatamente:<br/><br/>
                1. No Script do Google, vá em <b>Implantar > Gerenciar Implantações</b>.<br/>
                2. Clique no <b>Lápis (Editar)</b> na implantação que já existe.<br/>
                3. Em "Versão", mude para <b>NOVA VERSÃO</b> (obrigatório).<br/>
                4. Clique em <b>Implantar</b>.<br/>
                5. O Google dará um <b>NOVO LINK</b>. Copie-o e cole no campo abaixo.
              </p>
            </div>
          )}

          {showGuide && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
              <div className="bento-card p-6 border-indigo-500/20 bg-indigo-500/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-black">01</div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Código GS</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">Cole o backend no <b>Code.gs</b> e crie um arquivo HTML chamado <b>google_redirect</b>.</p>
              </div>
              <div className="bento-card p-6 border-indigo-500/20 bg-indigo-500/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-black">02</div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Link Vercel</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">No arquivo HTML, cole o link abaixo na variável <b>VERCEL_URL</b>.</p>
                <button onClick={copyOrigin} className="w-full py-2 bg-indigo-500 rounded-xl text-[9px] font-black text-white uppercase tracking-widest">Copiar Meu Link</button>
              </div>
              <div className="bento-card p-6 border-indigo-500/20 bg-indigo-500/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-black">03</div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Qualquer Pessoa</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">Ao implantar, certifique-se de que o acesso está marcado para <b>Qualquer pessoa</b> (não apenas eu).</p>
              </div>
            </div>
          )}

          <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">URL Final da Implantação (Google)</label>
              {isConnected ? (
                <span className="flex items-center gap-2 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full">
                  <CheckCircle2 size={10} /> Link Válido
                </span>
              ) : (
                <span className="flex items-center gap-2 text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-3 py-1 rounded-full">
                   Aguardando /exec
                </span>
              )}
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <LinkIcon className={`${isConnected ? 'text-emerald-400' : 'text-indigo-400'}`} size={20} />
              </div>
              <input 
                type="url" 
                value={googleScriptUrl} 
                onChange={(e) => setGoogleScriptUrl(e.target.value)} 
                className={`w-full p-6 pl-16 glass-input rounded-3xl font-bold text-sm outline-none transition-all ring-offset-0 ${isConnected ? 'ring-2 ring-emerald-500/30 border-emerald-500/20' : 'focus:ring-2 focus:ring-indigo-500/50 border-white/10'}`} 
                placeholder="https://script.google.com/macros/s/.../exec" 
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 pt-2">
               <button onClick={handleSave} className="flex-1 btn-modern py-5 rounded-2xl font-black text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={18} /> {isSaved ? 'CONFIGURAÇÃO SALVA' : 'SALVAR NO NAVEGADOR'}
               </button>
               <button onClick={handleManualSync} disabled={!isConnected || isSyncing} className="flex-1 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-30 transition-all flex items-center justify-center gap-3">
                  {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />} Enviar Dados
               </button>
               <button onClick={handleImport} disabled={!isConnected || isSyncing} className="flex-1 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 disabled:opacity-30 transition-all flex items-center justify-center gap-3">
                  <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} /> Baixar Dados
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="bento-card p-8 md:p-10 space-y-6 border-white/10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <User size={20} className="text-indigo-400" />
              <h3 className="font-black text-white uppercase text-xs tracking-[0.3em]">Operador Principal</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="relative group">
                <img src={user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'} className="w-32 h-32 rounded-3xl object-cover ring-4 ring-white/5" alt="Avatar" />
                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Assinatura Digital</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-5 glass-input rounded-2xl font-black text-xl" />
                </div>
                <div className="flex gap-4">
                  <button onClick={handleLogout} className="px-6 py-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                     <LogOut size={16} /> Encerrar Sessão
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
