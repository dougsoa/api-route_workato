import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("oi")
    return NextResponse.json({ message: "Recebido!", data: body }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 });
  }
}