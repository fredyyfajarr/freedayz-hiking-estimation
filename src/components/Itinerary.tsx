import { Clock, Plus, Trash2, Map } from "lucide-react";
import React from "react";

export interface ItineraryItem {
  id: string;
  time: string;
  activity: string;
}

export type ItineraryData = Record<number, ItineraryItem[]>;

interface ItineraryProps {
  duration: number;
  itinerary: ItineraryData;
  setItinerary: React.Dispatch<React.SetStateAction<ItineraryData>>;
}

export default function Itinerary({ duration, itinerary, setItinerary }: ItineraryProps) {
  const days = Array.from({ length: duration }, (_, i) => i + 1);

  const addItem = (day: number) => {
    setItinerary(prev => {
      const currentItems = prev[day] || [];
      return {
        ...prev,
        [day]: [...currentItems, { id: Date.now().toString() + Math.random(), time: "", activity: "" }]
      };
    });
  };

  const updateItem = (day: number, id: string, field: "time" | "activity", value: string) => {
    setItinerary(prev => {
      const currentItems = prev[day] || [];
      return {
        ...prev,
        [day]: currentItems.map(item => item.id === id ? { ...item, [field]: value } : item)
      };
    });
  };

  const removeItem = (day: number, id: string) => {
    setItinerary(prev => {
      const currentItems = prev[day] || [];
      return {
        ...prev,
        [day]: currentItems.filter(item => item.id !== id)
      };
    });
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[var(--color-surface-hover)] p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[var(--color-brand)]">
        <Map /> Rencana Perjalanan (Itinerary)
      </h3>
      
      <div className="space-y-8">
        {days.map(day => {
          const items = itinerary[day] || [];
          return (
            <div key={day} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h4 className="font-bold text-gray-700">HARI KE-{day}</h4>
                <button 
                  onClick={() => addItem(day)}
                  className="text-xs flex items-center gap-1 text-white bg-[var(--color-brand)] px-3 py-1.5 rounded-lg hover:bg-[var(--color-brand-hover)] transition-all font-medium"
                >
                  <Plus size={14} /> Tambah Kegiatan
                </button>
              </div>
              
              <div className="p-4 space-y-3 bg-white">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4 italic">Belum ada jadwal untuk hari ini.</p>
                ) : (
                  items.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-start relative group">
                      <div className="w-24 md:w-32 shrink-0">
                        <div className="relative">
                          <Clock size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="08:00" 
                            value={item.time} 
                            onChange={e => updateItem(day, item.id, "time", e.target.value)} 
                            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand)] outline-none text-sm bg-white" 
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <input 
                          type="text" 
                          placeholder="Kegiatan (misal: Basecamp -> Pos 1)" 
                          value={item.activity} 
                          onChange={e => updateItem(day, item.id, "activity", e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand)] outline-none text-sm bg-white" 
                        />
                      </div>
                      
                      <button 
                        onClick={() => removeItem(day, item.id)} 
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
