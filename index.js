
    const screens = {
      home: document.getElementById('homeScreen'),
      how: document.getElementById('howScreen'),
      mode: document.getElementById('modeScreen'),
      assessment: document.getElementById('assessmentScreen'),
      professional: document.getElementById('professionalScreen'),
      quiz: document.getElementById('quizGeneric'),
      result: document.getElementById('resultGeneric')
    };

    function showScreen(name) {
      Object.values(screens).forEach(s => s.style.display = 'none');
      screens[name].style.display = 'flex';
      window.scrollTo(0, 0);
    }

    document.getElementById('btnOpenModes').onclick = () => showScreen('mode');
    document.getElementById('btnOpenHow').onclick = () => showScreen('how');
    document.getElementById('btnBackHomeFromHow').onclick = () => showScreen('home');
    document.getElementById('btnBackHomeFromModes').onclick = () => showScreen('home');
    document.getElementById('btnOpenAssessment').onclick = () => showScreen('assessment');
    document.getElementById('btnOpenProfessional').onclick = () => showScreen('professional');
    document.getElementById('btnBackModesFromAssessment').onclick = () => showScreen('mode');
    document.getElementById('btnBackModesFromProfessional').onclick = () => showScreen('mode');

    document.getElementById('btnCalculateProfessional').onclick = function() {

        const pas = parseFloat(document.getElementById('prof_pas').value);
        const pad = parseFloat(document.getElementById('prof_pad').value);
        const fc = parseFloat(document.getElementById('prof_fc').value);
        const peso = parseFloat(document.getElementById('prof_peso').value);
        const altura = parseFloat(document.getElementById('prof_altura').value);
        const glic = parseFloat(document.getElementById('prof_glic').value);
        const col = parseFloat(document.getElementById('prof_colt').value);
        const hdl = parseFloat(document.getElementById('prof_hdl').value);
        const trig = parseFloat(document.getElementById('prof_trig').value);
        const circ = parseFloat(document.getElementById('prof_circ').value);

        if(!pas || !pad || !peso || !altura) {
            alert("Erro: Dados hemodinâmicos e antropométricos são obrigatórios.");
            return;
        }

        // =====================================================
        // CALIBRAÇÃO DE OBESIDADE E ANTROPOMETRIA
        // =====================================================

        const imcVal = (peso / (altura * altura)).toFixed(2);

        let imcDesc = "",
            imcColor = "#00ff7f",
            obHipótese = "";

        if(imcVal < 18.5) {
            imcDesc = "Abaixo do peso";
            imcColor = "#ffa500";
        }

        else if(imcVal < 25) {
            imcDesc = "Eutrofia (Peso Normal)";
        }

        else if(imcVal < 30) {
            imcDesc = "Sobrepeso (Pré-obesidade)";
            imcColor = "#ffa500";
        }

        else if(imcVal < 35) {
            imcDesc = "Obesidade Grau I";
            imcColor = "#ff4d4d";
            obHipótese = "Obesidade Clínica Estabelecida";
        }

        else if(imcVal < 40) {
            imcDesc = "Obesidade Grau II (Severa)";
            imcColor = "#ff4d4d";
            obHipótese = "Risco Iminente Cardiovascular";
        }

        else {
            imcDesc = "Obesidade Grau III (Mórbida)";
            imcColor = "#ff4d4d";
            obHipótese = "Quadro Crítico Multissistêmico";
        }

        // =====================================================
        // CALIBRAÇÃO HEMODINÂMICA (SBC)
        // =====================================================

        let paStatus = "",
            paColor = "#00ff7f",
            paConduta = "";

        let pp = pas - pad;

        if(pas >= 180 || pad >= 110) {

            paStatus = "Hipertensão Estágio 3 (Emergência)";
            paColor = "#ff4d4d";

            paConduta =
            "Urgência: Terapia anti-hipertensiva endovenosa em ambiente hospitalar.";

        }

        else if(pas >= 160 || pad >= 100) {

            paStatus = "Hipertensão Estágio 2";
            paColor = "#ff4d4d";

            paConduta =
            "Terapia medicamentosa combinada sugerida.";

        }

        else if(pas >= 140 || pad >= 90) {

            paStatus = "Hipertensão Estágio 1";
            paColor = "#ff4d4d";

            paConduta =
            "Intervenção em estilo de vida e reavaliação em 30 dias.";

        }

        else if(pas >= 130 || pad >= 85) {

            paStatus = "Pré-Hipertensão";
            paColor = "#ffa500";

            paConduta =
            "Redução de sódio e monitoramento residencial.";

        }

        else {

            paStatus = "Ótima / Normal";

            paConduta =
            "Manter vigilância anual.";

        }

         // =====================================================
 // CALIBRAÇÃO METABÓLICA (SBD)
 // =====================================================

 let glicStatus="Normoglicemia";
 let glicColor="#00ff7f";
 let glicConduta="";

 let glicReferencia="";
 let glicHipotese=[];

 const glicTipo=document.getElementById('prof_glic_tipo').value;

 // =====================================================
 // GLICEMIA EM JEJUM
 // =====================================================

 if(glicTipo==="jejum"){

    // REFERÊNCIAS:
    // Normal: 70 - 99
    // Pré-diabetes: 100 - 125
    // Diabetes: >= 126

    if(glic<70&&glic>0){

        glicStatus="Hipoglicemia";
        glicColor="#00bfff";

        glicReferencia=
        "Jejum Normal: 70 - 99 mg/dL";

        glicHipotese.push(
            "Possível distúrbio glicêmico"
        );

        glicHipotese.push(
            "Possível jejum prolongado"
        );

        glicHipotese.push(
            "Possível alteração metabólica"
        );

        glicConduta=
        "Investigar causas metabólicas e monitorar glicemia.";

    }

    else if(glic>=70&&glic<=99){

        glicStatus="Normoglicemia em Jejum";
        glicColor="#00ff7f";

        glicReferencia=
        "Normal: 70 - 99 mg/dL";

        glicConduta=
        "Controle glicêmico dentro da normalidade.";

    }

    else if(glic>=100&&glic<=125){

        glicStatus=
        "Glicemia de Jejum Alterada (Pré-Diabetes)";

        glicColor="#ffa500";

        glicReferencia=
        "Pré-diabetes: 100 - 125 mg/dL";

        glicHipotese.push(
            "Resistência à insulina"
        );

        glicHipotese.push(
            "Maior risco cardiovascular"
        );

        glicHipotese.push(
            "Maior risco de Diabetes Mellitus"
        );

        glicConduta=
        "Focar em perda ponderal, atividade física e dieta balanceada.";

    }

    else if(glic>=126&&glic<200){

        glicStatus=
        "Hiperglicemia compatível com Diabetes";

        glicColor="#ff7a00";

        glicReferencia=
        "Diabetes: ≥ 126 mg/dL";

        glicHipotese.push(
            "Possível Diabetes Mellitus tipo 2"
        );

        glicHipotese.push(
            "Hiperglicemia persistente"
        );

        glicHipotese.push(
            "Maior risco cardiovascular"
        );

        glicConduta=
        "Solicitar HbA1c e investigação de complicações microvasculares.";

    }

    else if(glic>=200&&glic<300){

        glicStatus=
        "Diabetes Descompensado";

        glicColor="#ff4d4d";

        glicReferencia=
        "Hiperglicemia importante: ≥ 200 mg/dL";

        glicHipotese.push(
            "Descontrole glicêmico importante"
        );

        glicHipotese.push(
            "Maior risco cardiovascular"
        );

        glicHipotese.push(
            "Possível dano vascular"
        );

        glicConduta=
        "Necessita avaliação médica prioritária.";

    }

    else{

        glicStatus=
        "Hiperglicemia Grave";

        glicColor="#ff0000";

        glicReferencia=
        "Hiperglicemia severa";

        glicHipotese.push(
            "Possível emergência hiperglicêmica"
        );

        glicHipotese.push(
            "Risco de cetoacidose diabética"
        );

        glicHipotese.push(
            "Risco de estado hiperosmolar"
        );

        glicConduta=
        "Encaminhamento hospitalar imediato.";

    }

 }

 // =====================================================
 // GLICEMIA PÓS-PRANDIAL / SEM JEJUM
 // =====================================================

 else{

    // REFERÊNCIAS:
    // Normal: < 140
    // Pré-diabetes: 140 - 199
    // Diabetes: >= 200

    if(glic<140){

        glicStatus=
        "Glicemia Pós-Prandial Normal";

        glicColor="#00ff7f";

        glicReferencia=
        "Normal: abaixo de 140 mg/dL";

        glicConduta=
        "Resposta adequada da insulina após alimentação.";

    }

    else if(glic>=140&&glic<=199){

        glicStatus=
        "Intolerância à Glicose (Pré-Diabetes)";

        glicColor="#ffa500";

        glicReferencia=
        "Pré-diabetes: 140 - 199 mg/dL";

        glicHipotese.push(
            "Resistência à insulina"
        );

        glicHipotese.push(
            "Alteração glicêmica pós-prandial"
        );

        glicHipotese.push(
            "Maior risco cardiovascular"
        );

        glicConduta=
        "Mudança alimentar, redução de açúcar e atividade física regular.";

    }

    else if(glic>=200&&glic<300){

        glicStatus=
        "Diabetes Mellitus Provável";

        glicColor="#ff7a00";

        glicReferencia=
        "Diabetes: ≥ 200 mg/dL";

        glicHipotese.push(
            "Hiperglicemia pós-prandial importante"
        );

        glicHipotese.push(
            "Possível Diabetes Mellitus"
        );

        glicHipotese.push(
            "Deficiência ou resistência à insulina"
        );

        glicConduta=
        "Solicitar HbA1c e avaliação médica especializada.";

    }

    else{

        glicStatus=
        "Hiperglicemia Grave Pós-Prandial";

        glicColor="#ff0000";

        glicReferencia=
        "Hiperglicemia severa";

        glicHipotese.push(
            "Possível emergência metabólica"
        );

        glicHipotese.push(
            "Risco de descompensação diabética"
        );

        glicHipotese.push(
            "Necessidade de avaliação urgente"
        );

        glicConduta=
        "Encaminhamento hospitalar imediato.";

    }

 }

        // =====================================================
        // PERFIL LIPÍDICO (SBC)
        // =====================================================

        const castelli = col / hdl;

        const ldlEstimado =
        col - hdl - (trig / 5);

        const naoHDL =
        col - hdl;

        let lipStatus =
        "Perfil Lipídico Estável";

        let lipColor =
        "#00ff7f";

        let lipHipotese = [];

        let lipConduta =
        "";

        let colReferencia =
        "";

        let trigReferencia =
        "";

        // =====================================================
        // COLESTEROL TOTAL
        // =====================================================

        if(col < 190) {

            colReferencia =
            "Desejável: < 190 mg/dL";

        }

        else if(col >= 190 && col < 240) {

            lipStatus =
            "Colesterol Elevado";

            lipColor =
            "#ffa500";

            colReferencia =
            "Elevado: ≥ 190 mg/dL";

            lipHipotese.push(
                "Risco cardiovascular aumentado"
            );

        }

        else {

            lipStatus =
            "Hipercolesterolemia Grave";

            lipColor =
            "#ff0000";

            colReferencia =
            "Muito elevado: ≥ 240 mg/dL";

            lipHipotese.push(
                "Risco elevado de aterosclerose"
            );

        }

        // =====================================================
        // HDL
        // =====================================================

        if(hdl < 40) {

            lipHipotese.push(
                "HDL baixo (baixo fator protetor cardíaco)"
            );

        }

        // =====================================================
        // LDL
        // =====================================================

        if(ldlEstimado >= 190) {

            lipHipotese.push(
                "Possível hipercolesterolemia familiar"
            );

        }

        else if(ldlEstimado >= 160) {

            lipHipotese.push(
                "LDL muito elevado"
            );

        }

        else if(ldlEstimado >= 130) {

            lipHipotese.push(
                "LDL elevado"
            );

        }

        // =====================================================
        // NÃO-HDL
        // =====================================================

        if(naoHDL >= 160) {

            lipHipotese.push(
                "Excesso de lipoproteínas aterogênicas"
            );

        }

        // =====================================================
        // TRIGLICERÍDEOS
        // =====================================================

        if(trig < 150) {

            trigReferencia =
            "Desejável: < 150 mg/dL";

        }

        else if(trig >= 150 && trig < 200) {

            trigReferencia =
            "Limítrofe: 150 - 199 mg/dL";

            lipHipotese.push(
                "Triglicerídeos aumentados"
            );

        }

        else if(trig >= 200 && trig < 500) {

            trigReferencia =
            "Alto: 200 - 499 mg/dL";

            lipHipotese.push(
                "Hipertrigliceridemia moderada"
            );

            lipHipotese.push(
                "Risco aumentado de esteatose hepática"
            );

        }

        else {

            trigReferencia =
            "Muito Alto: ≥ 500 mg/dL";

            lipColor =
            "#ff0000";

            lipHipotese.push(
                "Risco aumentado de pancreatite"
            );

            lipHipotese.push(
                "Dislipidemia grave"
            );

        }

        // =====================================================
        // ÍNDICE CASTELLI
        // =====================================================

        if(castelli > 5) {

            lipHipotese.push(
                "Alto índice aterogênico"
            );

        }

        else if(castelli > 4.5) {

            lipHipotese.push(
                "Risco cardiovascular moderado"
            );

        }

        lipConduta =
        "Controle alimentar, atividade física e acompanhamento clínico.";

        // =====================================================
        // HIPÓTESES E DOENÇAS
        // =====================================================

        let hipoteses = [];

        if(obHipótese)
        hipoteses.push(obHipótese);

        if(
            pas >= 130 &&
            glic >= 100 &&
            circ >= 94
        ) {

            hipoteses.push(
                "Alta Probabilidade de Síndrome Metabólica"
            );

        }

        if(
            trig > 150 &&
            ldlEstimado > 130
        ) {

            hipoteses.push(
                "Risco Coronariano Aumentado"
            );

        }

        if(pp > 60) {

            hipoteses.push(
                "Enrijecimento de Grandes Artérias"
            );

        }

        if(circ > 102) {

            hipoteses.push(
                "Risco Elevado de Esteatose Hepática (Gordura no Fígado)"
            );

        }

        hipoteses = [
            ...hipoteses,
            ...glicHipotese,
            ...lipHipotese
        ];

        hipoteses =
        [...new Set(hipoteses)];

        // =====================================================
        // RESULTADO
        // =====================================================

        showScreen('result');

        document.getElementById('resultStatus').innerText =
        "LAUDO CLÍNICO CALIBRADO";

        const extra =
        document.getElementById('professionalExtraContent');

        extra.innerHTML = `

            <div class="clinical-report">

                <div class="report-section">

                    <h4>
                        1. Diagnóstico Antropométrico (Obesidade)
                    </h4>

                    <div class="report-item">
                        <span>Status IMC:</span>

                        <span style="color:${imcColor}">
                            ${imcVal} - ${imcDesc}
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Circunferência Abdominal:</span>

                        <span>
                            ${circ || 'N/A'} cm
                            ${circ > 94
                            ? '(Acima da meta)'
                            : '(Normal)'}
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Relação Altura/Peso:</span>

                        <span>
                            ${(peso/altura).toFixed(1)} kg/m
                        </span>
                    </div>

                </div>

                <div class="report-section">

                    <h4>
                        2. Estadiamento Hemodinâmico Calibrado
                    </h4>

                    <div class="report-item">
                        <span>Classificação PA:</span>

                        <span style="color:${paColor}">
                            ${paStatus}
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Pressão Arterial Média (PAM):</span>

                        <span>
                            ${((pas + 2*pad)/3).toFixed(1)} mmHg
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Frequência Cardíaca:</span>

                        <span>${fc} bpm</span>
                    </div>

                </div>

                <div class="report-section">

                    <h4>
                        3. Perfil Metabólico e Glicêmico
                    </h4>

                    <div class="report-item">
                        <span>Controle Glicêmico:</span>

                        <span style="color:${glicColor}">
                            ${glicStatus}
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Glicemia:</span>

                        <span>
                            ${glic || 'N/A'} mg/dL
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Valor de Referência:</span>

                        <span>
                            ${glicReferencia}
                        </span>
                    </div>

                </div>

                <div class="report-section">

                    <h4>
                        4. Perfil Lipídico
                    </h4>

                    <div class="report-item">
                        <span>Status Lipídico:</span>

                        <span style="color:${lipColor}">
                            ${lipStatus}
                        </span>
                    </div>

                    <div class="report-item">
                        <span>LDL Estimado:</span>

                        <span>
                            ${ldlEstimado.toFixed(1)} mg/dL
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Não-HDL:</span>

                        <span style="color:${naoHDL > 130 ? '#ff4d4d' : '#00ff7f'}">
                            ${naoHDL.toFixed(1)} mg/dL
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Índice Castelli I:</span>

                        <span>
                            ${castelli.toFixed(2)}
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Referência Colesterol:</span>

                        <span>
                            ${colReferencia}
                        </span>
                    </div>

                    <div class="report-item">
                        <span>Referência Triglicerídeos:</span>

                        <span>
                            ${trigReferencia}
                        </span>
                    </div>

                </div>

                <div class="report-section">

                    <h4>
                        5. Possíveis Doenças e Hipóteses Clínicas
                    </h4>

                    <p style="
                        color:#ffa500;
                        font-weight:bold;
                        line-height:1.7;
                    ">

                        ${hipoteses.length > 0
                        ? hipoteses.join(' | ')
                        : 'Nenhuma alteração patológica evidente detectada.'}

                    </p>

                </div>

                <div class="conduta-box">

                    <h4 style="color:#fff;">
                        Sugestão de Conduta e Tratamento:
                    </h4>

                    <ul style="
                        padding-left:15px;
                        margin-top:5px;
                        font-size:0.9rem;
                        line-height:1.7;
                    ">

                        <li>${paConduta}</li>

                        <li>
                            ${glicConduta ||
                            'Manter ingesta calórica controlada.'}
                        </li>

                        <li>${lipConduta}</li>

                        <li>

                            ${imcVal >= 30
                            ? 'Considerar abordagem farmacológica para obesidade e acompanhamento nutricional.'
                            : 'Manter MEV.'}

                        </li>
                    </ul>
                </div>
            </div>
        `;
    };

    // LOGICA DOS QUIZZES (MANTIDA 100%)
