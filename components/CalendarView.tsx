
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, X, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Appointment } from '../types';

interface CalendarViewProps {
  appointments: Appointment[];
  onUpdateAppointments: (appointments: Appointment[]) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onUpdateAppointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay(dateStr);
    setIsModalOpen(true);
  };

  const addAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !selectedDay) return;

    const newAppt: Appointment = {
      id: Date.now().toString(),
      date: selectedDay,
      title: newTitle,
      time: newTime,
      category: 'Geral'
    };

    onUpdateAppointments([...appointments, newAppt]);
    setNewTitle('');
    setIsModalOpen(false);
  };

  const deleteAppointment = (id: string) => {
    onUpdateAppointments(appointments.filter(a => a.id !== id));
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const startOffset = firstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());
    const cells = [];

    // Offsets
    for (let i = 0; i < startOffset; i++) {
      cells.push(<div key={`offset-${i}`} className="h-24 md:h-32 opacity-20 border-white/5"></div>);
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayAppts = appointments.filter(a => a.date === dateStr);
      
      cells.push(
        <div 
          key={d}
          onClick={() => handleDayClick(d)}
          className={`h-24 md:h-32 p-2 border border-white/5 hover:bg-indigo-500/5 cursor-pointer transition-all group relative overflow-hidden ${dayAppts.length > 0 ? 'bg-indigo-500/[0.02]' : ''}`}
        >
          <span className="text-sm font-black text-theme-muted group-hover:text-indigo-400">{d}</span>
          <div className="mt-1 space-y-1">
            {dayAppts.slice(0, 2).map(a => (
              <div key={a.id} className="text-[8px] font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 truncate">
                {a.time} {a.title}
              </div>
            ))}
            {dayAppts.length > 2 && (
              <div className="text-[8px] font-black text-gray-500 pl-1">
                + {dayAppts.length - 2} mais
              </div>
            )}
          </div>
          {dayAppts.length > 0 && (
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,1)]"></div>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bento-card p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-theme-main">Agenda Corporativa</h2>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Gestão de Tempo • 2026</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-all text-theme-main">
              <ChevronLeft size={20} />
            </button>
            <div className="px-6 text-center min-w-[180px]">
              <span className="text-lg font-black text-theme-main">{monthNames[currentDate.getMonth()]}</span>
              <span className="text-xs font-bold text-indigo-400 block tracking-widest">{currentDate.getFullYear()}</span>
            </div>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-all text-theme-main">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-t border-l border-white/5">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest border-r border-b border-white/5 bg-white/5">
              {day}
            </div>
          ))}
          {renderDays()}
        </div>
      </div>

      {/* Modal de Compromissos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bento-card w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border-white/20 shadow-2xl">
            <div className="p-6 bg-indigo-500/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon size={20} className="text-indigo-400" />
                <h3 className="font-black text-theme-main uppercase text-sm tracking-widest">Compromissos: {selectedDay}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-theme-muted hover:text-theme-main transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2">
                {appointments.filter(a => a.date === selectedDay).length === 0 ? (
                  <p className="text-center py-6 text-xs font-bold text-theme-muted uppercase tracking-widest italic">Nenhum evento para este dia</p>
                ) : (
                  appointments.filter(a => a.date === selectedDay).map(appt => (
                    <div key={appt.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                          <Clock size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-theme-main">{appt.title}</p>
                          <p className="text-[10px] font-black text-indigo-400">{appt.time}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteAppointment(appt.id)} className="p-2 text-red-500/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={addAppointment} className="pt-6 border-t border-white/5 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-widest">Novo Compromisso</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Reunião de Marketing"
                    className="w-full p-4 glass-input rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-theme-muted uppercase tracking-widest">Horário</label>
                    <input 
                      type="time" 
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full p-4 glass-input rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full btn-modern !py-4 flex items-center justify-center gap-2">
                      <Plus size={18} />
                      Adicionar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
