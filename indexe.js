/*******************************************************************************
 * =============================================================================
 * 4. MÓDULO DE RASTREAMENTO E QUIZZES (DIABETES, HIPERTENSÃO, COLESTEROL)
 * =============================================================================
 ******************************************************************************/

// Estados globais de controle do quiz em execução
let curQuiz = [], curIdx = 0, curScore = 0, curType = "";
let scoreHistory = []; // Armazena os pontos ganhos em cada rodada para permitir o "Voltar"

// Base de Dados de Perguntas e Pontuações do Rastreamento
const quizData = {
  // =====================================================
  // DIABETES
  // =====================================================
  Diabetes: [
    { q: "Você tem sentido uma sede excessiva, mesmo bebendo água com frequência?", pts: 3 },
    { q: "Notou que a frequência de urina aumentou muito, inclusive durante a noite?", pts: 3 },
    { q: "Houve uma perda de peso rápida e inexplicável nos últimos meses?", pts: 4 },
    { q: "Você sente fadiga, fraqueza ou falta de energia constante no dia a dia?", pts: 2 },
    { q: "Sua visão tem ficado turva, embaçada ou com dificuldade de foco?", pts: 3 },
    { q: "Você sente fome excessiva mesmo após realizar refeições completas?", pts: 3 },
    { q: "Ferimentos pequenos ou cortes demoram muito mais tempo para cicatrizar?", pts: 4 },
    { q: "Você apresenta infecções frequentes, como candidíase, infecção urinária ou problemas de pele?", pts: 4 },
    { q: "Sente formigamentos ou dormência nas mãos ou pés?", pts: 4 },
    { q: "Percebe manchas escurecidas na região do pescoço, axilas ou virilha?", pts: 4 },
    { q: "Possui problemas gengivais frequentes, gengivite ou sangramentos na boca?", pts: 3 },
    { q: "Possui familiares de primeiro grau (pais/irmãos) diagnosticados com Diabetes?", pts: 5 },
    { q: "Você pratica menos de 150 minutos de atividade física por semana?", pts: 2 }
  ],

  // =====================================================
  // HIPERTENSÃO
  // =====================================================
  Hipertensão: [
    { q: "Sente dores de cabeça frequentes, especialmente na região da nuca pela manhã?", pts: 4 },
    { q: "Tem tonturas, palpitações cardíacas ou sensação de peito apertado?", pts: 3 },
    { q: "Costuma consumir alimentos embutidos, enlatados ou usa muito sal na comida?", pts: 3 },
    { q: "Existe histórico de pressão alta, infarto ou AVC em sua família próxima?", pts: 4 },
    { q: "Sente zumbidos no ouvido ou vê pequenos pontos brilhantes na visão?", pts: 3 },
    { q: "Sua rotina de trabalho ou pessoal é marcada por altos níveis de estresse?", pts: 2 },
    { q: "Sente falta de ar ou cansaço desproporcional ao realizar pequenos esforços?", pts: 4 },
    { q: "Você já apresentou pressão arterial acima de 14x9 anteriormente?", pts: 5 },
    { q: "Sente sensação de pressão forte na cabeça ou na região dos olhos?", pts: 3 },
    { q: "Já teve episódios de sangramento nasal espontâneo?", pts: 3 },
    { q: "Você possui obesidade ou excesso de gordura abdominal?", pts: 3 },
    { q: "Você fuma ou consome bebida alcoólica frequentemente?", pts: 4 },
    { q: "Você apresenta ansiedade intensa ou irritabilidade frequente?", pts: 2 },
    { q: "Já sentiu dor forte no peito associada à falta de ar?", pts: 5 }
  ],

  // =====================================================
  // COLESTEROL
  // =====================================================
  Colesterol: [
    { q: "Sua base alimentar inclui carnes gordurosas, frituras, queijos amarelos ou ultraprocessados?", pts: 4 },
    { q: "Notou pequenas elevações ou bolinhas amareladas na região das pálpebras (xantelasmas)?", pts: 5 },
    { q: "Há histórico de colesterol elevado ou problemas cardíacos precoces na sua família?", pts: 5 },
    { q: "Sente dores, cãibras ou cansaço excessivo nas pernas ao caminhar?", pts: 3 },
    { q: "Você está atualmente acima do peso considerado ideal para sua altura?", pts: 3 },
    { q: "Sente palpitações ou desconforto no peito ao realizar atividades físicas?", pts: 4 },
    { q: "Percebeu um arco esbranquiçado ou acinzetado ao redor da íris (parte colorida do olho)?", pts: 4 },
    { q: "Mantém um estilo de vida majoritariamente sentado e sem exercícios regulares?", pts: 3 },
    { q: "Você sente falta de ar ou suor frio ao realizar pequenos esforços?", pts: 4 },
    { q: "Já apresentou exames anteriores com colesterol ou triglicerídeos elevados?", pts: 5 },
    { q: "Percebe caroços endurecidos próximos aos tendões ou articulações?", pts: 4 },
    { q: "Possui sensação de pés frios constantemente?", pts: 3 },
    { q: "Já teve episódios de perda de força em um lado do corpo?", pts: 5 },
    { q: "Percebe alterações repentinas na fala ou dificuldade para formular frases?", pts: 5 }
  ]
};

