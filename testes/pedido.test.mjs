import test from 'node:test';
import assert from 'node:assert/strict';

await import('../pedido.js');
const { CATEGORIAS, numeroPedido, validar, montarMensagem, linkWhatsApp, tipoEtiqueta } = globalThis.JpesPedido;

const loja = { quem: 'loja', nome: 'Bicicletaria Central', cidade: 'Vitória', uf: 'ES', interesse: ['Pneus e câmaras', 'Bicicletas'], receber: 'Retirar no galpão', observacao: '' };

test('categorias na ordem da página', () => {
  assert.deepEqual(CATEGORIAS, ['Bicicletas', 'Quadros', 'Rodas e aros', 'Pneus e câmaras', 'Outras peças']);
});

test('número do pedido', () => {
  assert.equal(numeroPedido(new Date(2026, 10, 22, 15, 32)), 'PED 2211-1532');
  assert.equal(numeroPedido(new Date(2026, 0, 5, 7, 4)), 'PED 0501-0704');
});

test('obrigatórios vazios na ordem do formulário, espaços contam como vazio', () => {
  assert.deepEqual(validar({}), ['quem', 'nome', 'cidade', 'interesse', 'receber']);
  assert.deepEqual(validar({ ...loja, nome: '  ', interesse: [] }), ['nome', 'interesse']);
  assert.deepEqual(validar(loja), []);
});

test('mensagem da loja, interesse na ordem das categorias, sem observação', () => {
  assert.equal(montarMensagem(loja, 'PED 2211-1532'), [
    'Olá! Vim pelo site da JPES Distribuidora.',
    'Pedido PED 2211-1532',
    'Loja ou oficina: Bicicletaria Central',
    'Cidade: Vitória - ES',
    'Interesse: Bicicletas, Pneus e câmaras',
    'Receber: Retirar no galpão',
  ].join('\n'));
});

test('mensagem para mim, com observação aparada no fim', () => {
  const m = montarMensagem({ ...loja, quem: 'para-mim', nome: 'Maria', receber: 'Receber por entrega', observacao: '  bicicleta aro 29 ' }, 'PED 2211-1532');
  assert.match(m, /\nPara mim: Maria\n/);
  assert.match(m, /\nReceber: Receber por entrega\nObservação: bicicleta aro 29$/);
});

test('link do WhatsApp com acento e &', () => {
  assert.equal(linkWhatsApp('(33) 3277-3030', 'São João & Filhos'), 'https://wa.me/3332773030?text=S%C3%A3o%20Jo%C3%A3o%20%26%20Filhos');
});

test('tipo da etiqueta', () => {
  assert.equal(tipoEtiqueta('loja'), 'ATACADO');
  assert.equal(tipoEtiqueta('para-mim'), 'USO PRÓPRIO');
  assert.equal(tipoEtiqueta(''), '');
});
