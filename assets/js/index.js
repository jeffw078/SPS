document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://kgdszmdcdatbvmjctnkw.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZHN6bWRjZGF0YnZtamN0bmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MjA5NjksImV4cCI6MjA3NjM5Njk2OX0.FYalhBpdRjORQ0bVkLoRpiCRNT2bMKHeCz9UU5YgvhY";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const popup = document.getElementById("leadPopup");
  const closeBtn = document.getElementById("closePopup");

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

  // BUYER FORM
  const buyerForm = document.getElementById("buyerForm");
  buyerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = buyerForm.querySelector("button[type='submit']");
    setButtonLoading(btn, true);
    const status = document.getElementById("buyerStatus");

    const data = {
      part: buyerForm.part.value.trim(),
      brand: buyerForm.brand.value.trim(),
      quantity: buyerForm.quantity.value.trim(),
      name: buyerForm.name.value.trim(),
      email: buyerForm.email.value.trim(),
      phone: buyerForm.phone.value.trim(),
      country: buyerForm.country.value.trim(),
      region: buyerForm.region.value.trim(),
      message: buyerForm.message.value.trim(),
      offers: buyerForm.offers.checked,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("leadscustomerspopup").insert(data);
    setButtonLoading(btn, false);
    status.textContent = error ? "❌ Error sending request." : "✅ Request sent successfully!";
    status.className = "inline-status " + (error ? "text-error" : "text-success");
    if (!error) setTimeout(closePopup, 1200);
  });

  // SUPPLIER FORM
  const supplierForm = document.getElementById("supplierForm");
  supplierForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = supplierForm.querySelector("button[type='submit']");
    setButtonLoading(btn, true);
    const status = document.getElementById("supplierStatus");

    const data = {
      name: supplierForm.name.value.trim(),
      company: supplierForm.company.value.trim(),
      email: supplierForm.email.value.trim(),
      phone: supplierForm.phone.value.trim(),
      country: supplierForm.country.value.trim(),
      website: supplierForm.website.value.trim(),
      brands: supplierForm.brands.value.trim(),
      message: supplierForm.message.value.trim(),
      offers: supplierForm.offers.checked,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("leadssupplierspopup").insert(data);
    setButtonLoading(btn, false);
    status.textContent = error ? "❌ Error saving data." : "✅ Registered successfully!";
    status.className = "inline-status " + (error ? "text-error" : "text-success");
    if (!error) setTimeout(closePopup, 1200);
  });
});