/**
 * Inicializa o estado de um quiz específico baseado na categoria selecionada.
 * @param {string} type - Tipo do quiz ('Diabetes', 'Hipertensão' ou 'Colesterol')
 */
function start(type) {
  const extraContent = document.getElementById('professionalExtraContent');
  if (extraContent) extraContent.innerHTML = "";

  curType = type;
  curQuiz = quizData[type];
  curIdx = 0;
  curScore = 0;
  scoreHistory = []; // Limpa o histórico ao começar um novo quiz
  
  showScreen('quiz');
  render();
}

/**
 * Voltar para a questão anterior removendo os pontos computados incorretamente.
 */
function backQuestion() {
  if (curIdx > 0) {
    curIdx--;
    // Remove o último registro de pontos do histórico e subtrai do score total
    const lastPts = scoreHistory.pop() || 0;
    curScore -= lastPts;
    render();
  }
}

/**
 * Renderiza na tela a questão atual, gerencia a barra de progresso e reconstrói as opções + botão voltar.
 */
function render() {
  const q = curQuiz[curIdx];
  
  const stepInfo = document.getElementById('quizStepInfo');
  const questionText = document.getElementById('questionText');
  const progress = document.getElementById('quizProgress');
  const list = document.getElementById('optionsList');

  if (stepInfo) stepInfo.innerText = `${curType} - Questão ${curIdx + 1}`;
  if (questionText) questionText.innerText = q.q;
  if (progress) progress.style.width = `${((curIdx + 1) / curQuiz.length) * 100}%`;

  if (list) {
    list.innerHTML = '';

    // Renderiza as opções principais (Sim / Não)
    ['Sim', 'Não'].forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerText = opt;
      btn.onclick = () => {
        const pointsAdded = (opt === 'Sim') ? q.pts : 0;
        scoreHistory.push(pointsAdded); // Salva no histórico o que foi somado nesta questão
        curScore += pointsAdded;
        
        curIdx++;
        if (curIdx < curQuiz.length) {
          render();
        } else {
          finish();
        }
      };
      list.appendChild(btn);
    });

    // Se NÃO for a primeira pergunta, adiciona o Botão Voltar abaixo das opções
    if (curIdx > 0) {
      const backBtn = document.createElement('button');
      backBtn.className = 'option-btn back-btn'; // Classe extra para você estilizar em CSS se quiser
      backBtn.style.backgroundColor = '#6c757d'; // Cor cinza padrão para destacar das opções
      backBtn.style.marginTop = '15px';
      backBtn.innerText = '← Voltar para a anterior';
      backBtn.onclick = () => backQuestion();
      list.appendChild(backBtn);
    }
  }
}

