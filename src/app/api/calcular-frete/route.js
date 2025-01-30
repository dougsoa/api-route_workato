import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { cepOrigem, cepDestino, peso, comprimento, largura, altura, tipoServico } = await request.json();

    // Verificar se todos os dados foram passados
    if (!cepOrigem || !cepDestino || !peso || !comprimento || !largura || !altura || !tipoServico) {
      return NextResponse.json(
        { error: "Faltando parâmetros obrigatórios." },
        { status: 400 }
      );
    }

    // Simulação de cálculo de frete
    const preco = (peso * 10) + (comprimento * largura * altura * 0.001);
    const prazoEntrega = tipoServico === "expresso" ? 2 : 5;

    return NextResponse.json({
      precoFrete: preco.toFixed(2),
      prazoEntrega: prazoEntrega
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao calcular o frete." },
      { status: 500 }
    );
  }
} 