import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { itemName } = await req.json();

    if (!itemName) {
      return NextResponse.json({ error: "Item name is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    // Menggunakan alias gemini-flash-latest yang dijamin kompatibel dengan semua akun/key
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Anda adalah asisten khusus untuk aplikasi kalkulator pendakian gunung di Indonesia. 
Tugas Anda adalah memperkirakan harga rata-rata/wajar di minimarket atau pasar Indonesia (tahun berjalan) untuk barang berikut: "${itemName}".
ATURAN SANGAT KETAT:
1. Anda HANYA boleh membalas dengan ANGKA SAJA (tanpa titik, koma, huruf, atau simbol mata uang).
2. Jika barang tidak spesifik (misal: "tenda"), berikan tebakan harga rata-rata sewa per hari atau harga beli murah, namun hanya dalam bentuk angka.
3. Misalnya, jika perkiraan harga adalah Rp 45.000, balas persis: 45000`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean the response: remove any non-digit characters to ensure strict numeric output
    const numericMatch = responseText.replace(/[^0-9]/g, '');
    const estimatedPrice = parseInt(numericMatch, 10) || 0;

    return NextResponse.json({ price: estimatedPrice });
  } catch (error: any) {
    console.error("Gemini API Error:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to estimate price" }, { status: 500 });
  }
}