/**
 * Finaliza o quiz ativo, processa a pontuação final de risco e imprime as condutas/médicos recomendados.
 */
function finish() {
  showScreen('result');
  
  const st = document.getElementById('resultStatus');
  const ds = document.getElementById('resultDescription');
  const extra = document.getElementById('professionalExtraContent');

  let medico = "";
  let tratamiento = "";
  let imediato = "";
  let emergencia = "";

  // Definição da Faixa e Classificação de Risco por Cor
  if (st) {
    if (curScore >= 30) {
      st.innerText = "Risco Elevado";
      st.style.color = "#ff4d4d";
    } else if (curScore >= 15) {
      st.innerText = "Atenção";
      st.style.color = "#ffa500";
    } else {
      st.innerText = "Baixo Risco";
      st.style.color = "#00ff7f";
    }
  }

  // Direcionamento de Conduta Condicional ao Tipo de Quiz
  if (curType === "Diabetes") {
    medico = "Endocrinologista";
    tratamento = "Controle glicêmico, reeducação alimentar, atividade física e possível terapia medicamentosa.";
    imediato = "Evitar açúcar, refrigerantes, excesso de carboidratos refinados e iniciar rotina de exercícios leves.";
    emergencia = "Caso exista visão muito embaçada, vômitos, desmaios ou glicemia extremamente alta, procurar emergência imediatamente.";
  } else if (curType === "Hipertensão") {
    medico = "Cardiologista";
    tratamento = "Controle da pressão arterial, redução de sódio, controle do estresse e possível uso de anti-hipertensivos.";
    imediato = "Evitar excesso de sal, álcool, cigarro e monitorar a pressão regularmente.";
    emergencia = "Dor intensa no peito, pressão acima de 18x12, falta de ar ou confusão mental exigem atendimento imediato.";
  } else if (curType === "Colesterol") {
    medico = "Cardiologista ou Endocrinologista";
    tratamento = "Mudança alimentar, atividade física, redução de gorduras saturadas e possível uso de estatinas.";
    imediato = "Evitar frituras, ultraprocessados, cigarro e sedentarismo.";
    emergencia = "Dor no peito, perda de força, alteração na fala ou falta de ar podem indicar emergência cardiovascular.";
  }

  if (ds) ds.innerText = "Baseado nas respostas do rastreamento básico.";

  // Renderização do Bloco Clínico Extra do Quiz
  if (extra) {
    extra.innerHTML = `
      <div class="clinical-report">
        <div class="report-section">
          <h4>Resultado da Avaliação</h4>
          <div class="report-item"><span>Pontuação Total:</span><span>${curScore} pontos</span></div>
        </div>
        <div class="report-section">
          <h4>Especialista Recomendado</h4>
          <p>${medico}</p>
        </div>
        <div class="report-section">
          <h4>Possível Tratamento</h4>
          <p>${tratamento}</p>
        </div>
        <div class="report-section">
          <h4>Medidas Imediatas</h4>
          <p>${imediato}</p>
        </div>
        <div class="conduta-box">
          <h4 style="color:#fff;">Atenção Importante</h4>
          <p style="line-height:1.7;">${emergencia}</p>
        </div>
      </div>
    `;
  }
  MedicalVoiceAssistant.criarBotao();
}

// =====================================================
// VINCULAÇÃO SEGURA DOS BOTÕES (Suporta IDs PT e EN)
// =====================================================

// Botão de Diabetes
const btnDiabetes = document.getElementById('btnStartDiabetes');
if (btnDiabetes) {
  btnDiabetes.onclick = () => start("Diabetes");
}

// Botão de Hipertensão
const btnHipertensao = document.getElementById('btnStartHipertensao') || document.getElementById('btnStartHypertension');
if (btnHipertensao) {
  btnHipertensao.onclick = () => start("Hipertensão");
}

// Botão de Colesterol
const btnColesterol = document.getElementById('btnStartColesterol') || document.getElementById('btnStartCholesterol');
if (btnColesterol) {
  btnColesterol.onclick = () => start("Colesterol");
}