let curQuiz = [], curIdx = 0, curScore = 0, curType = "";

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

    // NOVAS QUESTÕES ADICIONADAS

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

    // NOVAS QUESTÕES ADICIONADAS

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

    { q: "Percebeu um arco esbranquiçado ou acinzentado ao redor da íris (parte colorida do olho)?", pts: 4 },

    { q: "Mantém um estilo de vida majoritariamente sentado e sem exercícios regulares?", pts: 3 },

    // NOVAS QUESTÕES ADICIONADAS

    { q: "Você sente falta de ar ou suor frio ao realizar pequenos esforços?", pts: 4 },

    { q: "Já apresentou exames anteriores com colesterol ou triglicerídeos elevados?", pts: 5 },

    { q: "Percebe caroços endurecidos próximos aos tendões ou articulações?", pts: 4 },

    { q: "Possui sensação de pés frios constantemente?", pts: 3 },

    { q: "Já teve episódios de perda de força em um lado do corpo?", pts: 5 },

    { q: "Percebe alterações repentinas na fala ou dificuldade para formular frases?", pts: 5 }

  ]

};

function start(type) {

  document.getElementById('professionalExtraContent').innerHTML = "";

  curType = type;

  curQuiz = quizData[type];

  curIdx = 0;

  curScore = 0;

  showScreen('quiz');

  render();

}

