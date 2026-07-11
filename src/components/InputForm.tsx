import { Mode } from "@/utils/calculator";
import { Tent, Sun, Users, Clock, Car, MapPin } from "lucide-react";

interface InputFormProps {
  mountainName: string;
  setMountainName: (v: string) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  participants: number | "";
  setParticipants: (p: number | "") => void;
  duration: number | "";
  setDuration: (d: number | "") => void;
  transportType: string;
  setTransportType: (v: string) => void;
  transportCount: number | "";
  setTransportCount: (v: number | "") => void;
}

export default function InputForm({ 
  mountainName, setMountainName,
  mode, setMode, participants, setParticipants, duration, setDuration,
  transportType, setTransportType, transportCount, setTransportCount
}: InputFormProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[var(--color-surface-hover)] p-6 md:p-8 space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold flex items-center gap-2 text-[var(--color-brand)]">
          <MapPin size={18} /> Tujuan Gunung
        </label>
        <input 
          type="text" placeholder="Misal: Gunung Rinjani, Semeru, Gede..." 
          value={mountainName} 
          onChange={(e) => setMountainName(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 h-[46px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2 text-[var(--color-brand)]">
            <Tent size={18} /> Gaya Pendakian
          </label>
          <div className="flex bg-[var(--color-surface-hover)] p-1 rounded-xl h-[46px]">
            <button 
              onClick={() => setMode("Camp")}
              className={`flex-1 rounded-lg text-sm font-medium transition-all ${mode === "Camp" ? "bg-[var(--color-brand)] text-white shadow-md" : "text-gray-600 hover:text-gray-800"}`}
            >
              <Tent size={16} className="inline mr-1" /> Camp
            </button>
            <button 
              onClick={() => setMode("Tektok")}
              className={`flex-1 rounded-lg text-sm font-medium transition-all ${mode === "Tektok" ? "bg-[var(--color-brand)] text-white shadow-md" : "text-gray-600 hover:text-gray-800"}`}
            >
              <Sun size={16} className="inline mr-1" /> Tektok
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2 text-[var(--color-brand)]">
            <Users size={18} /> Jumlah Peserta
          </label>
          <input 
            type="number" min="1" value={participants} 
            onChange={(e) => setParticipants(e.target.value === "" ? "" : parseInt(e.target.value))}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 h-[46px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all"
          />
        </div>

        <div className={`space-y-3 transition-opacity ${mode === "Tektok" ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          <label className="text-sm font-semibold flex items-center gap-2 text-[var(--color-brand)]">
            <Clock size={18} /> Durasi (Hari)
          </label>
          <input 
            type="number" min="1" value={mode === "Tektok" ? 1 : duration} 
            onChange={(e) => setDuration(e.target.value === "" ? "" : parseInt(e.target.value))}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 h-[46px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2 text-[var(--color-brand)]">
            <Car size={18} /> Transportasi
          </label>
          <div className="flex gap-2">
            <select 
              value={transportType} onChange={e => setTransportType(e.target.value)}
              className="flex-1 bg-white border border-gray-300 rounded-xl px-3 h-[46px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all"
            >
              <option value="Motor Pribadi">Motor</option>
              <option value="Mobil Pribadi">Mobil Pribadi</option>
              <option value="Sewa Kendaraan">Sewa (Elf, dll)</option>
            </select>
            <input 
              type="number" min="1" value={transportCount} 
              onChange={e => setTransportCount(e.target.value === "" ? "" : parseInt(e.target.value))}
              className="w-16 bg-white border border-gray-300 rounded-xl px-2 h-[46px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-all text-center"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
