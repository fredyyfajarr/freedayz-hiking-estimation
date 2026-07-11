"use client";

import { useState, useRef } from "react";
import { calculateNeeds, Mode } from "@/utils/calculator";
import { Download, Share2 } from "lucide-react";

import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import EstimasiResult from "@/components/EstimasiResult";
import SplitBill, { SplitBillData, BillItem } from "@/components/SplitBill";

export default function Home() {
  const [mountainName, setMountainName] = useState<string>("");
  const [mode, setMode] = useState<Mode>("Camp");
  const [participants, setParticipants] = useState<number | "">(4);
  const [duration, setDuration] = useState<number | "">(2);
  
  const [transportType, setTransportType] = useState<string>("Motor Pribadi");
  const [transportCount, setTransportCount] = useState<number | "">(2);

  const [splitBill, setSplitBill] = useState<SplitBillData>({
    logistics: [{ id: 'log1', name: '', price: '' }],
    transport: [{ id: 'tr1', name: '', price: '' }],
    equipment: [{ id: 'eq1', name: '', price: '' }],
    misc: [{ id: 'm1', name: '', price: '' }]
  });

  const printRef = useRef<HTMLDivElement>(null);

  const safeParticipants = typeof participants === "number" ? participants : 1;
  const safeDuration = typeof duration === "number" ? duration : 1;
  const actualDuration = mode === "Tektok" ? 1 : safeDuration;
  
  const result = calculateNeeds(safeParticipants, actualDuration, mode);

  const sumCategory = (items: BillItem[]) => items.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const totalSharedCost = sumCategory(splitBill.logistics) + sumCategory(splitBill.transport) + sumCategory(splitBill.equipment) + sumCategory(splitBill.misc);
  const costPerPerson = safeParticipants > 0 ? totalSharedCost / safeParticipants : 0;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleShareWA = () => {
    if (!result) return;
    
    const formatBillList = (title: string, items: BillItem[]) => {
      const validItems = items.filter(i => i.name || i.price);
      if (validItems.length === 0) return '';
      return `_${title}_\n` + validItems.map(i => `  - ${i.name || 'Item'}: ${formatRupiah(Number(i.price) || 0)}`).join('\n') + '\n';
    };

    const billDetails = formatBillList("Logistik & Makanan", splitBill.logistics)
      + formatBillList("Transportasi", splitBill.transport)
      + formatBillList("Alat & Tenda", splitBill.equipment)
      + formatBillList("Lain-lain", splitBill.misc);

    const splitBillSection = billDetails 
      ? `*Rincian Split Bill / Patungan:*\n${billDetails}\n*Total Biaya Kelompok: ${formatRupiah(totalSharedCost)}*\n*Patungan Per Orang: ${formatRupiah(costPerPerson)}*\n\n`
      : `*Estimasi Patungan (Ptpt):*\nBelum ada rincian biaya yang dimasukkan.\n\n`;

    const text = `*Rencana Pendakian ${mountainName || "Gunung"} (${mode})*\nPeserta: ${safeParticipants} Orang\nDurasi: ${actualDuration} Hari\n\n`
      + `*Tenda & Alat Kelompok:*\n${result.equipment.map(e => `- ${e.name} (${e.qty} ${e.unit})`).join('\n')}\n\n`
      + `*Logistik & Makanan:*\n${result.logistics.map(l => `- ${l.name} (${l.qty} ${l.unit}${l.perPerson ? ` | ${l.perPerson}` : ''})`).join('\n')}\n\n`
      + `*Barang Pribadi (Wajib):*\n${result.personal.map(p => `- ${p.name}`).join('\n')}\n\n`
      + `*Rencana Transportasi:* ${transportCount || 0} unit ${transportType}\n\n`
      + splitBillSection
      + `_Dibuat via Freedayz Estimasi_`;
      
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 md:p-8 font-sans text-[var(--foreground)] print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-6 print:space-y-4">
        <div className="print:hidden">
          <Header />
        </div>

        <div className="print:hidden">
          <InputForm 
            mountainName={mountainName} setMountainName={setMountainName}
            mode={mode} setMode={setMode} 
            participants={participants} setParticipants={setParticipants} 
            duration={duration} setDuration={setDuration} 
            transportType={transportType} setTransportType={setTransportType}
            transportCount={transportCount} setTransportCount={setTransportCount}
          />
        </div>

        <div ref={printRef} className="space-y-6 bg-[var(--background)] print:bg-white print:space-y-6">
          
          {/* Header Khusus Print PDF */}
          <div className="hidden print:block mb-8 border-b-2 border-gray-800 pb-6 pt-4">
            <h1 className="text-4xl font-black text-gray-900 uppercase">
              Rencana Pendakian {mountainName || "..."}
            </h1>
            <div className="flex gap-8 mt-4 text-base font-bold text-gray-700">
              <p>🏕️ Gaya: {mode}</p>
              <p>👥 Peserta: {safeParticipants} Orang</p>
              <p>⏱️ Durasi: {actualDuration} Hari</p>
            </div>
          </div>

          {result && <EstimasiResult result={result} transportType={transportType} transportCount={transportCount} />}

          <SplitBill 
            splitBill={splitBill}
            setSplitBill={setSplitBill}
            totalSharedCost={totalSharedCost}
            costPerPerson={costPerPerson}
            participants={participants}
            formatRupiah={formatRupiah}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-12 print:hidden">
          <button onClick={handleExportPDF} className="flex-1 py-4 bg-white border-2 border-[var(--color-brand)] text-[var(--color-brand)] rounded-xl font-bold text-lg hover:bg-[var(--color-surface-hover)] transition-all flex items-center justify-center gap-2">
            <Download /> Export PDF / Cetak RAB
          </button>
          <button onClick={handleShareWA} className="flex-1 py-4 bg-[var(--color-brand)] text-white rounded-xl font-bold text-lg hover:bg-[var(--color-brand-hover)] shadow-lg transition-all flex items-center justify-center gap-2">
            <Share2 /> Bagikan ke WhatsApp
          </button>
        </div>
      </div>
    </main>
  );
}