function render() {

  const q = curQuiz[curIdx];

  document.getElementById('quizStepInfo').innerText =
  `${curType} - Questão ${curIdx + 1}`;

  document.getElementById('questionText').innerText =
  q.q;

  document.getElementById('quizProgress').style.width =
  `${((curIdx+1)/curQuiz.length)*100}%`;

  const list =
  document.getElementById('optionsList');

  list.innerHTML = '';

  ['Sim', 'Não'].forEach(opt => {

    const btn =
    document.createElement('button');

    btn.className = 'option-btn';

    btn.innerText = opt;

    btn.onclick = () => {

      if(opt === 'Sim')
      curScore += q.pts;

      curIdx++;

      if(curIdx < curQuiz.length) {

        render();

      }

      else {

        finish();

      }

    };

    list.appendChild(btn);

  });

}

function finish() {

  showScreen('result');

  const st =
  document.getElementById('resultStatus');

  const ds =
  document.getElementById('resultDescription');

  const extra =
  document.getElementById('professionalExtraContent');

  let medico = "";
  let tratamento = "";
  let imediato = "";
  let emergencia = "";

  // CLASSIFICAÇÃO DE RISCO

  if(curScore >= 30) {

    st.innerText = "Risco Elevado";

    st.style.color = "#ff4d4d";

  }

  else if(curScore >= 15) {

    st.innerText = "Atenção";

    st.style.color = "#ffa500";

  }

  else {

    st.innerText = "Baixo Risco";

    st.style.color = "#00ff7f";

  }

  // =====================================================
  // CONDUTAS
  // =====================================================

  if(curType === "Diabetes") {

    medico =
    "Endocrinologista";

    tratamento =
    "Controle glicêmico, reeducação alimentar, atividade física e possível terapia medicamentosa.";

    imediato =
    "Evitar açúcar, refrigerantes, excesso de carboidratos refinados e iniciar rotina de exercícios leves.";

    emergencia =
    "Caso exista visão muito embaçada, vômitos, desmaios ou glicemia extremamente alta, procurar emergência imediatamente.";

  }

  else if(curType === "Hipertensão") {

    medico =
    "Cardiologista";

    tratamento =
    "Controle da pressão arterial, redução de sódio, controle do estresse e possível uso de anti-hipertensivos.";

    imediato =
    "Evitar excesso de sal, álcool, cigarro e monitorar a pressão regularmente.";

    emergencia =
    "Dor intensa no peito, pressão acima de 18x12, falta de ar ou confusão mental exigem atendimento imediato.";

  }

  else if(curType === "Colesterol") {

    medico =
    "Cardiologista ou Endocrinologista";

    tratamento =
    "Mudança alimentar, atividade física, redução de gorduras saturadas e possível uso de estatinas.";

    imediato =
    "Evitar frituras, ultraprocessados, cigarro e sedentarismo.";

    emergencia =
    "Dor no peito, perda de força, alteração na fala ou falta de ar podem indicar emergência cardiovascular.";

  }

  ds.innerText =
  "Baseado nas respostas do rastreamento básico.";

  // =====================================================
  // RELATÓRIO EXTRA
  // =====================================================

  extra.innerHTML=`

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
document.getElementById('btnStartDiabetes').onclick =
() => start("Diabetes");
document.getElementById('btnStartHypertension').onclick =
() => start("Hipertensão");
document.getElementById('btnStartCholesterol').onclick =
() => start("Colesterol");
showScreen('home');
