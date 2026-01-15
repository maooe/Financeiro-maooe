
import React from 'react';
import { Star, Zap } from 'lucide-react';

const NewsTicker: React.FC = () => {
  const news = [
    "Juiz de Fora registra crescimento de 5% no setor de serviços este semestre.",
    "Marketing Digital: IA generativa redefine a criação de conteúdo em 2026.",
    "Prefeitura de JF anuncia novo plano de incentivo fiscal para startups locais.",
    "Tendência: Social Commerce deve movimentar bilhões no mercado brasileiro este ano.",
    "Eventos culturais no Cine-Theatro Central impulsionam turismo em Juiz de Fora.",
    "Estratégia: Como o branding emocional está salvando o varejo físico tradicional.",
    "JF Empreendedora: Feira de inovação no Moinho atrai investidores de todo o país.",
    "SEO em 2026: A busca por voz e intenção do usuário domina os algoritmos.",
    "Juiz de Fora é destaque em ranking de cidades inteligentes e conectadas.",
    "Omnichannel: A integração total entre on e off é prioridade para marcas globais."
  ];

  const handleNewsClick = (text: string) => {
    // Dispara um evento customizado que o AIAgent irá escutar
    const event = new CustomEvent('ask-ai', { 
      detail: { query: `Analise esta notícia para mim e como ela impacta minhas finanças: ${text}` } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="w-full bg-transparent border-b border-white/5 h-12 flex items-center overflow-hidden z-30 group relative">
      <div className="px-6 bg-transparent h-full flex items-center gap-3 shrink-0 z-10 border-r border-white/5 backdrop-blur-md">
        <Star size={14} className="text-indigo-400 fill-indigo-400 animate-pulse" />
        <span className="text-[10px] font-black text-theme-main uppercase tracking-[0.4em]">Live Feed</span>
      </div>
      
      <div className="ticker-container flex items-center py-1">
        {[...news, ...news].map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => handleNewsClick(item)}
            className="flex items-center gap-6 px-8 group/item transition-all hover:bg-white/5 h-full focus:outline-none"
          >
            <span className="text-[11px] font-bold text-theme-muted whitespace-nowrap group-hover/item:text-indigo-400 transition-colors flex items-center gap-2">
              <Zap size={10} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-indigo-400" />
              {item}
            </span>
            <div className="w-1.5 h-1.5 bg-white/10 rounded-full group-hover/item:bg-indigo-500/50"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
