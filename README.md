# JPES Distribuidora: landing page

Página de apresentação da JPES Distribuidora, que vende bicicletas e peças de bike a partir de um galpão no CIVIT I, em Serra - ES. A página atende dois públicos, quem tem loja ou oficina e quem compra para si, e leva o pedido pronto para o WhatsApp da empresa. Feita em HTML, CSS e JavaScript, sem dependências nem etapa de compilação.

## Abrir

Abra `index.html` com dois cliques. Fotos, vídeo e fontes ficam em `assets/`, então a página funciona sem internet.

Com Node.js instalado, rode `npm run dev` e abra http://127.0.0.1:4178 (a porta muda com a variável `PORT`).

## Testes

`npm test` roda os testes em `testes/`:

- `pedido.test.mjs`: número do pedido, campos obrigatórios, texto da mensagem, link do WhatsApp e tipo da etiqueta.
- `codigo-barras.test.mjs`: código de barras Code 128 (tabela de padrões, dígito verificador e desenho em SVG).

## Publicar

`npm run build` copia para `dist/` só a página, os estilos, os scripts e os assets. A Vercel usa `vercel.json` para publicar essa pasta. Documentação, testes e arquivos de configuração não vão para o site.

Depois de publicar, acrescente no `<head>` do `index.html` o endereço definitivo, para a prévia aparecer certa no WhatsApp:

```html
<meta property="og:url" content="https://ENDERECO-DO-SITE/">
<meta property="og:image" content="https://ENDERECO-DO-SITE/assets/og-image.jpg">
```

## Configurar (site.config.js)

- `whatsapp`: país + DDD + número, só dígitos. Está com `553332773030`, o (33) 3277-3030 do cadastro da empresa. Todos os botões de WhatsApp e o pedido usam esse número.
- O número também aparece escrito, como texto, em "Onde fica", no rodapé e no aviso para quem está sem JavaScript. Se o número mudar, troque também nesses três lugares do `index.html`.

## O que tem na página

1. Abertura com a foto do galpão, o título e duas portas: "Tenho loja ou oficina" e "Quero para mim". Cada porta desce até o pedido com o tipo de compra já marcado.
2. O que sai do galpão: bicicletas, quadros, rodas e aros, pneus e câmaras, outras peças.
3. Um passeio pelo galpão: quatro paradas numeradas (bicicletas prontas para sair, montagem de rodas, oficina e expedição), ligadas por uma faixa amarela como a do piso. A parada da montagem de rodas tem um vídeo curto, mudo, que só toca sozinho quando o aparelho não pede menos movimento.
4. Dois jeitos de comprar: lojas e oficinas, para você, e o horário de atendimento.
5. Pedido: quem compra, nome, cidade e UF, o que procura, como prefere receber e observação. Ao lado, uma etiqueta de expedição se preenche enquanto a pessoa digita, com código de barras do número do pedido (leitores de código do celular conseguem ler). Ao enviar, o WhatsApp abre com a mensagem pronta, a etiqueta sai da impressora e aparece um link para abrir o WhatsApp de novo, caso o navegador tenha bloqueado a nova aba.
6. Onde fica: foto do escritório, endereço, horário, WhatsApp, Google Maps e Waze.
7. Rodapé com a marca, a razão social, o CNPJ, o endereço e o crédito "Desenvolvido por grupo de alunos Multivix PEI1".

No celular aparece uma barra fixa com "WhatsApp" e "Fazer pedido".

## Dados da empresa

Conferidos no cadastro da Receita Federal (situação ativa):

- Razão social: JPES Comércio Atacadista de Peças e Acessórios Ltda.
- CNPJ 37.794.121/0001-62, aberta em 20/07/2020.
- Endereço: Rua Porto de Praia Mole, s/n, Quadra 3, Galpões 1, 2 e 3, Sala 1, CIVIT I, Serra - ES, CEP 29168-005.
- Telefone: (33) 3277-3030.

## O que é ilustrativo

A página foi feita como trabalho acadêmico. São ilustrativos, para a empresa confirmar ou trocar:

- Horário de atendimento: segunda a sexta, 7h30 às 17h30; sábado, 8h às 12h.
- Formas de atendimento: atacado e varejo, retirada no galpão ou entrega.
- Logotipo: coroa de bicicleta com o nome, desenhada para a página. Se a empresa mandar o arquivo oficial, trocar no cabeçalho, no rodapé e no `assets/favicon.svg`.

A página não mostra preço, pedido mínimo, prazo nem área de entrega.

## Fotos e vídeo

Fotos e vídeo reais, feitos no galpão da empresa, com autorização das pessoas que aparecem. Receberam só recorte e ajuste de brilho e contraste. As versões para web ficam em `assets/img/` (WebP) e `assets/video/` (MP4 sem som).

- `galpao`: galpão com prateleiras de porta-paletes e a paleteira (abertura). Uma faixa dessa foto é a imagem de compartilhamento `og-image.jpg`.
- `bicicletas`: caixas de bicicleta sobre os paletes.
- `rodas`: máquina de montar rodas. O vídeo `rodas.mp4` mostra a bandeja que separa os niples.
- `oficina`: bancada com morsa e ferramentas.
- `expedicao`: balcão da expedição com a impressora de etiquetas.
- `escritorio`: escritório de vidro de frente para o galpão (onde fica).

## Fontes

Saira Condensed (títulos e logo), Public Sans (textos) e Space Mono (etiqueta e números), do Google Fonts, sob SIL Open Font License, reduzidas aos caracteres do português. Licenças em `assets/fonts/`.
