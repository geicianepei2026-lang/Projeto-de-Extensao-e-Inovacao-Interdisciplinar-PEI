// Regras do pedido: número, campos obrigatórios e mensagem do WhatsApp.
(function (raiz) {
  'use strict';
  const CATEGORIAS = Object.freeze(['Bicicletas', 'Quadros', 'Rodas e aros', 'Pneus e câmaras', 'Outras peças']);
  const doisDigitos = n => String(n).padStart(2, '0');
  const limpo = valor => String(valor || '').trim();
  const lista = valor => (Array.isArray(valor) ? valor : []);

  // Número do pedido no formato PED DDMM-HHMM.
  function numeroPedido(data) {
    return 'PED ' + doisDigitos(data.getDate()) + doisDigitos(data.getMonth() + 1) + '-' + doisDigitos(data.getHours()) + doisDigitos(data.getMinutes());
  }

  // Devolve os obrigatórios que estão vazios, na ordem do formulário.
  function validar(dados) {
    const vazios = [];
    if (!limpo(dados.quem)) vazios.push('quem');
    if (!limpo(dados.nome)) vazios.push('nome');
    if (!limpo(dados.cidade)) vazios.push('cidade');
    if (!lista(dados.interesse).length) vazios.push('interesse');
    if (!limpo(dados.receber)) vazios.push('receber');
    return vazios;
  }

  function montarMensagem(dados, numero) {
    const interesse = CATEGORIAS.filter(c => lista(dados.interesse).includes(c));
    const linhas = [
      'Olá! Vim pelo site da JPES Distribuidora.',
      'Pedido ' + numero,
      (dados.quem === 'para-mim' ? 'Para mim: ' : 'Loja ou oficina: ') + limpo(dados.nome),
      'Cidade: ' + limpo(dados.cidade) + ' - ' + limpo(dados.uf),
      'Interesse: ' + interesse.join(', '),
      'Receber: ' + limpo(dados.receber),
    ];
    const observacao = limpo(dados.observacao);
    if (observacao) linhas.push('Observação: ' + observacao);
    return linhas.join('\n');
  }

  function linkWhatsApp(telefone, mensagem) {
    return 'https://wa.me/' + String(telefone).replace(/\D/g, '') + '?text=' + encodeURIComponent(mensagem);
  }

  function tipoEtiqueta(quem) {
    if (quem === 'loja') return 'ATACADO';
    if (quem === 'para-mim') return 'USO PRÓPRIO';
    return '';
  }

  raiz.JpesPedido = Object.freeze({ CATEGORIAS, numeroPedido, validar, montarMensagem, linkWhatsApp, tipoEtiqueta });
})(globalThis);
