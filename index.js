/*******************************************************************************
 * =============================================================================
 * 1. CONFIGURAÇÕES GERAIS E ELEMENTOS DO DOM
 * =============================================================================
 ******************************************************************************/

// Dicionário de telas para controle de navegação de Single Page Application (SPA)
const screens = {
  home: document.getElementById('homeScreen'),
  how: document.getElementById('howScreen'),
  mode: document.getElementById('modeScreen'),
  assessment: document.getElementById('assessmentScreen'),
  professional: document.getElementById('professionalScreen'),
  quiz: document.getElementById('quizGeneric'),
  result: document.getElementById('resultGeneric')
};


/*******************************************************************************
 * =============================================================================
 * 2. GERENCIAMENTO DE TELAS E NAVEGAÇÃO
 * =============================================================================
 ******************************************************************************/

/**
 * Oculta todas as telas e exibe apenas a tela solicitada, resetando o scroll.
 * @param {string} name - Chave correspondente à tela no objeto 'screens'
 * */
function showScreen(name) {
  Object.values(screens).forEach(s => s.style.display = 'none');
  screens[name].style.display = 'flex';
  window.scrollTo(0, 0);
}

// Atribuição dos eventos de clique para navegação entre telas
document.getElementById('btnOpenModes').onclick = () => showScreen('mode');
document.getElementById('btnOpenHow').onclick = () => showScreen('how');
document.getElementById('btnBackHomeFromHow').onclick = () => showScreen('home');
document.getElementById('btnBackHomeFromModes').onclick = () => showScreen('home');
document.getElementById('btnOpenAssessment').onclick = () => showScreen('assessment');
document.getElementById('btnOpenProfessional').onclick = () => showScreen('professional');
document.getElementById('btnBackModesFromAssessment').onclick = () => showScreen('mode');
document.getElementById('btnBackModesFromProfessional').onclick = () => showScreen('mode');


/*******************************************************************************
 * =============================================================================
 * 3. MÓDULO PROFISSIONAL (CÁLCULO DE LAUDO CLÍNICO - MÁXIMA FLEXIBILIDADE)
 * =============================================================================
 ******************************************************************************/

/**
 * Processa os dados hemodinâmicos, antropométricos e metabólicos de forma modular.
 * Cada bloco é auto-suficiente e processado de forma isolada ou conjunta.
 * */
