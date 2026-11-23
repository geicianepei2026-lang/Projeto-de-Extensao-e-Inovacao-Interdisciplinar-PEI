import test from 'node:test';
import assert from 'node:assert/strict';

await import('../codigo-barras.js');
const { padroes, simbolos, modulos, svg } = globalThis.JpesCodigoBarras;

test('símbolos de PJJ123C: partida B, valores, verificação 55 e parada', () => {
  assert.deepEqual(simbolos('PJJ123C'), [104, 48, 42, 42, 17, 18, 19, 35, 55, 106]);
});

test('recusa caractere fora do conjunto B', () => {
  assert.throws(() => simbolos('Peça'), RangeError);
});

test('padrões conhecidos: partida B, espaço e parada', () => {
  assert.equal(padroes[104], '11010010000');
  assert.equal(padroes[0], '11011001100');
  assert.equal(padroes[1], '11001101100');
  assert.equal(padroes[106], '1100011101011');
  assert.equal(modulos(''), '11010010000' + '11001101100' + '1100011101011');
});

test('tabela: 107 padrões distintos, 3 barras e 3 espaços de 1 a 4 módulos', () => {
  assert.equal(padroes.length, 107);
  assert.equal(new Set(padroes).size, 107);
  padroes.slice(0, 106).forEach(p => {
    assert.equal(p.length, 11);
    const blocos = p.match(/1+|0+/g);
    assert.equal(blocos.length, 6);
    assert.ok(p.startsWith('1') && p.endsWith('0'));
    assert.ok(blocos.every(b => b.length <= 4));
  });
});

test('svg tem um retângulo por barra e o número no aria-label', () => {
  const m = modulos('PED 2211-1532');
  const s = svg('PED 2211-1532');
  assert.equal((s.match(/<rect /g) || []).length, (m.match(/1+/g) || []).length + 1); // +1 do fundo
  assert.match(s, /aria-label="Código de barras PED 2211-1532"/);
  assert.match(s, new RegExp(`viewBox="0 0 ${m.length + 20} 64"`));
});
