import { CalculationResult } from "@/utils/calculator";
import { Tent, Utensils, Backpack, Car, Info } from "lucide-react";

interface EstimasiResultProps {
  result: CalculationResult;
  transportType: string;
  transportCount: number | "";
}

export default function EstimasiResult({ result, transportType, transportCount }: EstimasiResultProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-surface-hover)]">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-brand)] border-b pb-2">
          <Tent className="text-[var(--color-brand)]" /> Alat Kelompok
        </h3>
        <ul className="space-y-3">
          {result.equipment.map((item, i) => (
            <li key={i} className="flex justify-between items-center text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="bg-[var(--color-surface-hover)] px-2 py-1 rounded text-gray-700">{item.qty} {item.unit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-surface-hover)] overflow-hidden print:border-gray-300 print:shadow-none break-inside-avoid">
        <div className="bg-gray-50/80 p-4 border-b border-gray-100 print:bg-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Utensils className="text-[var(--color-brand)] print:text-gray-800" size={18} /> Logistik & Makanan
          </h3>
        </div>
        <div className="bg-orange-50/50 px-4 py-2 border-b border-orange-100 flex items-start gap-2 text-xs md:text-sm text-orange-700 print:bg-gray-100 print:text-gray-700 print:border-gray-300 print:italic">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p><strong>Catatan:</strong> Kuantitas logistik di bawah ini hanyalah <em>rekomendasi/estimasi minimum</em> agar tidak kekurangan di gunung. Anda bebas menyesuaikan jenis dan jumlahnya dengan selera tim.</p>
        </div>
        <ul className="p-4 bg-white space-y-3">
          {result.logistics.map((item, i) => (
            <li key={i} className="flex justify-between items-start text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
              <span className="font-medium mt-1">{item.name}</span>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-[var(--color-surface-hover)] px-2 py-1 rounded text-gray-800 font-medium">{item.qty} {item.unit}</span>
                {item.perPerson && <span className="text-xs text-[var(--color-brand)] font-medium">{item.perPerson}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-surface-hover)]">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-brand)] border-b pb-2">
          <Backpack className="text-[var(--color-brand)]" /> Bawaan Pribadi (Wajib)
        </h3>
        <ul className="space-y-3">
          {result.personal.map((item, i) => (
            <li key={i} className="flex flex-col text-sm border-b border-gray-100 pb-2 last:border-0">
              <span className="font-semibold text-gray-800">{item.name}</span>
              <span className="text-gray-500 text-xs">{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-surface-hover)]">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-brand)] border-b pb-2">
          <Car className="text-[var(--color-brand)]" /> Transportasi
        </h3>
        <div className="bg-[#eef2ef] p-4 rounded-xl text-sm font-medium text-[var(--color-brand-hover)] border border-[#4a7c59]/20">
          Rencana Kendaraan: {transportCount} unit {transportType}
        </div>
      </div>
    </div>
  );
}
