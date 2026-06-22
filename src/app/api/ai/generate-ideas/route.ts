import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { topic?: string; useNews?: boolean }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  const { topic, useNews } = body

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return NextResponse.json({ error: 'Topik wajib diisi' }, { status: 400 })
  }

  // Mock fallback
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      ideas: [
        `5 Tips Memulai ${topic} untuk Pemula`,
        `Kesalahan Umum dalam ${topic} yang Harus Dihindari`,
        `Tren ${topic} di Indonesia Tahun 2025`,
        `Cara Meningkatkan Penjualan dengan ${topic}`,
        `Rahasia Sukses UMKM di Bidang ${topic}`,
        `Panduan Lengkap ${topic} untuk Bisnis Kecil`,
      ],
    })
  }

  // Real OpenAI call
  try {
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const newsContext = useNews
      ? '\nSertakan referensi ke tren atau berita terkini yang relevan.'
      : ''

    const prompt = `Buatkan 6 ide post media sosial tentang topik: ${topic}
Bahasa: Indonesia
Target: UMKM dan bisnis kecil Indonesia${newsContext}

Setiap ide harus berupa judul/topik yang menarik dan bisa langsung dijadikan post.
Ide harus bervariasi (tips, tren, tutorial, studi kasus, dll).

Respon dalam format JSON:
{ "ideas": ["ide 1", "ide 2", "ide 3", "ide 4", "ide 5", "ide 6"] }`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const messageContent = response.choices[0]?.message?.content
    if (!messageContent) {
      return NextResponse.json({ error: 'AI tidak mengembalikan response' }, { status: 500 })
    }

    const result = JSON.parse(messageContent)
    return NextResponse.json(result)
  } catch (err) {
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'Gagal generate ide dari AI' }, { status: 500 })
  }
}
