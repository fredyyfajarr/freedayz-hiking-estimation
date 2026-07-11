"use client";

import { useState, useRef } from "react";
import { calculateNeeds, Mode } from "@/utils/calculator";
import { Download, Share2 } from "lucide-react";

import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import EstimasiResult from "@/components/EstimasiResult";
import SplitBill, { SplitBillData, BillItem } from "@/components/SplitBill";
import Itinerary, { ItineraryData } from "@/components/Itinerary";

export default function Home() {
  const [mountainName, setMountainName] = useState<string>("");
  const [mode, setMode] = useState<Mode>("Camp");
  const [participants, setParticipants] = useState<number | "">(4);
  const [duration, setDuration] = useState<number | "">(2);
  
  const [transportType, setTransportType] = useState<string>("Motor Pribadi");
  const [transportCount, setTransportCount] = useState<number | "">(1);

  const [itinerary, setItinerary] = useState<ItineraryData>({});

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

    const validTransportCount = typeof transportCount === "number" ? transportCount : 1;
    const transportTotal = sumCategory(splitBill.transport);
    const transportInfoWA = transportTotal > 0 
      ? `\n_💡 Info: Patungan bensin per ${transportType} = ${formatRupiah(transportTotal / validTransportCount)} (dibagi rata penumpang di dalamnya)_\n`
      : "";

    const splitBillSection = billDetails 
      ? `*Rincian Split Bill / Patungan:*\n${billDetails}${transportInfoWA}\n*Total Biaya Kelompok: ${formatRupiah(totalSharedCost)}*\n*Patungan Per Orang: ${formatRupiah(costPerPerson)}*\n\n`
      : `*Estimasi Patungan (Ptpt):*\nBelum ada rincian biaya yang dimasukkan.\n\n`;

    let itineraryText = "";
    if (Object.keys(itinerary).length > 0) {
      itineraryText = "*Rencana Perjalanan (Itinerary)*\n";
      Array.from({ length: actualDuration }, (_, i) => i + 1).forEach(day => {
        const items = itinerary[day];
        if (items && items.length > 0) {
          itineraryText += `\n*Hari ${day}:*\n`;
          items.forEach(item => {
            if (item.time || item.activity) {
              itineraryText += `- ${item.time || '...'} : ${item.activity || '...'}\n`;
            }
          });
        }
      });
      itineraryText += "\n";
    }

    const text = `*Rencana Pendakian ${mountainName || "Gunung"} (${mode})*\nPeserta: ${safeParticipants} Orang\nDurasi: ${actualDuration} Hari\n\n`
      + itineraryText
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

        <div className="print:hidden space-y-6">
          <InputForm 
            mountainName={mountainName} setMountainName={setMountainName}
            mode={mode} setMode={setMode} 
            participants={participants} setParticipants={setParticipants} 
            duration={duration} setDuration={setDuration} 
            transportType={transportType} setTransportType={setTransportType}
            transportCount={transportCount} setTransportCount={setTransportCount}
          />
          <Itinerary duration={actualDuration} itinerary={itinerary} setItinerary={setItinerary} />
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

          {/* Timeline Cetak PDF */}
          {Object.keys(itinerary).length > 0 && (
            <div className="hidden print:block mb-10 break-inside-avoid">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-800 pb-2 mb-6 uppercase tracking-wider">Rencana Perjalanan (Itinerary)</h2>
              <div className="space-y-8">
                {Array.from({ length: actualDuration }, (_, i) => i + 1).map(day => {
                  const items = itinerary[day];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={day}>
                      <h3 className="font-bold text-gray-700 text-lg mb-4 bg-gray-100 inline-block px-4 py-1 rounded-full">HARI {day}</h3>
                      <div className="pl-6 border-l-2 border-[var(--color-brand)] space-y-5 ml-4">
                        {items.map(item => (
                          <div key={item.id} className="relative pl-6">
                            <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-[var(--color-brand)] rounded-full ring-4 ring-white"></div>
                            <div className="font-bold text-sm text-[var(--color-brand)]">{item.time || "Waktu -"}</div>
                            <div className="text-gray-800 font-medium text-lg mt-0.5">{item.activity || "Kegiatan -"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {result && <EstimasiResult result={result} transportType={transportType} transportCount={transportCount} />}

          {/* Rincian Biaya Cetak PDF (Print Only) */}
          {(totalSharedCost > 0) && (
            <div className="hidden print:block mt-10 break-inside-avoid">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-800 pb-2 mb-6 uppercase tracking-wider">
                Rincian Anggaran Biaya (RAB)
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: "1. Belanja Logistik & Makanan", category: "logistics" as keyof SplitBillData },
                  { title: "2. Transportasi (Tiket / Bensin / Tol)", category: "transport" as keyof SplitBillData },
                  { title: "3. Sewa Alat & Tenda", category: "equipment" as keyof SplitBillData },
                  { title: "4. Biaya Lain (Simaksi, Parkir, dll)", category: "misc" as keyof SplitBillData }
                ].map(({ title, category }) => {
                  const items = splitBill[category].filter(i => i.name && i.price !== "");
                  if (items.length === 0) return null;
                  const total = items.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
                  
                  return (
                    <div key={category} className="mb-4">
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-400">
                            <th className="py-2 text-gray-600 font-semibold w-3/4">Nama Item</th>
                            <th className="py-2 text-right text-gray-600 font-semibold">Estimasi Harga</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                              <td className="py-2 text-gray-800">{item.name}</td>
                              <td className="py-2 text-right text-gray-800">{formatRupiah(Number(item.price))}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className="py-2 font-bold text-gray-800 text-right pr-4">Subtotal</td>
                            <td className="py-2 font-bold text-[var(--color-brand)] text-right">{formatRupiah(total)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-xl flex justify-between items-center break-inside-avoid">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">TOTAL PENGELUARAN KELOMPOK</p>
                  <p className="text-3xl font-black text-gray-900">{formatRupiah(totalSharedCost)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm font-semibold mb-1">PATUNGAN PER ORANG ({safeParticipants} Orang)</p>
                  <p className="text-3xl font-black text-[var(--color-brand)]">{formatRupiah(costPerPerson)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="print:hidden mt-8">
            <SplitBill 
              splitBill={splitBill}
              setSplitBill={setSplitBill}
              totalSharedCost={totalSharedCost}
              costPerPerson={costPerPerson}
              participants={participants}
              transportType={transportType}
              transportCount={transportCount}
              formatRupiah={formatRupiah}
            />
          </div>
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
