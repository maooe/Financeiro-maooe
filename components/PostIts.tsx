
import React from 'react';
import { Note } from '../types';
import { Plus, X } from 'lucide-react';

interface PostItsProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

const PostIts: React.FC<PostItsProps> = ({ notes, setNotes }) => {
  const addNote = () => {
    const colors = ['#fef3c7', '#dcfce7', '#e0f2fe', '#fce7f3', '#ede9fe'];
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setNotes([newNote, ...notes]);
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content } : n));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-1">Sinais & Notas</h2>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Lembretes rápidos e insights instantâneos</p>
        </div>
        <button 
          onClick={addNote}
          className="btn-modern flex items-center gap-2 !py-2 !px-5"
        >
          <Plus size={20} />
          <span>Novo Sinal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {notes.map(note => (
          <div 
            key={note.id} 
            className="p-8 rounded-[2rem] shadow-2xl relative min-h-[200px] flex flex-col transform transition-all hover:scale-105 border border-white/5 backdrop-blur-sm"
            style={{ 
              backgroundColor: `${note.color}cc`, 
              boxShadow: `0 20px 40px -20px ${note.color}44` 
            }}
          >
            <button 
              onClick={() => removeNote(note.id)}
              className="absolute top-4 right-4 p-2 text-gray-600/50 hover:text-gray-900 transition-colors bg-white/20 rounded-full"
            >
              <X size={14} />
            </button>
            <textarea
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 font-bold text-lg placeholder:text-gray-600/40 resize-none leading-tight"
              placeholder="Digite seu sinal financeiro..."
              value={note.content}
              onChange={e => updateNote(note.id, e.target.value)}
            />
            <div className="mt-4 flex items-center gap-2 opacity-50">
               <div className="w-2 h-2 rounded-full bg-gray-800"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">Rascunho Ativo</span>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full py-20 bento-card border-dashed flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-white/5 rounded-full mb-4">
              <Plus size={32} className="text-gray-600" />
            </div>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Nenhum sinal registrado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostIts;
