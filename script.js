
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // SETTINGS
  // ==========================================

  // WhatsApp number country code ke saath daalo.
  // Example: 919876543210
  const WHATSAPP_NUMBER = "";

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const toast = document.getElementById("toast");
  const backTop = document.getElementById("backTop");

  const searchForm = document.getElementById("propertySearch");
  const locationInput = document.getElementById("locationSearch");
  const typeSelect = document.getElementById("typeSearch");
  const budgetSelect = document.getElementById("budgetSearch");

  let purpose = "Buy";
  let toastTimer;

  // ==========================================
  // COPYRIGHT YEAR
  // ==========================================

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ==========================================
  // TOAST MESSAGE
  // ==========================================

  function showToast(message) {
    if (!toast) {
      alert(message);
      return;
    }

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

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML =
          '<i class="fa-solid fa-bars"></i>';
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML =
          '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // ==========================================
  // SEARCH OPTIONS: BUY / RENT / SELL
  // ==========================================

  const propertyTypes = {
    Buy: [
      ["all", "All properties"],
      ["Villa", "Luxury villa"],
      ["Apartment", "Apartment"],
      ["House", "Independent house"]
    ],

    Rent: [
      ["all", "All rental properties"],
      ["Villa", "Luxury villa"],
      ["Apartment", "Apartment"],
      ["House", "Independent house"]
    ],

    Sell: [
      ["all", "All properties"],
      ["Villa", "Luxury villa"],
      ["Apartment", "Apartment"],
      ["House", "Independent house"]
    ]
  };

  const budgetOptions = {
    Buy: [
      ["all", "Any budget"],
      ["5000000", "Up to ₹50 lakh"],
      ["10000000", "Up to ₹1 crore"],
      ["20000000", "Up to ₹2 crore"],
      ["50000000", "Up to ₹5 crore"]
    ],

    Rent: [
      ["all", "Any monthly rent"],
      ["10000", "Up to ₹10,000/month"],
      ["25000", "Up to ₹25,000/month"],
      ["50000", "Up to ₹50,000/month"],
      ["100000", "Up to ₹1 lakh/month"],
      ["200000", "Up to ₹2 lakh/month"]
    ],

    Sell: [
      ["all", "Any property value"],
      ["5000000", "Up to ₹50 lakh"],
      ["10000000", "Up to ₹1 crore"],
      ["20000000", "Up to ₹2 crore"],
      ["50000000", "Up to ₹5 crore"]
    ]
  };

  function fillDropdown(select, options) {
    if (!select) return;

    select.innerHTML = "";

    options.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    });
  }

  function updateSearchOptions() {
    fillDropdown(typeSelect, propertyTypes[purpose]);
    fillDropdown(budgetSelect, budgetOptions[purpose]);
  }

  const searchTabs = document.querySelectorAll(".search-tab");

  searchTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      searchTabs.forEach((item) => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      const selectedPurpose = tab.dataset.purpose;

      if (["Buy", "Rent", "Sell"].includes(selectedPurpose)) {
        purpose = selectedPurpose;
      }

      updateSearchOptions();

      if (purpose === "Sell") {
        showToast(
          "Search property values or contact us to list your property."
        );
      }
    });
  });

  // Set default dropdown options.
  updateSearchOptions();

  // ==========================================
  // PROPERTY SEARCH -> Properties.html
  // ==========================================

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const location = locationInput
        ? locationInput.value.trim()
        : "";

      const type = typeSelect ? typeSelect.value : "all";
      const budget = budgetSelect ? budgetSelect.value : "all";

      const params = new URLSearchParams();

      params.set("searchText", location);
      params.set("purposeSelect", purpose.toLowerCase());
      params.set("typeSelect", type.toLowerCase());
      params.set("budgetSelect", budget);
      params.set("mode", purpose.toLowerCase());

      window.location.href =
        "Properties.html?" + params.toString();
    });
  }

  // ==========================================
  // PROPERTY FAVOURITES
  // ==========================================

  document.querySelectorAll(".property-heart").forEach((button) => {
    button.addEventListener("click", () => {
      const saved = button.classList.toggle("saved");

      button.innerHTML = saved
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';

      button.setAttribute("aria-pressed", String(saved));

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
      const messageField = document.getElementById("message");
      const interestField = document.getElementById("interest");

      if (messageField) {
        messageField.value =
          `I am interested in ${property}. Please share more details.`;
      }

      if (interestField) {
        interestField.value = "Buying a property";
      }
    });
  });

  // ==========================================
  // SERVICE LINKS
  // ==========================================

  document.querySelectorAll(".service-link").forEach((link) => {
    link.addEventListener("click", () => {
      const service = link.dataset.service;
      const interest = document.getElementById("interest");

      if (!service || !interest) return;

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

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.currentTarget;

      if (!form.reportValidity()) return;

      const data = new FormData(form);

      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const interest = String(data.get("interest") || "");
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !phone) {
        showToast("Please complete all required fields.");
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
          "Add your WhatsApp number in the JavaScript settings."
        );
        return;
      }

      const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(enquiry);

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
  }

  // ==========================================
  // FLOATING WHATSAPP BUTTON
  // ==========================================

  const whatsappLink = document.getElementById("whatsappLink");

  if (whatsappLink) {
    if (WHATSAPP_NUMBER) {
      whatsappLink.href = "https://wa.me/" + WHATSAPP_NUMBER;
      whatsappLink.target = "_blank";
      whatsappLink.rel = "noopener noreferrer";
    } else {
      whatsappLink.addEventListener("click", (event) => {
        event.preventDefault();

        showToast(
          "Add your WhatsApp number in the JavaScript settings."
        );
      });
    }
  }

  // ==========================================
  // BACK TO TOP
  // ==========================================

  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("show", window.scrollY > 450);
    });

    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
