/* ========= Lead Popup Logic ========= */

const SUPABASE_URL = "https://kgdszmdcdatbvmjctnkw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZHN6bWRjZGF0YnZtamN0bmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MjA5NjksImV4cCI6MjA3NjM5Njk2OX0.FYalhBpdRjORQ0bVkLoRpiCRNT2bMKHeCz9UU5YgvhY";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const popup = document.getElementById("leadPopup");
const closeBtn = document.getElementById("closePopup");

/* ===== Controle de exibição ===== */
function qs(name) {
  const p = new URLSearchParams(location.search);
  return p.get(name);
}

function openLeadPopup(partName = "") {
  const isFirstVisit = !localStorage.getItem("popupShown");
  const force = qs("forcePopup") === "1";
  const test = localStorage.getItem("showPopupTest") === "true";
  if (isFirstVisit || force || test) {
    popup.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document
      .querySelectorAll(".popup-step")
      .forEach((s) => s.classList.remove("active-step"));
    document.getElementById("stepChoice").classList.add("active-step");
    document.getElementById("partNameField")?.value &&
      (document.getElementById("partNameField").value = partName || "");
    setTimeout(() => closeBtn.classList.remove("hidden"), 4000);
    localStorage.setItem("popupShown", "true");
  }
}

function chooseUserType(type) {
  document
    .querySelectorAll(".popup-step")
    .forEach((s) => s.classList.remove("active-step"));
  document
    .getElementById(type === "buyer" ? "buyerFormBlock" : "supplierFormBlock")
    .classList.add("active-step");
}

function goBackToChoice() {
  document
    .querySelectorAll(".popup-step")
    .forEach((s) => s.classList.remove("active-step"));
  document.getElementById("stepChoice").classList.add("active-step");
}

closeBtn.addEventListener("click", () => closePopup());
document
  .querySelector("[data-close-popup]")
  .addEventListener("click", () => closePopup());

function closePopup() {
  popup.classList.add("hidden");
  document.body.style.overflow = "auto";
}

/* ===== Buyer Submit ===== */
const buyerForm = document.getElementById("buyerForm");
const buyerSubmit = document.getElementById("buyerSubmit");
const buyerStatus = document.getElementById("buyerStatus");

buyerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  buyerStatus.textContent = "";
  buyerSubmit.classList.add("btn-loading");
  buyerSubmit.disabled = true;

  const form = e.target;
  const payload = {
    email: form.email.value.trim(),
    part: form.part.value.trim(),
    quantity: form.quantity.value ? Number(form.quantity.value) : null,
    urgency: form.urgency?.value?.trim() || "",
    country: form.country.value.trim(),
    offers: form.offers?.checked || true,
  };

  const { error } = await supabase.from("leadscustomerspopup").insert(payload);
  buyerSubmit.classList.remove("btn-loading");
  buyerSubmit.disabled = false;

  if (error) {
    buyerStatus.className = "inline-status text-error";
    buyerStatus.textContent = "❌ We couldn't send your request. Please try again.";
    return;
  }

  buyerStatus.className = "inline-status text-success";
  buyerStatus.textContent = "✅ Request sent successfully!";
  setTimeout(() => {
    window.location.href = "search.html";
  }, 1200);
});

/* ===== Supplier Submit (atualizado) ===== */
const supplierForm = document.getElementById("supplierForm");
const supplierSubmit = document.getElementById("supplierSubmit");
const supplierStatus = document.getElementById("supplierStatus");
const supplierSuccessMsg = document.getElementById("supplierSuccessMsg");

supplierForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  supplierStatus.textContent = "";
  supplierSubmit.classList.add("btn-loading");
  supplierSubmit.disabled = true;

  const form = e.target;
  const payload = {
    name: form.name.value.trim(),
    company: form.company.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    country: form.country.value.trim(),
    brands: form.brands.value.trim(),
    integration_preference: form.integration_preference.value.trim(),
    has_catalog: form.has_catalog.value.trim(),
    parts_estimate: form.parts_estimate.value
      ? parseInt(form.parts_estimate.value)
      : null,
    goal: form.goal.value.trim(),
    notes: form.notes.value.trim(),
    offers: form.offers.checked,
  };

  const { error } = await supabase.from("leadssupplierspopup").insert(payload);

  supplierSubmit.classList.remove("btn-loading");
  supplierSubmit.disabled = false;

  if (error) {
    supplierStatus.className = "inline-status text-error";
    supplierStatus.textContent =
      "❌ Error saving your registration. Please try again.";
    console.error("Supabase error:", error);
    return;
  }

  // 🎉 Sucesso visual
  supplierForm.style.display = "none";
  supplierSuccessMsg.style.display = "block";
  supplierStatus.textContent = "";

  setTimeout(() => {
    supplierSuccessMsg.style.display = "none";
    supplierForm.reset();
    supplierForm.style.display = "block";
    closePopup();
  }, 4000);
});

/* ===== Auto-trigger popup ===== */
window.addEventListener("load", () => {
  setTimeout(() => openLeadPopup(), 8000);
});
