
import React from 'react';
import { Star } from 'lucide-react';

const NewsTicker: React.FC = () => {
  const news = [
    "Dólar recua perante incertezas do mercado asiático.",
    "Inflação desacelera em 0.25% no último trimestre fiscal.",
    "Investimentos em Web3 e IA atraem R$ 2bi em novas rodadas.",
    "Estratégia do dia: Maximize sua taxa de poupança investindo em renda fixa indexada.",
    "Selic projeção de manutenção em 10.5%.",
    "Maooe Pro v2.0 lançado com suporte a análise preditiva."
  ];

  return (
    <div className="w-full bg-transparent border-b border-white/5 h-12 flex items-center overflow-hidden z-30 group">
      <div className="px-6 bg-transparent h-full flex items-center gap-3 shrink-0 z-10 border-r border-white/5">
        <Star size={14} className="text-indigo-400 fill-indigo-400" />
        <span className="text-[10px] font-black text-theme-main uppercase tracking-[0.4em]">Transmissão</span>
      </div>
      <div className="ticker-container flex items-center py-1">
        {[...news, ...news].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 px-8">
            <span className="text-[11px] font-bold text-theme-muted whitespace-nowrap hover:text-theme-main transition-colors cursor-default">
              {item}
            </span>
            <div className="w-1 h-1 bg-white/10 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