// Inicialização da tela padrão
showScreen('home');

//narração 
let narracaoAtiva = false;

const MedicalVoiceAssistant = {
  falar(texto) {
    if (!window.speechSynthesis) {
      alert("Seu navegador não suporta leitura por voz.");
      return;
    }

    speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);
    fala.rate = 1.08;
    fala.pitch = 1.0;
    fala.volume = 1;

    const vozes = speechSynthesis.getVoices();
    const voz =
      vozes.find(v => v.name.includes("Microsoft Antonio")) ||
      vozes.find(v => v.name.includes("Antonio")) ||
      vozes.find(v => v.name.includes("Daniel")) ||
      vozes.find(v => v.name.includes("Google português do Brasil")) ||
      vozes.find(v => v.lang === "pt-BR") ||
      vozes[0];

    if (voz) fala.voice = voz;

    fala.text = fala.text
      .replace(/\./g, ". ")
      .replace(/,/g, ", ")
      .replace(/:/g, ": ")
      .replace(/\s+/g, " ");

    fala.onend = () => {
      narracaoAtiva = false;
      const btn = document.getElementById("btnNarrarLaudo");
      if (btn) {
        btn.classList.remove("voice-active");
        
        // Definição do ícone para reinserção no término natural da fala
        const iconePlay = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>`;
        btn.innerHTML = `${iconePlay} <span>Ouvir Laudo</span>`;
      }
    };

    speechSynthesis.speak(fala);
  },

  narrarLaudo() {
    let texto = `Resultado da avaliação de ${curType}.`;

    if (curScore >= 30) {
      texto += `
      A classificação encontrada foi risco elevado.
      Recomenda-se procurar atendimento médico especializado.
      `;
    } else if (curScore >= 15) {
      texto += `
      A classificação encontrada foi atenção.
      Recomenda-se acompanhamento profissional.
      `;
    } else {
      texto += `
      A classificação encontrada foi baixo risco.
      `;
    }

    const relatorio = document.querySelector(".clinical-report");

    if (relatorio) {
      const secoes = relatorio.querySelectorAll(".report-section, .conduta-box");

      secoes.forEach(secao => {
        texto += " ";

        const titulo = secao.querySelector("h4");
        if (titulo) {
          texto += titulo.innerText + ". ";
        }

        const paragrafos = secao.querySelectorAll("p");
        paragrafos.forEach(p => {
          texto += p.innerText + ". ";
        });

        const spans = secao.querySelectorAll(".report-item span");
        spans.forEach(span => {
          texto += span.innerText + ". ";
        });
      });
    }

    texto += `Este resultado possui finalidade educativa e não substitui consulta médica.`;

    this.falar(texto);
  },

  criarBotao() {
    const extra = document.getElementById("professionalExtraContent");
    if (!extra) return;
    if (document.getElementById("btnNarrarLaudo")) return;

    // Definição dos templates de ícones SVG estilizados
    const iconePlay = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>`;

    const iconeStop = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      </svg>`;

    const btn = document.createElement("button");
    btn.id = "btnNarrarLaudo";
    btn.className = "primary-btn";
    
    // Injeta o SVG + Texto inicial
    btn.innerHTML = `${iconePlay} <span>Ouvir Laudo</span>`;
    
    btn.style.margin = "24px 0";
    btn.style.width = "100%";

    btn.onclick = () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        narracaoAtiva = false;
        btn.classList.remove("voice-active");
        btn.innerHTML = `${iconePlay} <span>Ouvir Laudo</span>`;
        return;
      }

      narracaoAtiva = true;
      btn.classList.add("voice-active");
      btn.innerHTML = `${iconeStop} <span>Parar Narração</span>`;
      MedicalVoiceAssistant.narrarLaudo();
    };

    extra.appendChild(btn);
  }
};

function encerrarSistema() {
  speechSynthesis.cancel();
  narracaoAtiva = false;
  location.reload();
}