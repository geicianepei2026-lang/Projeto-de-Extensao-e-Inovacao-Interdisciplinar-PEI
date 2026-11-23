// Código de barras Code 128, conjunto B, desenhado em SVG para a etiqueta do pedido.
(function (raiz) {
  'use strict';

  // Larguras de barra e espaço de cada símbolo (valores 0 a 106; o último é a parada).
  const larguras = (
    '212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 ' +
    '221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 ' +
    '221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 ' +
    '212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 ' +
    '231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 ' +
    '231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 ' +
    '314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 ' +
    '112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 ' +
    '111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 ' +
    '214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 ' +
    '114131 311141 411131 211412 211214 211232 2331112'
  ).split(' ');

  // Converte larguras em módulos: 1 é barra, 0 é espaço, começando sempre por barra.
  const padroes = Object.freeze(larguras.map(l => [...l].map((n, i) => (i % 2 ? '0' : '1').repeat(Number(n))).join('')));

  const PARTIDA_B = 104;
  const PARADA = 106;

  function simbolos(texto) {
    const valores = [...String(texto)].map(c => {
      const codigo = c.codePointAt(0);
      if (codigo < 32 || codigo > 126) throw new RangeError('Caractere fora do Code 128 B: ' + c);
      return codigo - 32;
    });
    const verificacao = valores.reduce((soma, v, i) => soma + v * (i + 1), PARTIDA_B) % 103;
    return [PARTIDA_B, ...valores, verificacao, PARADA];
  }

  function modulos(texto) {
    return simbolos(texto).map(s => padroes[s]).join('');
  }

  // Dez módulos de zona de silêncio de cada lado.
  function svg(texto, altura = 64) {
    const m = modulos(texto);
    const largura = m.length + 20;
    const barras = [];
    for (const bloco of m.matchAll(/1+/g)) {
      barras.push(`<rect x="${bloco.index + 10}" y="0" width="${bloco[0].length}" height="${altura}" fill="#000"/>`);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} ${altura}" preserveAspectRatio="none" role="img" aria-label="Código de barras ${texto}">` +
      `<rect x="0" y="0" width="${largura}" height="${altura}" fill="#fff"/>` + barras.join('') + '</svg>';
  }

  raiz.JpesCodigoBarras = Object.freeze({ padroes, simbolos, modulos, svg });
})(globalThis);
