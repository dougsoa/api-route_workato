const functions = require("firebase-functions");
const axios = require("axios");

exports.calcularFrete = functions.https.onRequest(async (req, res) => {
  // Receber dados da requisição
  const { cepOrigem, cepDestino, peso, comprimento, largura, altura, tipoServico } = req.body;

  // Verificar se todos os dados foram passados
  if (!cepOrigem || !cepDestino || !peso || !comprimento || !largura || !altura || !tipoServico) {
    return res.status(400).send({ error: "Faltando parâmetros obrigatórios." });
  }

  try {
    // Simulação de cálculo de frete
    const preco = (peso * 10) + (comprimento * largura * altura * 0.001);
    const prazoEntrega = tipoServico === "expresso" ? 2 : 5; // Prazo de entrega com base no tipo de serviço

    // Retornar os dados
    return res.status(200).json({
      precoFrete: preco.toFixed(2),
      prazoEntrega: prazoEntrega
    });
  } catch (error) {
    return res.status(500).send({ error: "Erro ao calcular o frete." });
  }
});


exports.rastrearPedido = functions.https.onRequest(async (req, res) => {
    const { codigoRastreamento } = req.body;
  
    if (!codigoRastreamento) {
      return res.status(400).send({ error: "Código de rastreamento não fornecido." });
    }
  
    try {
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
        return res.status(404).send({ error: "Código de rastreamento não encontrado." });
      }
  
      // Retornar status e eventos
      return res.status(200).json({
        codigoRastreamento,
        status: rastreamento[codigoRastreamento].status,
        eventos: rastreamento[codigoRastreamento].eventos
      });
    } catch (error) {
      return res.status(500).send({ error: "Erro ao rastrear o pedido." });
    }
  });
  