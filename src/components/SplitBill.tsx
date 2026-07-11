import { Calculator, Trash2, Plus } from "lucide-react";

export interface BillItem {
  id: string;
  name: string;
  price: number | "";
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
  formatRupiah: (n: number) => string;
}

export default function SplitBill({
  splitBill, setSplitBill,
  totalSharedCost, costPerPerson, participants, formatRupiah
}: SplitBillProps) {
  const safeParticipants = typeof participants === "number" ? participants : 1;

  const BillSection = ({ title, category }: { title: string, category: keyof SplitBillData }) => {
    const items = splitBill[category];
    
    const addItem = () => {
      setSplitBill(prev => ({
        ...prev,
        [category]: [...prev[category], { id: Date.now().toString() + Math.random(), name: '', price: '' }]
      }));
    };

    const updateItem = (id: string, field: 'name' | 'price', value: string | number) => {
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

    const categoryTotal = items.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

    return (
      <div className="mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-bold text-gray-700">{title}</label>
          <button onClick={addItem} className="text-xs flex items-center gap-1 text-white bg-[var(--color-brand)] px-2 py-1 rounded hover:bg-[var(--color-brand-hover)] transition-all">
            <Plus size={14} /> Tambah Item
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="Nama (misal: Sayur & Bumbu)" 
                value={item.name} 
                onChange={e => updateItem(item.id, 'name', e.target.value)} 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand)] outline-none text-sm bg-white" 
              />
              <div className="relative w-2/5">
                <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
                <input 
                  type="number" min="0" placeholder="0" 
                  value={item.price} 
                  onChange={e => updateItem(item.id, 'price', e.target.value === "" ? "" : Number(e.target.value))} 
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand)] outline-none text-sm bg-white" 
                />
              </div>
              <button 
                onClick={() => removeItem(item.id)} 
                disabled={items.length === 1}
                className={`p-1.5 rounded ${items.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
              >
                <Trash2 size={18} />
              </button>
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

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[var(--color-surface-hover)] p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[var(--color-brand)]">
        <Calculator /> Kalkulator Patungan (Split Bill)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <BillSection title="1. Belanja Logistik & Makanan" category="logistics" />
          <BillSection title="2. Transportasi (Tiket / Bensin / Tol)" category="transport" />
          <BillSection title="3. Sewa Alat & Tenda" category="equipment" />
          <BillSection title="4. Biaya Lain (Simaksi, Parkir, dll)" category="misc" />
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
