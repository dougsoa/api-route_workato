import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { codigoRastreamento } = await request.json();

    if (!codigoRastreamento) {
      return NextResponse.json(
        { error: "Código de rastreamento não fornecido." },
        { status: 400 }
      );
    }

    // Simulação de dados de rastreamento
    const rastreamento = {
      "ABC123": {
        status: "Em trânsito",
        eventos: [
          { data: "2025-01-30", evento: "Objeto postado no centro de distribuição." },
          { data: "2025-02-01", evento: "Objeto saiu para entrega." },
        ]
      },
      "XYZ456": {
        status: "Entregue",
        eventos: [
          { data: "2025-01-28", evento: "Objeto postado no centro de distribuição." },
          { data: "2025-01-29", evento: "Objeto entregue ao destinatário." },
        ]
      }
    };

    // Verificar se o código de rastreamento existe
    if (!rastreamento[codigoRastreamento]) {
      return NextResponse.json(
        { error: "Código de rastreamento não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      codigoRastreamento,
      status: rastreamento[codigoRastreamento].status,
      eventos: rastreamento[codigoRastreamento].eventos
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Erro ao rastrear o pedido." },
      { status: 500 }
    );
  }
} 