document.getElementById('btnCalculateProfessional').onclick = function() {
  // --- CAPTURA DE DADOS: BLOCO A ---
  const pas = parseFloat(document.getElementById('prof_pas').value);
  const pad = parseFloat(document.getElementById('prof_pad').value);
  const fc = parseFloat(document.getElementById('prof_fc').value);
  const peso = parseFloat(document.getElementById('prof_peso').value);
  const circ = parseFloat(document.getElementById('prof_circ').value);
  
  // Tratamento inteligente do input da Altura (Metros ou Centímetros)
  let alturaInput = document.getElementById('prof_altura').value.toLowerCase().replace(",", ".").trim();
  alturaInput = alturaInput.replace("cm", "").replace("m", "").trim();
  let altura = parseFloat(alturaInput);
  if (altura > 3) {
    altura = altura / 100;
  }

  // --- CAPTURA DE DADOS: BLOCO B ---
  const glic = parseFloat(document.getElementById('prof_glic').value);
  const col = parseFloat(document.getElementById('prof_colt').value);
  const hdl = parseFloat(document.getElementById('prof_hdl').value);
  const trig = parseFloat(document.getElementById('prof_trig').value);
  const glicTipo = document.getElementById('prof_glic_tipo').value;

  // --- CAPTURA DE DADOS: BLOCO C ---
  const ureia = parseFloat(document.getElementById('prof_ureia').value);
  const creatinina = parseFloat(document.getElementById('prof_creatinina').value);
  const tgo = parseFloat(document.getElementById('prof_tgo').value);
  const tgp = parseFloat(document.getElementById('prof_tgp').value);
  const gamagt = parseFloat(document.getElementById('prof_gamagt').value);
  const fosfatase = parseFloat(document.getElementById('prof_fosfatase').value);
  const biliDireta = parseFloat(document.getElementById('prof_bili_direta').value);
  const biliTotal = parseFloat(document.getElementById('prof_bili_total').value);
  const sodio = parseFloat(document.getElementById('prof_sodio').value);
  const potassio = parseFloat(document.getElementById('prof_potassio').value);
  const cloro = parseFloat(document.getElementById('prof_cloro').value);
  const bicarbonato = parseFloat(document.getElementById('prof_bicarbonato').value);

  // --- VERIFICAÇÃO DE SINAL EM QUALQUER UM DOS BLOCOS ---
  const temBlocoA = (!isNaN(pas) || !isNaN(pad) || !isNaN(fc) || !isNaN(peso) || !isNaN(altura) || !isNaN(circ));
  const temBlocoB = (!isNaN(glic) || !isNaN(col) || !isNaN(hdl) || !isNaN(trig));
  const temBlocoC = (!isNaN(ureia) || !isNaN(creatinina) || !isNaN(tgo) || !isNaN(tgp) || !isNaN(gamagt) || !isNaN(fosfatase) || !isNaN(biliDireta) || !isNaN(biliTotal) || !isNaN(sodio) || !isNaN(potassio) || !isNaN(cloro) || !isNaN(bicarbonato));

  if (!temBlocoA && !temBlocoB && !temBlocoC) {
    alert("Erro: Insira dados em pelo menos um dos blocos para gerar a avaliação.");
    return;
  }

  // Arrays de acúmulo clínico global
  let hipoteses = [];
  let condutasLista = [];
  let glicHipotese = [];
  let lipHipotese = [];
  let blocoCHipotese = [];

  // ===========================================================================
  // 1. PROCESSAMENTO INTEGRAL DO BLOCO A (CHASSI E HEMODINÂMICA)
  // ===========================================================================
  let htmlBlocoA = `
  <div class="report-section">
    <h4>1. Chassi e Aerodinâmica (Diagnóstico Antropométrico e Hemodinâmico)</h4>
    <p style="color:#ffa500; font-style:italic; padding: 5px 0; margin: 5px 0;">⚠️ Dados não preenchidos para este bloco.</p>
  </div>`;

  if (temBlocoA) {
    let imcVal = "N/A";
    let imcDesc = "Dados insuficientes";
    let imcColor = "#aaa";
    let obHipótese = "";

    if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
      imcVal = (peso / (altura * altura)).toFixed(2);
      if (imcVal < 18.5) {
        imcDesc = "Abaixo do peso";
        imcColor = "#ffa500";
      } else if (imcVal < 25) {
        imcDesc = "Eutrofia (Peso Normal)";
        imcColor = "#00ff7f";
      } else if (imcVal < 30) {
        imcDesc = "Sobrepeso (Pré-obesidade)";
        imcColor = "#ffa500";
      } else if (imcVal < 35) {
        imcDesc = "Obesidade Grau I";
        imcColor = "#ff4d4d";
        obHipótese = "Obesidade Clinical Estabelecida";
      } else if (imcVal < 40) {
        imcDesc = "Obesidade Grau II (Severa)";
        imcColor = "#ff4d4d";
        obHipótese = "Risco Iminente Cardiovascular";
      } else {
        imcDesc = "Obesidade Grau III (Mórbida)";
        imcColor = "#ff4d4d";
        obHipótese = "Quadro Crítico Multissistêmico";
      }
      if (obHipótese) hipoteses.push(obHipótese);
      
      if (imcVal >= 30) {
        condutasLista.push("Considerar abordagem farmacológica para obesidade e acompanhamento nutricional.");
      } else {
        condutasLista.push("Manter Manejo de Estilo de Vida (MEV) para manutenção do peso estável.");
      }
    }

    let paStatus = "Dados de PA incompletos";
    let paColor = "#aaa";
    let paConduta = "Medir PA regularmente para estabelecer padrão.";
    let pp = (!isNaN(pas) && !isNaN(pad)) ? (pas - pad) : 0;

    if (!isNaN(pas) && !isNaN(pad)) {
      if (pas >= 180 || pad >= 110) {
        paStatus = "Hipertensão Estágio 3 (Emergência)";
        paColor = "#ff4d4d";
        paConduta = "Urgência: Terapia anti-hipertensiva endovenosa em ambiente hospitalar.";
      } else if (pas >= 160 || pad >= 100) {
        paStatus = "Hipertensão Estágio 2";
        paColor = "#ff4d4d";
        paConduta = "Terapia medicamentosa combinada sugerida.";
      } else if (pas >= 140 || pad >= 90) {
        paStatus = "Hipertensão Estágio 1";
        paColor = "#ff4d4d";
        paConduta = "Intervenção em estilo de vida e reavaliação em 30 dias.";
      } else if (pas >= 130 || pad >= 85) {
        paStatus = "Pré-Hipertensão";
        paColor = "#ffa500";
        paConduta = "Redução de sódio e monitoramento residencial (MRPA).";
      } else {
        paStatus = "Ótima / Normal";
        paColor = "#00ff7f";
        paConduta = "Manter vigilância anual hemodinâmica.";
      }
      condutasLista.push(paConduta);
      if (pp > 60) hipoteses.push("Enrijecimento de Grandes Artérias");
    }

    let circTexto = "N/A";
    if (!isNaN(circ)) {
      circTexto = `${circ} cm ${circ > 94 ? '(Acima da meta)' : '(Normal)'}`;
    }

    htmlBlocoA = `
      <div class="report-section">
        <h4>1. Chassi e Aerodinâmica (Diagnóstico Antropométrico e Hemodinâmico)</h4>
        <div class="report-item">
          <span>Status IMC:</span>
          <span style="color:${imcColor}">${imcVal !== "N/A" ? imcVal + " - " + imcDesc : imcDesc}</span>
        </div>
        <div class="report-item">
          <span>Circunferência Abdominal:</span>
          <span>${circTexto}</span>
        </div>
        <div class="report-item">
          <span>Relação Altura/Peso:</span>
          <span>${(!isNaN(peso) && !isNaN(altura)) ? (peso / altura).toFixed(1) + " kg/m" : "N/A"}</span>
        </div>
        <div class="report-item">
          <span>Classificação PA:</span>
          <span style="color:${paColor}">${paStatus}</span>
        </div>
        <div class="report-item">
          <span>Pressão Arterial Média (PAM):</span>
          <span>${(!isNaN(pas) && !isNaN(pad)) ? ((pas + 2 * pad) / 3).toFixed(1) + " mmHg" : "N/A"}</span>
        </div>
        <div class="report-item">
          <span>Frequência Cardíaca:</span>
          <span>${!isNaN(fc) ? fc + " bpm" : "N/A"}</span>
        </div>
      </div>`;
  }

  // ===========================================================================
  // 2. PROCESSAMENTO INTEGRAL DO BLOCO B (COMBUSTÍVEL E LUBRIFICANTES)
  // ===========================================================================
  let htmlBlocoB = `
  <div class="report-section">
    <h4>2. Qualidade do Combustível e Lubrificantes (Perfil Glicêmico e Lipídico)</h4>
    <p style="color:#ffa500; font-style:italic; padding: 5px 0; margin: 5px 0;">⚠️ Dados não preenchidos para este bloco.</p>
  </div>`;

  if (temBlocoB) {
    // CORREÇÃO AQUI: Removidas as palavras 'let' para evitar o erro de redeclaração no mesmo escopo
    glicHipotese = [];
    lipHipotese = [];

    let glicStatus = "Não preenchido";
    let glicColor = "#aaa";
    let glicConduta = "";
    let glicReferencia = "N/A";

    if (!isNaN(glic)) {
      if (glicTipo === "jejum") {
        if (glic < 70 && glic > 0) {
          glicStatus = "Hipoglicemia";
          glicColor = "#00bfff";
          glicReferencia = "Jejum Normal: 70 - 99 mg/dL";
          glicHipotese.push("Possível distúrbio glicêmico", "Possível jejum prolongado", "Possível alteração metabólica");
          glicConduta = "Investigar causas metabólicas e monitorar glicemia.";
        } else if (glic >= 70 && glic <= 99) {
          glicStatus = "Normoglicemia em Jejum";
          glicColor = "#00ff7f";
          glicReferencia = "Normal: 70 - 99 mg/dL";
          glicConduta = "Controle glicêmico dentro da normalidade.";
        } else if (glic >= 100 && glic <= 125) {
          glicStatus = "Glicemia de Jejum Alterada (Pré-Diabetes)";
          glicColor = "#ffa500";
          glicReferencia = "Pré-diabetes: 100 - 125 mg/dL";
          glicHipotese.push("Resistência à insulina", "Maior risco cardiovascular", "Maior risco de Diabetes Mellitus");
          glicConduta = "Focar em perda ponderal, atividade física e dieta balanceada.";
        } else if (glic >= 126 && glic < 200) {
          glicStatus = "Hiperglicemia compatível com Diabetes";
          glicColor = "#ff7a00";
          glicReferencia = "Diabetes: ≥ 126 mg/dL";
          glicHipotese.push("Possível Diabetes Mellitus tipo 2", "Hiperglicemia persistente", "Maior risco cardiovascular");
          glicConduta = "Solicitar HbA1c e investigação de complicações microvasculares.";
        } else if (glic >= 200 && glic < 300) {
          glicStatus = "Diabetes Descompensated";
          glicColor = "#ff4d4d";
          glicReferencia = "Hiperglicemia importante: ≥ 200 mg/dL";
          glicHipotese.push("Descontrole glicêmico importante", "Maior risco cardiovascular", "Possível dano vascular");
          glicConduta = "Necessita avaliação médica prioritária.";
        } else {
          glicStatus = "Hiperglicemia Grave";
          glicColor = "#ff0000";
          glicReferencia = "Hiperglicemia severa";
          glicHipotese.push("Possível emergência hiperglicêmica", "Risco de cetoacidose diabética", "Risco de estado hiperosmolar");
          glicConduta = "Encaminhamento hospitalar imediato.";
        }
      } else {
        if (glic < 140) {
          glicStatus = "Glicemia Pós-Prandial Normal";
          glicColor = "#00ff7f";
          glicReferencia = "Normal: abaixo de 140 mg/dL";
          glicConduta = "Resposta adequada da insulina após alimentação.";
        } else if (glic >= 140 && glic <= 199) {
          glicStatus = "Intolerância à Glicose (Pré-Diabetes)";
          glicColor = "#ffa500";
          glicReferencia = "Pré-diabetes: 140 - 199 mg/dL";
          glicHipotese.push("Resistência à insulina", "Alteração glicêmica pós-prandial", "Maior risco cardiovascular");
          glicConduta = "Mudança alimentar, redução de açúcar e atividade física regular.";
        } else if (glic >= 200 && glic < 300) {
          glicStatus = "Diabetes Mellitus Provável";
          glicColor = "#ff7a00";
          glicReferencia = "Diabetes: ≥ 200 mg/dL";
          glicHipotese.push("Hiperglicemia pós-prandial importante", "Possível Diabetes Mellitus", "Deficiência ou resistência à insulina");
          glicConduta = "Solicitar HbA1c e avaliação médica especializada.";
        } else {
          glicStatus = "Hiperglicemia Grave Pós-Prandial";
          glicColor = "#ff0000";
          glicReferencia = "Hiperglicemia severa";
          glicHipotese.push("Possível emergência metabólica", "Risco de descompensação diabética", "Necessidade de avaliação urgente");
          glicConduta = "Encaminhamento hospitalar imediato.";
        }
      }
      if (glicConduta) condutasLista.push(glicConduta);
    }

    let lipStatus = "Perfil Lipídico Estável";
    let lipColor = "#00ff7f";
    let colReferencia = "N/A";
    let trigReferencia = "N/A";
    let ldlDisplay = "N/A";
    let naoHdlDisplay = "N/A";
    let castelliDisplay = "N/A";

    if (!isNaN(col)) {
      if (col < 190) {
        colReferencia = "Desejável: < 190 mg/dL";
      } else if (col >= 190 && col < 240) {
        lipStatus = "Colesterol Elevado";
        lipColor = "#ffa500";
        colReferencia = "Elevado: ≥ 190 mg/dL";
        lipHipotese.push("Risco cardiovascular aumentado");
      } else {
        lipStatus = "Hipercolesterolemia Grave";
        lipColor = "#ff0000";
        colReferencia = "Muito elevado: ≥ 240 mg/dL";
        lipHipotese.push("Risco elevado de aterosclerose");
      }
    }

    if (!isNaN(hdl) && hdl < 40) {
      lipHipotese.push("HDL baixo (baixo fator protetor cardíaco)");
    }

    if (!isNaN(trig)) {
      if (trig < 150) {
        trigReferencia = "Desejável: < 150 mg/dL";
      } else if (trig >= 150 && trig < 200) {
        trigReferencia = "Limítrofe: 150 - 199 mg/dL";
        lipHipotese.push("Triglicerídeos aumentados");
      } else if (trig >= 200 && trig < 500) {
        trigReferencia = "Alto: 200 - 499 mg/dL";
        lipHipotese.push("Hipertrigliceridemia moderada", "Risco aumentado de esteatose hepática");
      } else {
        trigReferencia = "Muito Alto: ≥ 500 mg/dL";
        lipColor = "#ff0000";
        lipHipotese.push("Risco aumentado de pancreatite", "Dislipidemia grave");
      }
    }

    if (!isNaN(col) && !isNaN(hdl) && !isNaN(trig)) {
      const castelli = col / hdl;
      const ldlEstimado = col - hdl - (trig / 5);
      const naoHDL = col - hdl;

      ldlDisplay = ldlEstimado.toFixed(1) + " mg/dL";
      naoHdlDisplay = naoHDL.toFixed(1) + " mg/dL";
      castelliDisplay = castelli.toFixed(2);

      if (ldlEstimado >= 190) { lipHipotese.push("Possível hipercolesterolemia familiar"); }
      else if (ldlEstimado >= 160) { lipHipotese.push("LDL muito elevado"); }
      else if (ldlEstimado >= 130) { lipHipotese.push("LDL elevado"); }
      else if (ldlEstimado >= 115) { lipHipotese.push("LDL discretamente aumentado"); }
      else if (ldlEstimado >= 100) { lipHipotese.push("LDL aceitável apenas para baixo risco cardiovascular"); }
      else if (ldlEstimado >= 70) { lipHipotese.push("LDL dentro da meta para risco intermediário"); }
      else if (ldlEstimado >= 50) { lipHipotese.push("LDL dentro da meta para alto risco cardiovascular"); }
      else { lipHipotese.push("LDL em meta ideal"); }

      if (castelli > 5) { lipHipotese.push("Alto índice aterogênico"); }
      else if (castelli > 4.5) { lipHipotese.push("Risco cardiovascular moderado"); }
    }

    if (!isNaN(col) || !isNaN(hdl) || !isNaN(trig)) {
      lipConduta = "Controle alimentar, atividade física e acompanhamento clínico das taxas lipídicas.";
      condutasLista.push(lipConduta);
    }

    if (temBlocoA && !isNaN(pas) && !isNaN(glic) && !isNaN(circ)) {
      if (pas >= 130 && glic >= 100 && circ >= 94) {
        hipoteses.push("Alta Probabilidade de Síndrome Metabólica");
      }
    }
    
    if (!isNaN(trig) && !isNaN(col) && !isNaN(hdl)) {
      const ldlEst = col - hdl - (trig / 5);
      if (trig > 150 && ldlEst > 130) {
        hipoteses.push("Risco Coronariano Aumentado");
      }
    }
    if (!isNaN(circ) && circ > 102) {
      hipoteses.push("Risco Elevado de Esteatose Hepática (Gordura no Fígado)");
    }

    hipoteses = [...hipoteses, ...glicHipotese, ...lipHipotese];

    htmlBlocoB = `
      <div class="report-section">
        <h4>2. Qualidade do Combustível e Lubrificantes (Perfil Glicêmico e Lipídico)</h4>
        <div class="report-item">
          <span>Controle Glicêmico:</span>
          <span style="color:${glicColor}">${glicStatus}</span>
        </div>
        <div class="report-item">
          <span>Glicemia:</span>
          <span>${!isNaN(glic) ? glic + " mg/dL" : "N/A"}</span>
        </div>
        <div class="report-item">
          <span>Valor de Referência Glicemia:</span>
          <span>${glicReferencia}</span>
        </div>
        <div class="report-item">
          <span>Status Lipídico:</span>
          <span style="color:${lipColor}">${lipStatus}</span>
        </div>
        <div class="report-item">
          <span>LDL Estimado:</span>
          <span>${ldlDisplay}</span>
        </div>
        <div class="report-item">
          <span>Não-HDL:</span>
          <span>${naoHdlDisplay}</span>
        </div>
        <div class="report-item">
          <span>Índice Castelli I:</span>
          <span>${castelliDisplay}</span>
        </div>
        <div class="report-item">
          <span>Referência Colesterol:</span>
          <span>${colReferencia}</span>
        </div>
        <div class="report-item">
          <span>Referência Triglicerídeos:</span>
          <span>${trigReferencia}</span>
        </div>
      </div>`;
  }

  // ===========================================================================
  // 3. PROCESSAMENTO INTEGRAL DO BLOCO C (FILTROS, USINA E FIAÇÃO)
  // ===========================================================================
  let htmlBlocoC = `
  <div class="report-section">
    <h4>3. Função renal, hepática e eletrolítica (Laboratório Avançado)</h4>
    <p style="color:#ffa500; font-style:italic; padding: 5px 0; margin: 5px 0;">⚠️ Dados não preenchidos para este bloco.</p>
  </div>`;

  if (temBlocoC) {
    // CORREÇÃO AQUI: Removido o 'let' porque 'blocoCHipotese' já foi declarado no topo da função
    blocoCHipotese = [];

    let renalStatus = "Preservada";
    let renalColor = "#00ff7f";
    let hepaticaStatus = "Íntegra";
    let hepaticaColor = "#00ff7f";
    let eletroliticoStatus = "Estável";
    let eletroliticoColor = "#00ff7f";

    const albumina = parseFloat(document.getElementById('prof_albumina')?.value || NaN);
    const tp = parseFloat(document.getElementById('prof_tp')?.value || NaN);
    const acidoUrico = parseFloat(document.getElementById('prof_acidourico')?.value || NaN);

    // --- 3.1. FUNÇÃO RENAL ---
    if (!isNaN(creatinina) || !isNaN(ureia) || !isNaN(acidoUrico)) {
      if (!isNaN(creatinina)) {
        if (creatinina > 4.0) {
          renalStatus = "Crítica (Uremia Iminente / Insuficiência Renal Aguda)";
          renalColor = "#ff0000";
          blocoCHipotese.push("Insuficiência Renal Grave (Creatinina > 4 mg/dL) | Alto Risco de Síndrome Urêmica Crítica");
          condutasLista.push("Urgência Médica: Encaminhamento hospitalar imediato para avaliação de necessidade dialítica.");
        } else if (creatinina >= 1.5 && creatinina <= 4.0) {
          renalStatus = "Insuficiência Moderada a Avançada";
          renalColor = "#ff4d4d";
          blocoCHipotese.push("Dano Renal de Moderado a Severo (Padrão compatível com TFG entre 15 e 59 mL/min)");
          condutasLista.push("Encaminhar ao Nefrologista: Triagem detalhada para Doença Renal Crônica (DRC Estágio 3 ou 4) e ajuste de fármacos.");
        } else if (creatinina > 1.2 && creatinina < 1.5) {
          renalStatus = "Disfunção Renal Inicial / Leve";
          renalColor = "#ffa500";
          blocoCHipotese.push("Perda Inicial de Função Filtrante Renal / Insuficiência Pré-Renal Leve");
          condutasLista.push("Solicitar Taxa de Filtração Glomerular (TFG) estimada por Cistatina C ou CKD-EPI, além de microalbuminúria isolada.");
        } else if (creatinina < 0.6 && creatinina > 0) {
          renalStatus = "Creatinina Sérica Reduzida";
          renalColor = "#00bfff";
          blocoCHipotese.push("Creatinina Baixa: Compatível com Sarcopenia, Desnutrição Crônica ou Severa Redução de Massa Muscular");
        }
      }

      if (!isNaN(ureia)) {
        if (ureia > 100) {
          blocoCHipotese.push("Retenção Grave de Resíduos Nitrogenados");
          if (renalColor !== "#ff0000") { renalStatus = "Ureia Severamente Elevada"; renalColor = "#ff4d4d"; }
        } else if (ureia > 50) {
          blocoCHipotese.push("Elevação de Ureia (Sugestivo de Desidratação, Estado Hipercatabólico ou Alto Consumo Proteico)");
          if (renalStatus === "Preservada") { renalStatus = "Ureia Limítrofe / Elevada"; renalColor = "#ffa500"; }
        } else if (ureia < 10 && ureia > 0) {
          blocoCHipotese.push("Ureia Reduzida: Associada a Dietas Hipoproteicas Estritas ou Insuficiência Hepática Grave");
        }
      }

      if (!isNaN(ureia) && !isNaN(creatinina) && creatinina > 0) {
        let razaoUC = ureia / creatinina;
        if (razaoUC > 40) {
          blocoCHipotese.push("Padrão de Azotemia Pré-Renal Ativa (Alta suspeita de Hipoperfusão por Desidratação ou Sangramento)");
          condutasLista.push("Otimizar balanço hídrico: Avaliar resposta hemodinâmica e hidratação direcionada.");
        } else if (razaoUC >= 10 && razaoUC <= 20 && creatinina > 1.2) {
          blocoCHipotese.push("Padrão de Injúria Renal Intrínseca (Dano de parênquima renal estabelecido)");
        }
      }

      if (!isNaN(acidoUrico) && acidoUrico > 7.2) {
        blocoCHipotese.push("Hiperuricemia Ativa (Risco associado a Gota, Nefropatia por Urato ou Co-fator de Risco Cardiovascular)");
      }
    } else {
      renalStatus = "Não preenchido";
      renalColor = "#aaa";
    }

    // --- 3.2. FUNÇÃO HEPÁTICA ---
    if (!isNaN(tgo) || !isNaN(tgp) || !isNaN(gamagt) || !isNaN(fosfatase) || !isNaN(biliTotal) || !isNaN(biliDireta)) {
      if (!isNaN(tgo) || !isNaN(tgp)) {
        let maxEnz = Math.max(tgo || 0, tgp || 0);
        if (maxEnz > 400) {
          hepaticaStatus = "Crítica (Hepatite Fulminante / Necrose Hepática Severa)";
          hepaticaColor = "#ff0000";
          blocoCHipotese.push("Lesão Hepatocelular Aguda Grave | Alta suspeita de Hepatite Viral Crítica, Tóxica ou Isquêmica");
          condutasLista.push("Urgência Clinical: Internação e triagem urgente de coagulograma (TP/INR) e risco de encefalopatia.");
        } else if (maxEnz >= 100 && maxEnz <= 400) {
          hepaticaStatus = "Insuficiência Moderada / Hepatopatia Ativa";
          hepaticaColor = "#ff4d4d";
          blocoCHipotese.push("Hepatite Aguda Moderada / Lesão Hepática Induzida por Drogas (DILI) ou Álcool");
          condutasLista.push("Afastar imediatamente potenciais agentes hepatotóxicos, fitoterápicos não prescritos e bebidas alcoólicas.");
        } else if (tgo > 40 || tgp > 56) {
          hepaticaStatus = "Alteração Enzimática Leve";
          hepaticaColor = "#ffa500";
          blocoCHipotese.push("Estresse Hepático Inicial (Compatível com Esteatose Hepática / Infiltração Gordurosa Difusa)");
          condutasLista.push("Sugerir Ultrassonografia de Abdome Superior para rastreamento de Gordura no Fígado.");
        }
      }

      if (!isNaN(gamagt) || !isNaN(fosfatase)) {
        if (gamagt > 150 || (fosfatase > 147 && !isNaN(gamagt) && gamagt > 61)) {
          blocoCHipotese.push("Padrão de Colestase Grave / Suspeita de Obstrução de Vias Biliares ou Cirrose Biliar");
          if (hepaticaColor !== "#ff0000") { hepaticaStatus = "Síndrome Colestática Ativa"; hepaticaColor = "#ff4d4d"; }
        } else if (gamagt > 61 || fosfatase > 147) {
          blocoCHipotese.push("Elevação Isolada de Enzimas Canaliculares (Indução por medicamentos, álcool ou obstrução parcial inicial)");
          if (hepaticaStatus === "Íntegra") { hepaticaStatus = "Alerta de Vias Biliares"; hepaticaColor = "#ffa500"; }
        }
      }

      if (!isNaN(biliTotal)) {
        if (biliTotal > 5.0) {
          blocoCHipotese.push("Hiperbilirrubinemia Crítica (Icterícia Manifesta de Alto Risco Clínico)");
        } else if (biliTotal > 1.2) {
          if (!isNaN(biliDireta) && biliDireta > 0.3) {
            blocoCHipotese.push("Predomínio Conjugado (Direto): Reforça quadro de Obstrução Biliar, Lesão Hepática ou Colestase");
          } else {
            let biliIndireta = biliTotal - (biliDireta || 0);
            if (biliIndireta > 0.9) {
              blocoCHipotese.push("Predomínio Não Conjugado (Indireto): Considerar investigação de Processos Hemolíticos ou Síndrome de Gilbert");
            }
          }
        }
      }

      if (!isNaN(albumina) && albumina < 3.5 && !isNaN(tp) && tp > 14) {
        blocoCHipotese.push("Déficit de Síntese Proteica Hepática (Sinal compatível com Insuficiência Hepática Crônica Avançada / Cirrose)");
      }
    } else {
      hepaticaStatus = "Não preenchido";
      hepaticaColor = "#aaa";
    }

    // --- 3.3. ESTABILIDADE ELETROLÍTICA ---
    if (!isNaN(sodio) || !isNaN(potassio) || !isNaN(cloro) || !isNaN(bicarbonato)) {
      if (!isNaN(potassio)) {
        if (potassio < 3.5) {
          eletroliticoStatus = "Instabilidade Crítica (Hipocalemia)";
          eletroliticoColor = "#ff0000";
          blocoCHipotese.push("Hipocalemia Severa (Alto risco de Arritmias Ventriculares e bloqueios de condução elétrica)");
          condutasLista.push("Ação Imediata: Monitoramento eletrocardiográfico (ECG) e reposição monitorada de potássio.");
        } else if (potassio > 5.1) {
          eletroliticoStatus = "Instabilidade Crítica (Hipercalemia)";
          eletroliticoColor = "#ff0000";
          blocoCHipotese.push("Hipercalemia Severa (Risco Iminente de Parada Cardíaca por Fibrilação ou Bloqueio)");
          condutasLista.push("Ação Imediata: Protocolo de proteção miocárdica (Ex: Gluconato de Cálcio) e medidas de mudança shift celular.");
        }
      }

      if (!isNaN(sodio)) {
        if (sodio < 135) {
          if (eletroliticoColor !== "#ff0000") { eletroliticoStatus = "Hiponatremia"; eletroliticoColor = "#ffa500"; }
          blocoCHipotese.push("Hiponatremia Detectada (Sinal de Intoxicação por Água, Excesso Hídrico Relativo ou Perda Soluta)");
        } else if (sodio > 145) {
          if (eletroliticoColor !== "#ff0000") { eletroliticoStatus = "Hipernatremia"; eletroliticoColor = "#ffa500"; }
          blocoCHipotese.push("Hipernatremia Detectada (Sinal Clínico de Desidratação Celular Severa ou Sobrecarga de Sódio)");
        }
      }

      if (!isNaN(bicarbonato)) {
        if (bicarbonato < 22) {
          blocoCHipotese.push("Nível de Bicarbonato Reduzido (Janela indicativa de Acidose Metabólica em curso)");
        } else if (bicarbonato > 26) {
          blocoCHipotese.push("Nível de Bicarbonato Elevado (Janela indicativa de Alcalose Metabólica em curso)");
        }
      }
    } else {
      eletroliticoStatus = "Não preenchido";
      eletroliticoColor = "#aaa";
    }

    // Mesclar hipóteses calculadas com segurança
    hipoteses = [...hipoteses, ...blocoCHipotese];

    htmlBlocoC = `
      <div class="report-section">
        <h4>3. Função renal, hepática e eletrolítica (Laboratório Avançado)</h4>
        
        <div class="report-item">
          <span>Função Renal:</span>
          <span style="color:${renalColor}; font-weight:bold;">${renalStatus}</span>
        </div>
        <div class="report-item" style="font-size:0.85rem; padding-left:15px; color:#aaa;">
          <span>Ureia: ${!isNaN(ureia) ? ureia + " mg/dL" : "N/A"} | Creatinina: ${!isNaN(creatinina) ? creatinina + " mg/dL" : "N/A"} ${!isNaN(acidoUrico) ? "| Ácido Úrico: " + acidoUrico + " mg/dL" : ""}</span>
        </div>
        
        <div class="report-item" style="margin-top:10px;">
          <span>Função Hepática:</span>
          <span style="color:${hepaticaColor}; font-weight:bold;">${hepaticaStatus}</span>
        </div>
        <div class="report-item" style="font-size:0.85rem; padding-left:15px; color:#aaa;">
          <span>TGO (AST): ${!isNaN(tgo) ? tgo + " U/L" : "N/A"} | TGP (ALT): ${!isNaN(tgp) ? tgp + " U/L" : "N/A"} | G-GT: ${!isNaN(gamagt) ? gamagt + " U/L" : "N/A"} | FA: ${!isNaN(fosfatase) ? fosfatase + " U/L" : "N/A"}</span>
        </div>
        <div class="report-item" style="font-size:0.82rem; padding-left:15px; color:#888;">
          <span>Bilirrubina Total: ${!isNaN(biliTotal) ? biliTotal + " mg/dL" : "N/A"} (Direta: ${!isNaN(biliDireta) ? biliDireta + " mg/dL" : "N/A"})</span>
        </div>

        <div class="report-item" style="margin-top:10px;">
          <span>Estabilidade Eletrolítica:</span>
          <span style="color:${eletroliticoColor}; font-weight:bold;">${eletroliticoStatus}</span>
        </div>
        <div class="report-item" style="font-size:0.85rem; padding-left:15px; color:#aaa;">
          <span>Sódio: ${!isNaN(sodio) ? sodio + " mEq/L" : "N/A"} | Potássio: ${!isNaN(potassio) ? potassio + " mEq/L" : "N/A"} ${!isNaN(bicarbonato) ? "| Bicarbonato: " + bicarbonato + " mEq/L" : ""}</span>
        </div>
          
        <div style="font-size:0.65rem; color:#666; margin-top:5px; text-align:right;">Ref: KDIGO (2024) | Manual MSD | SBPL / RBAC</div>
      </div>`;
  }

  // --- FILTRAGEM DE CONDUTAS E HIPÓTESES REDUNDANTES ---
  hipoteses = [...new Set(hipoteses)].filter(h => h.trim() !== "");
  condutasLista = [...new Set(condutasLista)].filter(c => c.trim() !== "");

  // --- ALTERAÇÃO DE TELA E MONTAGEM DO LAUDO COMPILADO ---
  showScreen('result');
  document.getElementById('resultStatus').innerText = "ESTIMATIVA DE LAUDO CLÍNICO INTEGRAL";

  const extra = document.getElementById('professionalExtraContent');
  extra.innerHTML = `
    <div class="clinical-report">
      ${htmlBlocoA}
      ${htmlBlocoB}
      ${htmlBlocoC}

      <div class="report-section">
        <h4>4. Possíveis Doenças e Hipóteses Clínicas Ativas</h4>
        <p style="color:#ffa500; font-weight:bold; line-height:1.7; margin-top:5px;">
          ${hipoteses.length > 0 ? hipoteses.join(' | ') : 'Nenhuma alteração patológica gerada com as informações inseridas até o momento.'}
        </p>
      </div>

      <div class="conduta-box">
        <h4 style="color:#fff;">Sugestão de Conduta e Otimização do Sistema:</h4>
        <ul style="padding-left:15px; margin-top:5px; font-size:0.9rem; line-height:1.7;">
          ${condutasLista.length > 0 ? condutasLista.map(cond => `<li>${cond}</li>`).join('') : '<li>Sem condutas específicas direcionadas. Insira dados parciais ou totais nos blocos.</li>'}
        </ul>
      </div>
    </div>
  `;
};
