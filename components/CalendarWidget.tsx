
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CloudSun } from 'lucide-react';

const CalendarWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  }).format(time);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bento-card p-6 border-white/10 flex items-center space-x-4">
        <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
          <CalendarIcon size={24} />
        </div>
        <div>
          <p className="text-[9px] font-black text-theme-muted uppercase tracking-widest">Calendário</p>
          <p className="text-sm font-bold text-theme-main capitalize">{formattedDate}</p>
        </div>
      </div>

      <div className="bento-card p-6 border-white/10 flex items-center space-x-4">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-[9px] font-black text-theme-muted uppercase tracking-widest">Horário Local</p>
          <p className="text-xl font-black text-theme-main">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      <div className="bento-card p-6 border-white/10 flex items-center space-x-4">
        <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl">
          <CloudSun size={24} />
        </div>
        <div>
          <p className="text-[9px] font-black text-theme-muted uppercase tracking-widest">Status Mercado</p>
          <p className="text-sm font-bold text-theme-main">Mercado Aberto • 28°C</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
