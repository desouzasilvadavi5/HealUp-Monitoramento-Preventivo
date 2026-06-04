/* =====================================================
   SISTEMA DE NAVEGAÇÃO ENTRE TELAS E INTERAÇÕES (HealUp)
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- Mapeamento de Telas ---
  const screens = {
    home: document.getElementById("homeScreen"),
    how: document.getElementById("howScreen"),
    modes: document.getElementById("modeScreen"),
    assessment: document.getElementById("assessmentScreen"),
    professional: document.getElementById("professionalScreen"),
    quiz: document.getElementById("quizGeneric"),
    result: document.getElementById("resultGeneric")
  };

  // --- Mapeamento de Botões ---
  const buttons = {
    openModes: document.getElementById("btnOpenModes"),
    openHow: document.getElementById("btnOpenHow"),
    backHomeFromHow: document.getElementById("btnBackHomeFromHow"),
    backHomeFromModes: document.getElementById("btnBackHomeFromModes"),
    openAssessment: document.getElementById("btnOpenAssessment"),
    openProfessional: document.getElementById("btnOpenProfessional"),
    backModesFromAssessment: document.getElementById("btnBackModesFromAssessment"),
    backModesFromProfessional: document.getElementById("btnBackModesFromProfessional")
  };

  /**
   * Função central para alternar visualização de telas com animação
   * @param {HTMLElement} targetScreen - A tela que deve ser exibida
   */
  function changeScreen(targetScreen) {
    // Oculta todas as telas do projeto
    Object.values(screens).forEach(screen => {
      if (screen) {
        screen.style.display = "none";
        screen.classList.remove("fade-in-screen");
      }
    });

    // Exibe a tela alvo com comportamento flexível/grid dependendo do seu tipo
    if (targetScreen) {
      if (targetScreen === screens.quiz || targetScreen === screens.result) {
        targetScreen.style.display = "flex";
      } else {
        targetScreen.style.display = "flex"; // Mantém alinhamento flex das seções principais
      }
      targetScreen.classList.add("fade-in-screen");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // --- Configuração dos Eventos de Clique ---

  // Tela Inicial -> Modos de Uso
  if (buttons.openModes) {
    buttons.openModes.addEventListener("click", () => changeScreen(screens.modes));
  }

  // Tela Inicial -> Como Funciona
  if (buttons.openHow) {
    buttons.openHow.addEventListener("click", () => changeScreen(screens.how));
  }

  // Como Funciona -> Voltar para Home
  if (buttons.backHomeFromHow) {
    buttons.backHomeFromHow.addEventListener("click", () => changeScreen(screens.home));
  }

  // Escolha de Modos -> Voltar para Home
  if (buttons.backHomeFromModes) {
    buttons.backHomeFromModes.addEventListener("click", () => changeScreen(screens.home));
  }

  // Modos de Uso -> Avaliação Básica (Triagem)
  if (buttons.openAssessment) {
    buttons.openAssessment.addEventListener("click", () => changeScreen(screens.assessment));
  }

  // Modos de Uso -> Avaliação Profissional (Formulário Clínico)
  if (buttons.openProfessional) {
    buttons.openProfessional.addEventListener("click", () => changeScreen(screens.professional));
  }

  // Avaliação Básica -> Voltar para Modos de Uso
  if (buttons.backModesFromAssessment) {
    buttons.backModesFromAssessment.addEventListener("click", () => changeScreen(screens.modes));
  }

  // Avaliação Profissional -> Voltar para Modos de Uso
  if (buttons.backModesFromProfessional) {
    buttons.backModesFromProfessional.addEventListener("click", () => changeScreen(screens.modes));
  }
});