import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { CEP, Produto_Solicitado } = await request.json();

    if (!CEP) {
      return NextResponse.json(
        { error: "CEP não fornecido." },
        { status: 400 }
      );
    }

    // Função para calcular prazo baseado no CEP
    const calcularPrazoEntrega = (cep) => {
      // Simulação de prazos por região do CEP
      const primeirosDigitos = cep.substring(0, 2);
      
      // Prazos estimados por região
      const prazos = {
        '01': 3, // São Paulo capital
        '02': 3,
        '03': 3,
        '04': 3,
        '05': 3,
        '06': 4, // Grande São Paulo
        '07': 4,
        '08': 4,
        '11': 5, // Interior de SP
        '12': 5,
        '13': 5,
        default: 7 // Outros estados
      };

      return prazos[primeirosDigitos] || prazos.default;
    };

    const prazoEmDias = calcularPrazoEntrega(CEP);
    const dataAtual = new Date();
    const dataEstimada = new Date(dataAtual);
    dataEstimada.setDate(dataEstimada.getDate() + prazoEmDias);

    return NextResponse.json({
      produto: Produto_Solicitado,
      cep: CEP,
      prazoEstimado: `${prazoEmDias} dias úteis`,
      dataEstimadaEntrega: dataEstimada.toISOString().split('T')[0],
      mensagem: `Seu ${Produto_Solicitado} será entregue em aproximadamente ${prazoEmDias} dias úteis.`
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erro ao calcular o prazo de entrega." },
      { status: 500 }
    );
  }
} 