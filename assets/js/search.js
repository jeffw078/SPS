/* ============================================================
   SEARCH.JS - Request Quote Modal (Supabase)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://kgdszmdcdatbvmjctnkw.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZHN6bWRjZGF0YnZtamN0bmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MjA5NjksImV4cCI6MjA3NjM5Njk2OX0.FYalhBpdRjORQ0bVkLoRpiCRNT2bMKHeCz9UU5YgvhY";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const modal = document.getElementById("quoteModal");
  const form = document.getElementById("quoteForm");
  const closeBtn = document.getElementById("closeModal");

  // Open modal
  function openQuoteModal(code, brand) {
    document.getElementById("quotePartCode").value = code;
    document.getElementById("quoteBrand").value = brand;
    modal.classList.add("active");
    modal.style.display = "flex";
  }

  // Close modal
  function closeModal() {
    modal.style.display = "none";
  }
  closeBtn?.addEventListener("click", closeModal);

  // Handle form submit
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      partcode: document.getElementById("quotePartCode").value,
      brand: document.getElementById("quoteBrand").value,
      quantity: parseInt(document.getElementById("quoteQty").value),
      name: document.getElementById("quoteName").value,
      email: document.getElementById("quoteEmail").value,
      phone: document.getElementById("quotePhone").value,
      country: document.getElementById("quoteCountry").value,
      region: document.getElementById("quoteRegion").value,
      contactmethod: document.getElementById("quoteContact").value,
      acceptedterms: document.getElementById("quoteTerms").checked,
    };

    const { error } = await supabase.from("customerleads").insert([data]);
    const modalBox = modal.querySelector(".modal");
    if (error) {
      modalBox.innerHTML = `
        <h2 class="text-error text-center">Error sending quote</h2>
        <p class="text-muted text-center">Please try again later.</p>
        <button class="btn btn-outline" onclick="location.reload()">Close</button>`;
    } else {
      modalBox.innerHTML = `
        <h2 class="text-success text-center">Quote Sent!</h2>
        <p class="text-muted text-center">Thank you, we’ll connect you with suppliers soon.</p>
        <button class="btn btn-primary" onclick="closeModal()">OK</button>`;
    }
  });

  // Button click handlers
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-primary")) {
      const card = e.target.closest(".part-card");
      if (!card) return;
      openQuoteModal(
        card.querySelector(".part-number").textContent,
        card.querySelector(".part-brand").textContent
      );
    }
  });
});
