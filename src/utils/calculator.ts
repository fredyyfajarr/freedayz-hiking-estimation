export type Mode = 'Camp' | 'Tektok';

export interface CalculationResult {
  equipment: { name: string; qty: number; unit: string }[];
  logistics: { name: string; qty: number | string; unit: string; perPerson?: string }[];
  personal: { name: string; desc: string }[];
  firstAid: { name: string; desc: string }[];
}

export function calculateNeeds(participants: number, durationDays: number, mode: Mode): CalculationResult {
  const isCamp = mode === 'Camp';
  
  // Equipment
  const equipment = [];
  if (isCamp) {
    const tents4 = Math.ceil(participants / 4);
    equipment.push({ name: 'Tenda (Kapasitas 4/5)', qty: tents4, unit: 'unit' });
    equipment.push({ name: 'Alat Masak (Nesting/Trangia)', qty: Math.ceil(participants / 4), unit: 'set' });
    equipment.push({ name: 'Kompor Portabel', qty: Math.ceil(participants / 4), unit: 'unit' });
    equipment.push({ name: 'Matras', qty: Math.ceil(participants / 3), unit: 'lembar' });
    equipment.push({ name: 'Flysheet', qty: Math.ceil(participants / 5), unit: 'lembar' });
  } else {
    equipment.push({ name: 'Alat Masak Mini', qty: Math.ceil(participants / 5), unit: 'set' });
    equipment.push({ name: 'Kompor Portabel', qty: Math.ceil(participants / 5), unit: 'unit' });
  }
  equipment.push({ name: 'P3K Kelompok', qty: Math.ceil(participants / 5), unit: 'set' });
  equipment.push({ name: 'Trash Bag', qty: isCamp ? Math.ceil(participants * durationDays / 2) : Math.ceil(participants / 3), unit: 'lembar' });

  // Logistics
  const logistics = [];
  const mealsPerDay = 3;
  const totalMeals = participants * (isCamp ? durationDays * mealsPerDay : 2);
  
  logistics.push({ name: 'Air Bersih', qty: participants * durationDays * (isCamp ? 3 : 2), unit: 'Liter' });
  
  if (isCamp) {
    logistics.push({ name: 'Beras', qty: (totalMeals * 0.1).toFixed(1), unit: 'Kg' });
    logistics.push({ name: 'Mie Instan / Pasta', qty: Math.ceil(totalMeals * 0.5), unit: 'Bungkus' });
    logistics.push({ name: 'Lauk Pauk (Telur, Sosis, Nugget, dll)', qty: Math.ceil(totalMeals * 0.8), unit: 'Porsi' });
    logistics.push({ name: 'Gas Kaleng', qty: Math.ceil(participants * durationDays / 4), unit: 'Kaleng' });
  } else {
    logistics.push({ name: 'Roti / Lontong / Makanan Siap Saji', qty: participants * 2, unit: 'Porsi' });
    logistics.push({ name: 'Gas Kaleng (Untuk kopi/seduh)', qty: Math.ceil(participants / 5), unit: 'Kaleng' });
  }
  logistics.push({ name: 'Cemilan (Cokelat, Biskuit, Trail mix)', qty: participants * durationDays * 2, unit: 'Bungkus' });
  logistics.push({ name: 'Kopi / Teh / Minuman Hangat', qty: participants * durationDays * 2, unit: 'Sachet' });

  // Personal
  const personal = [];
  personal.push({ name: 'Tas Ransel / Carrier', desc: isCamp ? 'Kapasitas 40L - 60L' : 'Daypack 20L - 30L' });
  personal.push({ name: 'Pakaian Jalan', desc: 'Bahan quick dry (Atasan & bawahan)' });
  if (isCamp) {
    personal.push({ name: 'Pakaian Tidur', desc: 'Baju hangat, celana panjang kering' });
    personal.push({ name: 'Jaket Gunung', desc: 'Windproof & Insulated (Tebal)' });
    personal.push({ name: 'Sleeping Bag', desc: 'Nyaman untuk suhu gunung (comfort limit 10-15°C)' });
    personal.push({ name: 'Matras Pribadi', desc: 'Spons atau tiup' });
  } else {
    personal.push({ name: 'Jaket Windbreaker', desc: 'Ringan dan tahan angin' });
  }
  personal.push({ name: 'Jas Hujan / Ponco', desc: 'Wajib dibawa setiap orang, untuk safety' });
  personal.push({ name: 'Sepatu / Sandal Trekking', desc: 'Grip memadai untuk tanah/batu' });
  personal.push({ name: 'Headlamp / Senter', desc: 'Termasuk baterai cadangan' });
  personal.push({ name: 'Obat Pribadi', desc: 'Sesuai riwayat penyakit masing-masing' });
  personal.push({ name: 'Alat Makan Pribadi', desc: 'Piring, gelas, sendok (Jika camp)' });
  personal.push({ name: 'Botol Minum (Tumbler)', desc: 'Kapasitas 1L - 1.5L' });

  const finalLogistics = logistics.map(item => {
    const totalQty = typeof item.qty === 'string' ? parseFloat(item.qty) : item.qty;
    const perPersonVal = (totalQty / participants).toFixed(1).replace(/\.0$/, '');
    return {
      ...item,
      perPerson: `± ${perPersonVal} ${item.unit}/org`
    };
  });

  return { equipment, logistics: finalLogistics, personal };
}
