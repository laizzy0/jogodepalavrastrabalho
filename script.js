const GRUPOS = [
  { tema: "Figuras geométricas", palavras: ["Triângulo", "Círculo", "Losango", "Trapézio"] },
  { tema: "Biomas brasileiros", palavras: ["Cerrado", "Caatinga", "Pampa", "Pantanal"] },
  { tema: "Partes da célula", palavras: ["Núcleo", "Membrana", "Citoplasma", "Ribossomo"] },
  { tema: "Classes gramaticais", palavras: ["Verbo", "Substantivo", "Adjetivo", "Advérbio"] },
  { tema: "Material escolar", palavras: ["Caderno", "Borracha", "Régua", "Mochila"] },
  { tema: "Estados da matéria", palavras: ["Sólido", "Líquido", "Gasoso", "Plasma"] },
  { tema: "Continentes", palavras: ["África", "Oceania", "Europa", "Ásia"] },
  { tema: "Planetas", palavras: ["Mercúrio", "Vênus", "Marte", "Saturno"] },
  { tema: "Operações matemáticas", palavras: ["Soma", "Subtração", "Divisão", "Multiplicação"] },
  { tema: "Figuras de linguagem", palavras: ["Metáfora", "Ironia", "Hipérbole", "Metonímia"] },
  { tema: "Elementos químicos", palavras: ["Oxigênio", "Hidrogênio", "Carbono", "Nitrogênio"] },
  { tema: "Períodos da História", palavras: ["Renascimento", "Iluminismo", "Feudalismo", "Antiguidade"] },
  { tema: "Partes do corpo", palavras: ["Perna", "Cabeça", "Mão", "Orelha"] },
  { tema: "Gatos", palavras: ["Siamês", "Bengal", "Persa", "Angorá Turco"] },
  { tema: "Estações do Ano", palavras: ["Outono", "Inverno", "Verão", "Primavera"] },
  { tema: "Matérias", palavras: ["História", "Matemática", "Física", "Química"] }
];

const telaInicio = document.getElementById("inicio");
const telaJogo = document.getElementById("jogo");
const areaAcertados = document.getElementById("acertados");
const areaTabuleiro = document.getElementById("tabuleiro");
const textoMensagem = document.getElementById("msg");
const textoData = document.getElementById("data");
const textoTentativas = document.getElementById("tentativas");
const textoAcertos = document.getElementById("acertos");

let grupos = [];
let palavras = [];
let resolvidos = [];
let selecionados = [];
let tentativas = 0;

function embaralhar(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function mostrarTela(nome) {
  telaInicio.classList.remove("ativa");
  telaJogo.classList.remove("ativa");
  if (nome === "inicio") {
    telaInicio.classList.add("ativa");
  } else {
    telaJogo.classList.add("ativa");
  }
}

function novaPartida() {
  grupos = embaralhar(GRUPOS).slice(0, 4);

  palavras = [];
  for (let i = 0; i < grupos.length; i++) {
    for (let j = 0; j < grupos[i].palavras.length; j++) {
      palavras.push({ texto: grupos[i].palavras[j], grupo: i });
    }
  }
  palavras = embaralhar(palavras);

  resolvidos = [];
  selecionados = [];
  tentativas = 0;
  textoMensagem.textContent = "";
  textoData.textContent = new Date().toLocaleDateString("pt-BR");
  desenhar();
}

function criarBotao(palavra) {
  const botao = document.createElement("button");
  botao.className = "tile";
  botao.textContent = palavra.texto;

  if (selecionados.includes(palavra)) {
    botao.classList.add("sel");
  }

  botao.onclick = () => clicarPalavra(palavra);
  palavra.botao = botao;
  return botao;
}

function desenhar() {
  textoTentativas.textContent = tentativas;
  textoAcertos.textContent = resolvidos.length;

  areaAcertados.innerHTML = "";
  for (let i = 0; i < resolvidos.length; i++) {
    const grupo = grupos[resolvidos[i]];
    const faixa = document.createElement("div");
    faixa.className = "acertado";

    const titulo = document.createElement("strong");
    titulo.textContent = grupo.tema;

    const listaPalavras = document.createElement("span");
    listaPalavras.textContent = grupo.palavras.join(", ");

    faixa.appendChild(titulo);
    faixa.appendChild(listaPalavras);
    areaAcertados.appendChild(faixa);
  }

  areaTabuleiro.innerHTML = "";
  for (let k = 0; k < palavras.length; k++) {
    if (!resolvidos.includes(palavras[k].grupo)) {
      areaTabuleiro.appendChild(criarBotao(palavras[k]));
    }
  }
}

function clicarPalavra(palavra) {
  if (resolvidos.length === 4) return;

  textoMensagem.textContent = "";

  const index = selecionados.indexOf(palavra);
  if (index > -1) {
    selecionados.splice(index, 1);
  } else if (selecionados.length < 4) {
    selecionados.push(palavra);
  }

  desenhar();

  if (selecionados.length === 4) {
    setTimeout(verificar, 250);
  }
}

function verificar() {
  tentativas++;

  const contagem = [0, 0, 0, 0];
  for (let i = 0; i < selecionados.length; i++) {
    contagem[selecionados[i].grupo]++;
  }

  const grupoCerto = selecionados[0].grupo;

  if (contagem[grupoCerto] === 4) {
    resolvidos.push(grupoCerto);
    selecionados = [];
    if (resolvidos.length === 4) {
      textoMensagem.textContent = `Parabéns! Você acertou os 4 grupos em ${tentativas} tentativas.`;
    } else {
      textoMensagem.textContent = "Grupo certo!";
    }
    desenhar();
  } else {
    desenhar();
    for (let j = 0; j < selecionados.length; j++) {
      if (selecionados[j].botao) {
        selecionados[j].botao.classList.add("erro");
      }
    }

    if (contagem.includes(3)) {
      textoMensagem.textContent = "Quase! Falta só uma palavra.";
    } else {
      textoMensagem.textContent = "Esses não combinam. Tente de novo.";
    }

    setTimeout(limparSelecao, 450);
  }
}

function limparSelecao() {
  selecionados = [];
  desenhar();
}

document.getElementById("btnJogue").onclick = () => {
  novaPartida();
  mostrarTela("jogo");
};

document.getElementById("btnVoltar").onclick = () => {
  mostrarTela("inicio");
};

document.getElementById("btnNova").onclick = () => {
  novaPartida();
};

document.getElementById("btnEmbaralhar").onclick = () => {
  palavras = embaralhar(palavras);
  desenhar();
};
