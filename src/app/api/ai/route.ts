import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API AI belum diimplementasikan.' }, { status: 501 });
}
