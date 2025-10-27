/* ============================================================
   LEAD-POPUP.JS - FINAL VERSION (no duplicate submits)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://kgdszmdcdatbvmjctnkw.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZHN6bWRjZGF0YnZtamN0bmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MjA5NjksImV4cCI6MjA3NjM5Njk2OX0.FYalhBpdRjORQ0bVkLoRpiCRNT2bMKHeCz9UU5YgvhY";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const popup = document.getElementById("leadPopup");
  const closeBtn = document.getElementById("closePopup");

  /* ------------------ Funções Globais ------------------ */
  window.openLeadPopup = () => {
    popup.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(() => closeBtn.classList.remove("hidden"), 1000);
  };

  function closePopup() {
    popup.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
  closeBtn?.addEventListener("click", closePopup);
  popup?.querySelector(".popup-overlay")?.addEventListener("click", closePopup);

  window.chooseUserType = (type) => {
    document.querySelectorAll(".popup-step").forEach((s) => s.classList.remove("active-step"));
    document.getElementById(type === "buyer" ? "buyerFormBlock" : "supplierFormBlock").classList.add("active-step");
  };

  window.goBackToChoice = () => {
    document.querySelectorAll(".popup-step").forEach((s) => s.classList.remove("active-step"));
    document.getElementById("stepChoice").classList.add("active-step");
  };

  /* ------------------ Loader visual ------------------ */
  const setButtonLoading = (button, loading = true) => {
    if (loading) {
      button.dataset.original = button.innerHTML;
      button.disabled = true;
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
    } else {
      button.disabled = false;
      button.innerHTML = button.dataset.original;
    }
  };

  /* ------------------ Popup Automático ------------------ */
  const urlParams = new URLSearchParams(window.location.search);
  const forcePopup = urlParams.get("forcePopup") === "1";
  const alreadyShown = localStorage.getItem("leadPopupShown");

  if (!alreadyShown || forcePopup) {
    setTimeout(() => {
      openLeadPopup();
      localStorage.setItem("leadPopupShown", "true");
    }, 8000); // 8 segundos
  }

  /* ------------------ FORM COMPRADOR ------------------ */
  const buyerForm = document.getElementById("buyerForm");
  if (buyerForm) {
    // Remove listeners antigos
    const newBuyerForm = buyerForm.cloneNode(true);
    buyerForm.parentNode.replaceChild(newBuyerForm, buyerForm);

    let isBuyerSubmitting = false;
    newBuyerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isBuyerSubmitting) return;
      isBuyerSubmitting = true;

      const btn = newBuyerForm.querySelector("button[type='submit']");
      setButtonLoading(btn, true);
      const status = document.getElementById("buyerStatus");

      const data = {
        part: newBuyerForm.part.value.trim(),
        brand: newBuyerForm.brand.value.trim(),
        quantity: newBuyerForm.quantity.value.trim(),
        name: newBuyerForm.name.value.trim(),
        email: newBuyerForm.email.value.trim(),
        phone: newBuyerForm.phone.value.trim(),
        country: newBuyerForm.country.value.trim(),
        region: newBuyerForm.region.value.trim(),
        message: newBuyerForm.message.value.trim(),
        offers: newBuyerForm.offers.checked,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("leadscustomerspopup").insert(data);
      setButtonLoading(btn, false);
      isBuyerSubmitting = false;

      status.textContent = error ? "❌ Error sending request." : "✅ Request sent successfully!";
      status.className = "inline-status " + (error ? "text-error" : "text-success");
      if (!error) setTimeout(closePopup, 1200);
    });
  }

  /* ------------------ FORM FORNECEDOR ------------------ */
  const supplierForm = document.getElementById("supplierForm");
  if (supplierForm) {
    // Remove listeners antigos
    const newSupplierForm = supplierForm.cloneNode(true);
    supplierForm.parentNode.replaceChild(newSupplierForm, supplierForm);

    let isSupplierSubmitting = false;
    newSupplierForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSupplierSubmitting) return;
      isSupplierSubmitting = true;

      const btn = newSupplierForm.querySelector("button[type='submit']");
      setButtonLoading(btn, true);
      const status = document.getElementById("supplierStatus");

      const data = {
        name: newSupplierForm.name.value.trim(),
        company: newSupplierForm.company.value.trim(),
        email: newSupplierForm.email.value.trim(),
        phone: newSupplierForm.phone.value.trim(),
        country: newSupplierForm.country.value.trim(),
        website: newSupplierForm.website.value.trim(),
        brands: newSupplierForm.brands.value.trim(),
        message: newSupplierForm.message.value.trim(),
        offers: newSupplierForm.offers.checked,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("leadssupplierspopup").insert(data);
      setButtonLoading(btn, false);
      isSupplierSubmitting = false;

      status.textContent = error ? "❌ Error saving data." : "✅ Registered successfully!";
      status.className = "inline-status " + (error ? "text-error" : "text-success");
      if (!error) setTimeout(closePopup, 1200);
    });
  }
});
