
import React, { useState } from 'react';
import { Camera, Save, User, Mail, ShieldCheck } from 'lucide-react';

interface ProfileEditProps {
  user: any;
  setUser: (user: any) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, setUser }) => {
  const [name, setName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [photo, setPhoto] = useState(user.photoURL);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      displayName: name,
      email: email,
      photoURL: photo
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        setPhoto(upload.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bento-card p-10 space-y-10" role="form" aria-labelledby="profile-title">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-3 bg-indigo-500/10 rounded-xl" aria-hidden="true">
            <User size={24} className="text-indigo-400" />
          </div>
          <div>
            <h2 id="profile-title" className="text-2xl font-black tracking-tight">Editar Perfil</h2>
            <p className="text-sm text-gray-400 font-medium">Personalize sua identidade no ecossistema</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative group">
              <img 
                src={photo} 
                alt="Foto de perfil atual" 
                className="w-32 h-32 rounded-3xl object-cover ring-4 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all shadow-2xl" 
              />
              <label 
                className="absolute -bottom-2 -right-2 p-3 bg-indigo-500 text-white rounded-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl focus-within:ring-4 focus-within:ring-white/50"
                aria-label="Trocar foto de perfil"
              >
                <Camera size={20} aria-hidden="true" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]" aria-hidden="true">Update Identity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="user-name" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome de Exibição</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} aria-hidden="true" />
                <input 
                  id="user-name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 p-4 glass-input rounded-2xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="user-email" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} aria-hidden="true" />
                <input 
                  id="user-email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 p-4 glass-input rounded-2xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg" aria-hidden="true">
               <ShieldCheck className="text-indigo-400" size={24} />
            </div>
            <p className="text-xs font-bold text-gray-300 leading-relaxed uppercase tracking-widest">Seus dados estão protegidos por criptografia local e sincronizados no navegador.</p>
          </div>

          <button 
            type="submit" 
            className="w-full btn-modern flex items-center justify-center gap-3 py-5 text-xl shadow-2xl transition-transform active:scale-[0.98] outline-none focus:ring-4 focus:ring-indigo-500/40"
            aria-label="Salvar alterações de perfil"
          >
            <Save size={24} aria-hidden="true" />
            Persistir Dados
          </button>

          {isSaved && (
            <div className="text-center animate-bounce" aria-live="polite">
              <span className="text-green-500 font-black text-sm uppercase tracking-widest">Sincronizado!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
