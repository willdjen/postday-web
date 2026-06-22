import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API analytics belum diimplementasikan.' }, { status: 501 });
}
