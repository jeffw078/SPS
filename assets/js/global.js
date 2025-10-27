/* ============================================================
   GLOBAL.JS - Spare Parts Suppliers
   Funções:
   1. Menu lateral mobile
   2. Scroll suave para âncoras
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Elementos principais
  const mobileMenuBtn = document.querySelector(".mobile-menu");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileOverlay = document.querySelector(".mobile-overlay");
  const body = document.body;

  // Abre o menu lateral
  function openMobileNav() {
    mobileNav.classList.add("active");
    mobileOverlay.classList.add("active");
    body.style.overflow = "hidden";
  }

  // Fecha o menu lateral
  function closeMobileNav() {
    mobileNav.classList.remove("active");
    mobileOverlay.classList.remove("active");
    body.style.overflow = "auto";
  }

  // Eventos
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", openMobileNav);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMobileNav);
  }

  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMobileNav);
    });
  }

  // Tornar funções do popup globais se o script index.js não estiver carregado
window.openLeadPopup = window.openLeadPopup || function() {
  const popup = document.getElementById("leadPopup");
  if (!popup) return alert("Lead popup not available on this page.");
  popup.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

window.chooseUserType = window.chooseUserType || function(type) {
  const stepChoice = document.getElementById("stepChoice");
  const supplierForm = document.getElementById("supplierFormBlock");
  const buyerForm = document.getElementById("buyerFormBlock");
  if (!stepChoice) return;
  stepChoice.classList.remove("active-step");
  supplierForm?.classList.toggle("active-step", type === "supplier");
  buyerForm?.classList.toggle("active-step", type === "buyer");
};


  // Scroll suave para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: "smooth"
        });
      }
    });
  });
});
