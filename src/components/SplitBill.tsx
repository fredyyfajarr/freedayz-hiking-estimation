import { Calculator, Trash2, Plus, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

export interface BillItem {
  id: string;
  name: string;
  price: number | "";
  multiplyByVehicles?: boolean;
}

export interface SplitBillData {
  logistics: BillItem[];
  transport: BillItem[];
  equipment: BillItem[];
  misc: BillItem[];
}

interface SplitBillProps {
  splitBill: SplitBillData;
  setSplitBill: React.Dispatch<React.SetStateAction<SplitBillData>>;
  totalSharedCost: number;
  costPerPerson: number;
  participants: number | "";
  transportType: string;
  transportCount: number | "";
  formatRupiah: (n: number) => string;
}

const BillSection = ({ 
  title, 
  category,
  splitBill,
  setSplitBill,
  transportCount,
  formatRupiah
}: { 
  title: string, 
  category: keyof SplitBillData,
  splitBill: SplitBillData,
  setSplitBill: React.Dispatch<React.SetStateAction<SplitBillData>>,
  transportCount: number | "",
  formatRupiah: (n: number) => string
}) => {
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  const items = splitBill[category];
  
  const addItem = () => {
    setSplitBill(prev => ({
      ...prev,
      [category]: [...prev[category], { id: Date.now().toString() + Math.random(), name: '', price: '', multiplyByVehicles: false }]
    }));
  };

  const updateItem = (id: string, field: 'name' | 'price' | 'multiplyByVehicles', value: string | number | boolean) => {
    setSplitBill(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (id: string) => {
    setSplitBill(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const estimatePrice = async (id: string, itemName: string) => {
    if (!itemName.trim()) return;
    
    setLoadingItems(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName })
      });
      const data = await res.json();
      
      if (data.price !== undefined && data.price > 0) {
        updateItem(id, 'price', data.price);
      } else if (data.error) {
        alert("Gagal memanggil AI: " + data.error + "\n\nPastikan API Key sudah benar dan valid.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan atau server.");
    } finally {
      setLoadingItems(prev => ({ ...prev, [id]: false }));
    }
  };

  const categoryTotal = items.reduce((acc, curr) => {
    const val = Number(curr.price) || 0;
    const multi = (category === 'transport' && curr.multiplyByVehicles && transportCount) 
      ? (typeof transportCount === "number" ? transportCount : 1) 
      : 1;
    return acc + (val * multi);
  }, 0);

  return (
    <div className="mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-bold text-gray-700">{title}</label>
        <button onClick={addItem} className="text-xs flex items-center gap-1 text-white bg-[var(--color-brand)] px-2 py-1 rounded hover:bg-[var(--color-brand-hover)] transition-all">
          <Plus size={14} /> Tambah Item
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 bg-white p-2 border border-gray-200 rounded-xl">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Nama (misal: Bensin)" 
                  value={item.name} 
                  onChange={e => updateItem(item.id, 'name', e.target.value)} 
                  className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand)] outline-none text-sm bg-white transition-all" 
                />
                <button 
                  onClick={() => estimatePrice(item.id, item.name)}
                  disabled={!item.name || loadingItems[item.id]}
                  title="Tebak Harga Pakai AI"
                  className="absolute right-2 top-2 text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
                >
                  {loadingItems[item.id] ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                </button>
              </div>
              <div className="relative w-2/5">
                <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
                <input 
                  type="number" min="0" placeholder="0" 
                  value={item.price} 
                  onChange={e => updateItem(item.id, 'price', e.target.value === "" ? "" : Number(e.target.value))} 
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand)] outline-none text-sm bg-white transition-all" 
                />
              </div>
              <button 
                onClick={() => removeItem(item.id)} 
                disabled={items.length === 1}
                className={`p-1.5 rounded transition-all ${items.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            {category === 'transport' && (
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600 pl-1 cursor-pointer w-fit hover:text-gray-900 transition-colors">
                <input 
                  type="checkbox" 
                  checked={!!item.multiplyByVehicles} 
                  onChange={e => updateItem(item.id, 'multiplyByVehicles', e.target.checked)}
                  className="rounded border-gray-300 text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
                />
                Hitung per unit kendaraan (Otomatis dikali {transportCount || 1})
              </label>
            )}
          </div>
        ))}
      </div>
      {categoryTotal > 0 && (
        <div className="text-right mt-2 text-xs font-semibold text-gray-500 pr-10">
          Subtotal: {formatRupiah(categoryTotal)}
        </div>
      )}
    </div>
  );
};

export default function SplitBill({
  splitBill, setSplitBill,
  totalSharedCost, costPerPerson, participants,
  transportType, transportCount, formatRupiah
}: SplitBillProps) {
  const safeParticipants = typeof participants === "number" ? participants : 1;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[var(--color-surface-hover)] p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[var(--color-brand)]">
        <Calculator /> Kalkulator Patungan (Split Bill)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <BillSection title="1. Belanja Logistik & Makanan" category="logistics" splitBill={splitBill} setSplitBill={setSplitBill} transportCount={transportCount} formatRupiah={formatRupiah} />
          
          <div className="mb-6">
            <BillSection title="2. Transportasi (Tiket / Bensin / Tol)" category="transport" splitBill={splitBill} setSplitBill={setSplitBill} transportCount={transportCount} formatRupiah={formatRupiah} />
            {(() => {
              const transportTotal = splitBill.transport.reduce((acc, curr) => {
                const val = Number(curr.price) || 0;
                const multi = curr.multiplyByVehicles && transportCount ? (typeof transportCount === "number" ? transportCount : 1) : 1;
                return acc + (val * multi);
              }, 0);
              
              if (transportTotal > 0 && transportCount) {
                const validCount = typeof transportCount === "number" ? transportCount : 1;
                const costPerVehicle = transportTotal / validCount;
                const peoplePerVehicle = safeParticipants / validCount;
                const roundedPeople = Number.isInteger(peoplePerVehicle) ? peoplePerVehicle : peoplePerVehicle.toFixed(1);
                return (
                  <div className="bg-blue-50/80 p-4 rounded-xl -mt-4 border border-blue-100 text-sm text-blue-900 shadow-sm relative z-10">
                    <span className="font-bold flex items-center gap-1 mb-1 text-[var(--color-brand)]">💡 Info Patungan {transportType}</span>
                    <p className="leading-relaxed opacity-90">
                      Beban bensin/tiket untuk 1 unit kendaraan adalah <b>{formatRupiah(costPerVehicle)}</b>.<br/>
                      Asumsi 1 kendaraan diisi {roundedPeople} orang, maka masing-masing penumpang di kendaraan tersebut patungan sebesar <b>{formatRupiah(costPerVehicle / peoplePerVehicle)}</b>.
                    </p>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <BillSection title="3. Sewa Alat & Tenda" category="equipment" splitBill={splitBill} setSplitBill={setSplitBill} transportCount={transportCount} formatRupiah={formatRupiah} />
          <BillSection title="4. Biaya Lain (Simaksi, Parkir, dll)" category="misc" splitBill={splitBill} setSplitBill={setSplitBill} transportCount={transportCount} formatRupiah={formatRupiah} />
        </div>

        <div className="bg-[var(--color-brand)] text-white p-6 md:p-8 rounded-2xl flex flex-col justify-center items-center shadow-lg sticky top-6">
          <p className="text-sm opacity-80 mb-1">Total Pengeluaran Kelompok</p>
          <p className="text-2xl font-bold mb-6">{formatRupiah(totalSharedCost)}</p>
          
          <div className="w-full border-t border-white/20 mb-6"></div>
          
          <p className="text-sm opacity-80 mb-1">Patungan per Orang</p>
          <p className="text-4xl md:text-5xl font-extrabold text-center">{formatRupiah(costPerPerson)}</p>
          <p className="text-sm opacity-90 mt-4 bg-white/10 px-3 py-1 rounded-full">
            Beban dibagi rata {safeParticipants} orang
          </p>
        </div>
      </div>
    </section>
  );
}
