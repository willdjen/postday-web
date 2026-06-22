import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { mode?: string; topic?: string; tones?: string[] }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  const { mode, topic, tones } = body

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return NextResponse.json({ error: 'Topik wajib diisi' }, { status: 400 })
  }

  if (tones && !Array.isArray(tones)) {
    return NextResponse.json({ error: 'Tones harus berupa array' }, { status: 400 })
  }

  const tonesStr = tones && tones.length > 0 ? tones.join(', ') : 'Professional'

  // Mock fallback when no OpenAI key configured
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      content: `🚀 ${topic}\n\nIni adalah contoh post AI tentang "${topic}".\n\nTone: ${tonesStr}\n\nPlatform kami membantu UMKM Indonesia membuat konten media sosial yang menarik dan profesional!\n\n💡 Tips: Gunakan konten yang autentik untuk membangun kepercayaan pelanggan.\n\n#postday #kontenkreatif #umkm #socialmedia`,
      hashtags: ['postday', 'kontenkreatif', 'umkm', 'socialmedia', 'bisnisdigital', 'tipsmarketing'],
    })
  }

  // Real OpenAI call
  try {
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const prompt = `Buat post media sosial tentang: ${topic}
Tone: ${tonesStr}
Mode: ${mode ?? 'scratch'}
Bahasa: Indonesia
Platform: Instagram

Buat konten yang menarik untuk UMKM Indonesia. Sertakan emoji jika sesuai.
Konten harus engaging, mudah dibaca, dan memotivasi interaksi.
Berikan juga 5-8 hashtag relevan.

Respon dalam format JSON:
{ "content": "...", "hashtags": ["...", "..."] }`

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
    return NextResponse.json({ error: 'Gagal generate konten dari AI' }, { status: 500 })
  }
}
