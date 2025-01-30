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

    // Função para normalizar o nome do produto
    const normalizarProduto = (nome) => {
      if (!nome) return 'Produto Genérico';
      return nome.trim().toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '');
    };

    // Função para categorizar produto não catalogado
    const categorizarProdutoGenerico = (nomeProduto) => {
      const palavrasChave = {
        eletronico: ['smart', 'phone', 'celular', 'tablet', 'computador', 'notebook'],
        eletrodomestico: ['fogao', 'geladeira', 'freezer', 'maquina', 'micro'],
        movel: ['mesa', 'cadeira', 'armario', 'estante', 'sofa'],
        pequeno: ['fone', 'relogio', 'carregador', 'controle']
      };

      const nomeNormalizado = normalizarProduto(nomeProduto);
      
      for (const [categoria, palavras] of Object.entries(palavrasChave)) {
        if (palavras.some(palavra => nomeNormalizado.includes(palavra))) {
          return categoria;
        }
      }
      
      return 'outros';
    };

    // Especificações genéricas por categoria
    const especificacoesGenericas = {
      eletronico: {
        peso: 3,
        valor: 1500,
        dimensoes: { altura: 30, largura: 40, comprimento: 50 },
        fragil: true
      },
      eletrodomestico: {
        peso: 25,
        valor: 2000,
        dimensoes: { altura: 60, largura: 60, comprimento: 80 },
        fragil: true
      },
      movel: {
        peso: 20,
        valor: 800,
        dimensoes: { altura: 100, largura: 80, comprimento: 60 },
        fragil: false
      },
      pequeno: {
        peso: 0.5,
        valor: 200,
        dimensoes: { altura: 15, largura: 15, comprimento: 15 },
        fragil: true
      },
      outros: {
        peso: 5,
        valor: 500,
        dimensoes: { altura: 30, largura: 30, comprimento: 30 },
        fragil: true
      }
    };

    // Catálogo de produtos com especificações
    const produtosInfo = {
      "Notebook": {
        peso: 2.5,
        valor: 3500,
        dimensoes: { altura: 25, largura: 35, comprimento: 45 },
        fragil: true
      },
      "Smartphone": {
        peso: 0.3,
        valor: 2500,
        dimensoes: { altura: 15, largura: 8, comprimento: 2 },
        fragil: true
      },
      "Televisão": {
        peso: 15,
        valor: 3000,
        dimensoes: { altura: 80, largura: 120, comprimento: 15 },
        fragil: true
      },
      "Geladeira": {
        peso: 60,
        valor: 4000,
        dimensoes: { altura: 170, largura: 70, comprimento: 70 },
        fragil: true
      },
      "Fogão": {
        peso: 40,
        valor: 1500,
        dimensoes: { altura: 85, largura: 60, comprimento: 60 },
        fragil: false
      },
      "Máquina de Lavar": {
        peso: 45,
        valor: 2500,
        dimensoes: { altura: 90, largura: 60, comprimento: 60 },
        fragil: false
      },
      "Micro-ondas": {
        peso: 12,
        valor: 600,
        dimensoes: { altura: 30, largura: 50, comprimento: 40 },
        fragil: true
      },
      "Aspirador de Pó": {
        peso: 5,
        valor: 400,
        dimensoes: { altura: 40, largura: 30, comprimento: 30 },
        fragil: false
      },
      "Ventilador": {
        peso: 3,
        valor: 200,
        dimensoes: { altura: 50, largura: 40, comprimento: 30 },
        fragil: true
      },
      "Computador": {
        peso: 8,
        valor: 4500,
        dimensoes: { altura: 45, largura: 20, comprimento: 40 },
        fragil: true
      },
      "Smartwatch": {
        peso: 0.1,
        valor: 800,
        dimensoes: { altura: 5, largura: 5, comprimento: 2 },
        fragil: true
      },
      "Impressora": {
        peso: 7,
        valor: 1200,
        dimensoes: { altura: 25, largura: 45, comprimento: 35 },
        fragil: true
      },
      "Headphone": {
        peso: 0.3,
        valor: 300,
        dimensoes: { altura: 20, largura: 18, comprimento: 10 },
        fragil: true
      },
      "Monitor": {
        peso: 5,
        valor: 1500,
        dimensoes: { altura: 50, largura: 70, comprimento: 20 },
        fragil: true
      },
      "Mesa Gamer": {
        peso: 25,
        valor: 800,
        dimensoes: { altura: 75, largura: 120, comprimento: 60 },
        fragil: false
      },
      "Cadeira Gamer": {
        peso: 18,
        valor: 900,
        dimensoes: { altura: 130, largura: 65, comprimento: 65 },
        fragil: false
      },
      "Ar-Condicionado": {
        peso: 12,
        valor: 2200,
        dimensoes: { altura: 30, largura: 90, comprimento: 20 },
        fragil: true
      },
      "Ferro de Passar": {
        peso: 1.2,
        valor: 150,
        dimensoes: { altura: 15, largura: 30, comprimento: 12 },
        fragil: false
      },
      "Liquidificador": {
        peso: 2,
        valor: 200,
        dimensoes: { altura: 40, largura: 20, comprimento: 20 },
        fragil: true
      },
      "Panela Elétrica": {
        peso: 3,
        valor: 300,
        dimensoes: { altura: 25, largura: 30, comprimento: 30 },
        fragil: false
      },
      default: {
        peso: 1,
        valor: 500,
        dimensoes: { altura: 20, largura: 20, comprimento: 30 },
        fragil: false
      }
    };

    // Lógica melhorada para obter informações do produto
    let produtoInfo;
    if (produtosInfo[Produto_Solicitado]) {
      produtoInfo = produtosInfo[Produto_Solicitado];
    } else {
      const categoria = categorizarProdutoGenerico(Produto_Solicitado);
      produtoInfo = especificacoesGenericas[categoria];
    }

    // Adiciona informação sobre produto não catalogado
    const produtoNaoCatalogado = !produtosInfo[Produto_Solicitado];

    // Função para calcular prazo baseado no CEP e peso do produto
    const calcularPrazoEntrega = (cep, peso) => {
      const primeirosDigitos = cep.substring(0, 2);
      let prazoBase = {
        '01': 3, '02': 3, '03': 3, '04': 3, '05': 3, // SP Capital
        '06': 4, '07': 4, '08': 4, // Grande SP
        '11': 5, '12': 5, '13': 5, // Interior SP
        default: 7 // Outros estados
      }[primeirosDigitos] || 7;

      // Adiciona dias extras para produtos pesados
      if (peso > 30) prazoBase += 3;
      else if (peso > 10) prazoBase += 1;

      return prazoBase;
    };

    // Função para calcular frete
    const calcularFrete = (cep, produto) => {
      const primeirosDigitos = cep.substring(0, 2);
      
      // Taxa base por região
      const taxasBase = {
        '01': 25, '02': 25, '03': 25, '04': 25, '05': 25, // SP Capital
        '06': 35, '07': 35, '08': 35, // Grande SP
        '11': 45, '12': 45, '13': 45, // Interior SP
        default: 60 // Outros estados
      };

      const taxaBase = taxasBase[primeirosDigitos] || taxasBase.default;
      
      // Cálculo do frete
      const volumeProduto = produto.dimensoes.altura * 
                           produto.dimensoes.largura * 
                           produto.dimensoes.comprimento;
      
      const taxaPeso = produto.peso * 5;
      const taxaVolume = volumeProduto * 0.0001;
      const taxaValor = produto.valor * 0.01; // Taxa de seguro
      const taxaFragil = produto.fragil ? produto.valor * 0.02 : 0; // Taxa extra para produtos frágeis

      return taxaBase + taxaPeso + taxaVolume + taxaValor + taxaFragil;
    };

    const prazoEmDias = calcularPrazoEntrega(CEP, produtoInfo.peso);
    const valorFrete = calcularFrete(CEP, produtoInfo);
    const dataAtual = new Date();
    const dataEstimada = new Date(dataAtual);
    dataEstimada.setDate(dataEstimada.getDate() + prazoEmDias);

    return NextResponse.json({
      produto: Produto_Solicitado,
      produtoNaoCatalogado,
      categoriaEstimada: produtoNaoCatalogado ? categorizarProdutoGenerico(Produto_Solicitado) : null,
      cep: CEP,
      prazoEstimado: `${prazoEmDias} dias úteis`,
      dataEstimadaEntrega: dataEstimada.toISOString().split('T')[0],
      valorFrete: valorFrete.toFixed(2),
      detalhesEnvio: {
        peso: produtoInfo.peso,
        dimensoes: produtoInfo.dimensoes,
        valorDeclarado: produtoInfo.valor,
        fragil: produtoInfo.fragil,
        estimativa: produtoNaoCatalogado
      },
      mensagem: `Seu ${Produto_Solicitado}${produtoNaoCatalogado ? ' (produto não catalogado)' : ''} será entregue em aproximadamente ${prazoEmDias} dias úteis. Valor do frete: R$ ${valorFrete.toFixed(2)}`
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erro ao calcular o prazo e valor do frete." },
      { status: 500 }
    );
  }
} 