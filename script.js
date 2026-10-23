document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // SETTINGS
  // ==========================================

  // Apna WhatsApp number country code ke saath daalo.
  // Example: 919876543210
  // + sign ya spaces mat daalna.
  const WHATSAPP_NUMBER = "";

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const toast = document.getElementById("toast");
  const backTop = document.getElementById("backTop");

  let purpose = "Buy";
  let toastTimer;

  // ==========================================
  // COPYRIGHT YEAR
  // ==========================================

  document.getElementById("year").textContent =
    new Date().getFullYear();

  // ==========================================
  // TOAST MESSAGE
  // ==========================================

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Mobile menu link click karne par menu close hoga.
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      menuToggle.innerHTML =
        '<i class="fa-solid fa-bars"></i>';
    });
  });

  // Screen resize hone par mobile menu reset karo.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      navMenu.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      menuToggle.innerHTML =
        '<i class="fa-solid fa-bars"></i>';
    }
  });

  // ==========================================
  // BUY / RENT / SELL TABS
  // ==========================================

  document.querySelectorAll(".search-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".search-tab").forEach((item) => {
        item.classList.remove("active");
      });

      tab.classList.add("active");
      purpose = tab.dataset.purpose;

      if (purpose === "Sell") {
        showToast(
          "Tell us about your property in the enquiry form."
        );
      }
    });
  });

  // ==========================================
  // PROPERTY SEARCH AND FILTER
  // ==========================================

  document
    .getElementById("propertySearch")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const location = document
        .getElementById("locationSearch")
        .value.trim()
        .toLowerCase();

      const type =
        document.getElementById("typeSearch").value;

      const budget =
        document.getElementById("budgetSearch").value;

      const cards = [
        ...document.querySelectorAll(".property-card"),
      ];

      let count = 0;

      cards.forEach((card) => {
        const cityMatch =
          !location ||
          card.dataset.city.includes(location);

        const typeMatch =
          type === "all" ||
          card.dataset.type === type;

        const budgetMatch =
          budget === "all" ||
          Number(card.dataset.price) <= Number(budget);

        // Demo listings filhaal purchase ke liye hain.
        const purposeMatch =
          purpose === "Buy" &&
          card.dataset.purpose === "Buy";

        const visible =
          purposeMatch &&
          cityMatch &&
          typeMatch &&
          budgetMatch;

        card.style.display = visible ? "" : "none";

        if (visible) {
          count++;
        }
      });

      const message =
        document.getElementById("resultsMessage");

      if (purpose === "Sell") {
        message.textContent =
          "For selling your property, please use the contact form below.";

        document.getElementById("contact").scrollIntoView({
          behavior: "smooth",
        });

        document.getElementById("interest").value =
          "Selling a property";

        return;
      }

      if (purpose === "Rent") {
        message.textContent =
          "Rental listings are not available in this demo yet. Please contact us for rental enquiries.";

        return;
      }

      message.textContent = count
        ? `${count} sample listing(s) match your search. Contact us to confirm details.`
        : "No sample listings match these filters. Try a different location or budget.";

      document.getElementById("properties").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

  // ==========================================
  // PROPERTY FAVOURITES
  // ==========================================

  document.querySelectorAll(".property-heart").forEach((button) => {
    button.addEventListener("click", () => {
      const saved = button.classList.toggle("saved");

      button.innerHTML = saved
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';

      button.setAttribute(
        "aria-pressed",
        String(saved)
      );

      showToast(
        saved
          ? "Property added to favourites."
          : "Removed from favourites."
      );
    });
  });

  // ==========================================
  // PROPERTY ENQUIRY
  // ==========================================

  document.querySelectorAll(".property-enquire").forEach((link) => {
    link.addEventListener("click", () => {
      const property = link.dataset.property;

      document.getElementById("message").value =
        `I am interested in ${property}. Please share more details.`;

      document.getElementById("interest").value =
        "Buying a property";
    });
  });

  // ==========================================
  // SERVICE LINKS
  // ==========================================

  document.querySelectorAll(".service-link").forEach((link) => {
    link.addEventListener("click", () => {
      const service = link.dataset.service;

      if (!service) return;

      const interest = document.getElementById("interest");

      if (service === "Buy a Property") {
        interest.value = "Buying a property";
      } else if (service === "Rent a Property") {
        interest.value = "Renting a property";
      } else if (service === "Sell a Property") {
        interest.value = "Selling a property";
      }
    });
  });

  // ==========================================
  // CONTACT FORM -> WHATSAPP
  // ==========================================

  document
    .getElementById("contactForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.currentTarget;

      if (!form.reportValidity()) {
        return;
      }

      const data = new FormData(form);

      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const interest = String(data.get("interest") || "");
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !phone) {
        showToast(
          "Please complete all required fields."
        );

        return;
      }

      const enquiry =
        "Hello EstateAura! I have a property enquiry.\n\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + phone + "\n" +
        "Interested in: " + interest + "\n" +
        "Requirements: " + (message || "Not specified");

      if (!WHATSAPP_NUMBER) {
        showToast(
          "Add your WhatsApp number in script.js before submitting."
        );

        return;
      }

      const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(enquiry);

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );
    });

  // ==========================================
  // FLOATING WHATSAPP BUTTON
  // ==========================================

  const whatsappLink =
    document.getElementById("whatsappLink");

  if (WHATSAPP_NUMBER) {
    whatsappLink.href =
      "https://wa.me/" + WHATSAPP_NUMBER;
  } else {
    whatsappLink.addEventListener("click", (event) => {
      event.preventDefault();

      showToast(
        "Add your WhatsApp number in script.js settings."
      );
    });
  }

  // ==========================================
  // BACK TO TOP
  // ==========================================

  window.addEventListener("scroll", () => {
    backTop.classList.toggle(
      "show",
      window.scrollY > 450
    );
  });

  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});