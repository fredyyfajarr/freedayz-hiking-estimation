export interface Mountain {
  id: string;
  name: string;
  location: string;
  elevation: number;
  basecamp: string;
  simaksi: number;
  standardDuration: number; // in days
}

export const MOUNTAINS: Mountain[] = [
  { id: 'gede-cibodas', name: 'Gunung Gede (Via Cibodas)', location: 'Jawa Barat', elevation: 2958, basecamp: 'Cibodas', simaksi: 35000, standardDuration: 2 },
  { id: 'gede-putri', name: 'Gunung Gede (Via Putri)', location: 'Jawa Barat', elevation: 2958, basecamp: 'Gunung Putri', simaksi: 35000, standardDuration: 2 },
  { id: 'pangrango-cibodas', name: 'Gunung Pangrango (Via Cibodas)', location: 'Jawa Barat', elevation: 3019, basecamp: 'Cibodas', simaksi: 35000, standardDuration: 2 },
  { id: 'salak-cangkuang', name: 'Gunung Salak (Via Cangkuang)', location: 'Jawa Barat', elevation: 2211, basecamp: 'Cangkuang', simaksi: 15000, standardDuration: 2 },
  { id: 'ceremai-apuy', name: 'Gunung Ceremai (Via Apuy)', location: 'Jawa Barat', elevation: 3078, basecamp: 'Apuy', simaksi: 50000, standardDuration: 2 },
  { id: 'slamet-bambangan', name: 'Gunung Slamet (Via Bambangan)', location: 'Jawa Tengah', elevation: 3432, basecamp: 'Bambangan', simaksi: 25000, standardDuration: 3 },
  { id: 'sumbing-garung', name: 'Gunung Sumbing (Via Garung)', location: 'Jawa Tengah', elevation: 3371, basecamp: 'Garung', simaksi: 25000, standardDuration: 2 },
  { id: 'sindoro-kledung', name: 'Gunung Sindoro (Via Kledung)', location: 'Jawa Tengah', elevation: 3136, basecamp: 'Kledung', simaksi: 25000, standardDuration: 2 },
  { id: 'prau-patak-banteng', name: 'Gunung Prau (Via Patak Banteng)', location: 'Jawa Tengah', elevation: 2565, basecamp: 'Patak Banteng', simaksi: 25000, standardDuration: 1 },
  { id: 'merbabu-selo', name: 'Gunung Merbabu (Via Selo)', location: 'Jawa Tengah', elevation: 3142, basecamp: 'Selo', simaksi: 15000, standardDuration: 2 },
  { id: 'merbabu-suwanting', name: 'Gunung Merbabu (Via Suwanting)', location: 'Jawa Tengah', elevation: 3142, basecamp: 'Suwanting', simaksi: 15000, standardDuration: 2 },
  { id: 'lawu-cemoro-sewu', name: 'Gunung Lawu (Via Cemoro Sewu)', location: 'Jawa Tengah', elevation: 3265, basecamp: 'Cemoro Sewu', simaksi: 20000, standardDuration: 2 },
  { id: 'semeru-ranupani', name: 'Gunung Semeru (Via Ranupani)', location: 'Jawa Timur', elevation: 3676, basecamp: 'Ranupani', simaksi: 19000, standardDuration: 3 },
  { id: 'arjuno-tretes', name: 'Gunung Arjuno (Via Tretes)', location: 'Jawa Timur', elevation: 3339, basecamp: 'Tretes', simaksi: 20000, standardDuration: 3 },
  { id: 'raung-kalibaru', name: 'Gunung Raung (Via Kalibaru)', location: 'Jawa Timur', elevation: 3344, basecamp: 'Kalibaru', simaksi: 45000, standardDuration: 3 },
  { id: 'rinjani-sembalun', name: 'Gunung Rinjani (Via Sembalun)', location: 'NTB', elevation: 3726, basecamp: 'Sembalun', simaksi: 150000, standardDuration: 4 },
  { id: 'agung-besakih', name: 'Gunung Agung (Via Besakih)', location: 'Bali', elevation: 3142, basecamp: 'Besakih', simaksi: 50000, standardDuration: 2 },
  { id: 'kerinci-kersik-tuo', name: 'Gunung Kerinci (Via Kersik Tuo)', location: 'Jambi', elevation: 3805, basecamp: 'Kersik Tuo', simaksi: 20000, standardDuration: 3 },
];
