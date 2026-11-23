// Liga a página: menu, botões de WhatsApp, vídeo e pedido.
(function () {
  'use strict';
  const config = window.JPES_CONFIG;
  const { linkWhatsApp } = window.JpesPedido;
  const MENSAGEM_PADRAO = 'Olá! Vim pelo site da JPES Distribuidora.';

  // Todo botão marcado com data-whatsapp abre a conversa com a mensagem padrão.
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    link.href = linkWhatsApp(config.whatsapp, MENSAGEM_PADRAO);
    link.target = '_blank';
    link.rel = 'noopener';
  });

  // Menu do celular.
  const botaoMenu = document.getElementById('menu-botao');
  const menu = document.getElementById('menu-principal');
  const fecharMenu = () => {
    botaoMenu.setAttribute('aria-expanded', 'false');
    menu.classList.remove('aberto');
  };
  botaoMenu.addEventListener('click', () => {
    const abrir = botaoMenu.getAttribute('aria-expanded') !== 'true';
    botaoMenu.setAttribute('aria-expanded', String(abrir));
    menu.classList.toggle('aberto', abrir);
  });
  menu.addEventListener('click', evento => { if (evento.target.closest('a')) fecharMenu(); });
  document.addEventListener('click', evento => {
    if (botaoMenu.getAttribute('aria-expanded') === 'true' && !menu.contains(evento.target) && !botaoMenu.contains(evento.target)) fecharMenu();
  });
  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && botaoMenu.getAttribute('aria-expanded') === 'true') { fecharMenu(); botaoMenu.focus(); }
  });

  // Vídeo da montagem de rodas: toca sozinho, mudo, só quando o aparelho não pede menos movimento.
  const video = document.getElementById('video-rodas');
  const botaoVideo = document.getElementById('video-tocar');
  const atualizarBotaoVideo = () => { botaoVideo.textContent = video.paused ? 'Tocar vídeo' : 'Pausar vídeo'; };
  let querTocar = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  botaoVideo.addEventListener('click', () => {
    querTocar = video.paused;
    if (querTocar) video.play().catch(() => {}); else video.pause();
  });
  video.addEventListener('play', atualizarBotaoVideo);
  video.addEventListener('pause', atualizarBotaoVideo);
  new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting && querTocar) video.play().catch(() => {});
      else if (!entrada.isIntersecting && !video.paused) video.pause();
    });
  }, { threshold: 0.3 }).observe(video);

  // Pedido: o formulário preenche a etiqueta e, no envio, abre o WhatsApp com a mensagem pronta.
  const { CATEGORIAS, numeroPedido, validar, montarMensagem, tipoEtiqueta } = window.JpesPedido;
  const form = document.getElementById('form-pedido');
  const etiqueta = document.getElementById('etiqueta');
  const codigo = document.getElementById('etiqueta-codigo');
  const rotuloNome = document.getElementById('ped-nome-rotulo');
  const obs = document.getElementById('ped-obs');
  const contador = document.getElementById('ped-contador');
  const aviso = document.getElementById('ped-aviso');
  const reabrir = document.getElementById('ped-reabrir');
  const botaoNovo = document.getElementById('ped-novo');
  const anuncio = document.getElementById('ped-anuncio');
  const campoEtiqueta = nome => etiqueta.querySelector(`[data-campo="${nome}"]`);
  const ROTULOS = { loja: 'Nome da loja ou oficina', 'para-mim': 'Seu nome' };
  const EXEMPLOS = { loja: 'Ex.: quero o catálogo de atacado', 'para-mim': 'Ex.: bicicleta aro 29' };
  const RECEBER = { 'Retirar no galpão': 'RETIRADA NO GALPÃO', 'Receber por entrega': 'ENTREGA' };
  const doisDigitos = n => String(n).padStart(2, '0');
  let numero = '';
  let tentouEnviar = false;

  function lerFormulario() {
    const marcado = nome => (form.querySelector(`input[name="${nome}"]:checked`) || {}).value || '';
    return {
      quem: marcado('quem'),
      nome: form.elements.nome.value,
      cidade: form.elements.cidade.value,
      uf: form.elements.uf.value,
      interesse: [...form.querySelectorAll('input[name="interesse"]:checked')].map(c => c.value),
      receber: marcado('receber'),
      observacao: obs.value,
    };
  }

  function preencher(nome, texto) {
    const el = campoEtiqueta(nome);
    el.textContent = texto;
    el.className = texto ? '' : 'vazio';
  }

  function novoNumero() {
    numero = numeroPedido(new Date());
    campoEtiqueta('numero').textContent = numero;
    codigo.innerHTML = window.JpesCodigoBarras.svg(numero);
  }

  function mostrarErros(dados) {
    const vazios = validar(dados);
    ['quem', 'nome', 'cidade', 'interesse', 'receber'].forEach(campo => {
      const invalido = vazios.includes(campo);
      document.getElementById('erro-' + campo).hidden = !invalido;
      const idErro = 'erro-' + campo;
      form.querySelectorAll(`[name="${campo}"]`).forEach(el => {
        const descricao = (el.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== idErro);
        if (invalido) { el.setAttribute('aria-invalid', 'true'); descricao.push(idErro); } else el.removeAttribute('aria-invalid');
        if (descricao.length) el.setAttribute('aria-describedby', descricao.join(' ')); else el.removeAttribute('aria-describedby');
      });
    });
    return vazios;
  }

  function atualizar() {
    const dados = lerFormulario();
    rotuloNome.textContent = ROTULOS[dados.quem] || 'Nome';
    obs.placeholder = EXEMPLOS[dados.quem] || EXEMPLOS.loja;
    contador.textContent = obs.value.length + '/300';
    preencher('tipo', tipoEtiqueta(dados.quem));
    preencher('nome', dados.nome.trim());
    preencher('cidade', dados.cidade.trim() ? dados.cidade.trim() + ' - ' + dados.uf : '');
    preencher('conteudo', CATEGORIAS.filter(c => dados.interesse.includes(c)).join(', '));
    preencher('receber', RECEBER[dados.receber] || '');
    if (tentouEnviar) mostrarErros(dados);
    return dados;
  }

  // Qualquer mudança depois de impressa volta a etiqueta ao rascunho.
  function desfazerImpressao() {
    etiqueta.classList.remove('impressa');
    campoEtiqueta('impressa').textContent = '';
    aviso.hidden = true;
    anuncio.textContent = '';
  }

  form.addEventListener('input', () => { desfazerImpressao(); atualizar(); });
  form.addEventListener('change', () => { desfazerImpressao(); atualizar(); });

  form.addEventListener('submit', evento => {
    evento.preventDefault();
    tentouEnviar = true;
    const dados = atualizar();
    const vazios = mostrarErros(dados);
    if (vazios.length) {
      form.querySelector(`[name="${vazios[0]}"]`).focus();
      return;
    }
    const link = linkWhatsApp(config.whatsapp, montarMensagem(dados, numero));
    window.open(link, '_blank', 'noopener');
    const agora = new Date();
    campoEtiqueta('impressa').textContent = `IMPRESSA ${doisDigitos(agora.getDate())}/${doisDigitos(agora.getMonth() + 1)} ${doisDigitos(agora.getHours())}:${doisDigitos(agora.getMinutes())}`;
    etiqueta.classList.add('impressa');
    reabrir.href = link;
    aviso.hidden = false;
    anuncio.textContent = 'Etiqueta impressa. Pedido ' + numero + ' aberto no WhatsApp, numa nova aba.';
    botaoNovo.hidden = false;
  });

  botaoNovo.addEventListener('click', () => {
    form.reset();
    botaoNovo.hidden = true;
    tentouEnviar = false;
    desfazerImpressao();
    mostrarErros({ quem: 'x', nome: 'x', cidade: 'x', interesse: ['x'], receber: 'x' });
    novoNumero();
    atualizar();
    form.querySelector('input[name="quem"]').focus();
  });

  // Portas e atalhos marcam quem compra antes de descer até o pedido.
  document.querySelectorAll('a[data-tipo]').forEach(link => {
    link.addEventListener('click', () => {
      const opcao = form.querySelector(`input[name="quem"][value="${link.dataset.tipo}"]`);
      opcao.checked = true;
      desfazerImpressao();
      atualizar();
    });
  });

  novoNumero();
  atualizar();
})();
