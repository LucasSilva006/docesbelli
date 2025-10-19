const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("show");
});

/* INTERAÇÃO NAV DE CATEGORIAS DA PÁGINA DE SABORES */

// Script para atualizar automaticamente a navegação de categorias
document.addEventListener("DOMContentLoaded", function () {
  // Seleciona todos os botões de categoria e seções
  const btnsCategorias = document.querySelectorAll(".btn-categoria");
  const secoesCategorias = document.querySelectorAll(".categoria-secao");

  // Configuração do Intersection Observer
  const opcoes = {
    root: null, // viewport
    rootMargin: "-150px 0px -50% 0px", // Ajusta quando considerar "visível"
    threshold: 0,
  };

  // Função para ativar o botão correspondente
  function ativarBotao(id) {
    // Remove 'active' de todos os botões
    btnsCategorias.forEach((btn) => btn.classList.remove("active"));

    // Adiciona 'active' ao botão correspondente
    const btnAtivo = document.querySelector(`a[href="#${id}"]`);
    if (btnAtivo) {
      btnAtivo.classList.add("active");

      // Scroll horizontal suave para o botão ativo (mobile)
      btnAtivo.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  // Cria o observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Quando a seção está visível
      if (entry.isIntersecting) {
        ativarBotao(entry.target.id);
      }
    });
  }, opcoes);

  // Observa todas as seções de categorias
  secoesCategorias.forEach((secao) => {
    observer.observe(secao);
  });

  // Adiciona smooth scroll aos botões (opcional, melhora UX)
  btnsCategorias.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Calcula a posição considerando header + nav
        const offsetTop = targetSection.offsetTop - 140; // Ajuste conforme necessário

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
});
