(function () {
  const entries = (performance.getEntriesByType && performance.getEntriesByType("navigation")) || [];
  const navType = entries.length > 0 ? entries[0].type : "";
  if (navType === "reload") {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  } else {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "auto";
    }
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slide");
  const nextArrow = document.querySelector(".next-arrow");
  const prevArrow = document.querySelector(".prev-arrow");
  const dotsContainer = document.querySelector(".slider-dots-container");

  let currentSlideIndex = 0;
  let autoSlideTimer;
  const autoSlideDuration = 6000; // Time interval for automatic rotation (6 seconds)

  // Dynamic generation of navigation tracking dots based on the HTML slide count
  if (dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("hero-dot");
      if (index === 0) dot.classList.add("active");
      dot.setAttribute("data-slide-index", index);
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll(".hero-dot");

  // Central Controller Function to change slides
  function changeSlide(targetIndex) {
    if (!slides.length) return;
    // Clear active classes across all components
    slides[currentSlideIndex]?.classList.remove("active");
    dots[currentSlideIndex]?.classList.remove("active");

    // Assign current index safely
    currentSlideIndex = targetIndex;

    // Apply active classes to target components
    slides[currentSlideIndex]?.classList.add("active");
    dots[currentSlideIndex]?.classList.add("active");

    // Reset the interval timer to avoid quick multi-slides
    runAutoSlideLoop();
  }

  function showNextSlide() {
    if (!slides.length) return;
    let nextIndex = (currentSlideIndex + 1) % slides.length;
    changeSlide(nextIndex);
  }

  function showPrevSlide() {
    if (!slides.length) return;
    let prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    changeSlide(prevIndex);
  }

  // Initialize Auto-Rotation loop functionality
  function runAutoSlideLoop() {
    if (!slides.length) return;
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(showNextSlide, autoSlideDuration);
  }

  // Event Listeners for Arrows
  nextArrow?.addEventListener("click", showNextSlide);
  prevArrow?.addEventListener("click", showPrevSlide);

  // Event Listeners for Pagination Tracking Dots
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const indexClicked = parseInt(e.target.getAttribute("data-slide-index"));
      if (indexClicked !== currentSlideIndex) {
        changeSlide(indexClicked);
      }
    });
  });

  // Fire initialization
  if (slides.length) {
    runAutoSlideLoop();
    setTimeout(() => {
      slides[0].classList.add("active");
    }, 100);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. STICKY NAVBAR & MOBLIE MENU TOGGLE
       ========================================================================== */
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const navLinksContainer = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-link");

  let savedScrollY = 0;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
    highlightNavOnScroll();
  });

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener("click", () => {
      const isOpening = !navLinksContainer.classList.contains("active");
      if (isOpening) {
        savedScrollY = window.scrollY;
        hamburger.classList.add("active");
        navLinksContainer.classList.add("active");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
      } else {
        hamburger.classList.remove("active");
        navLinksContainer.classList.remove("active");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        window.scrollTo(0, savedScrollY);
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const isMobileOpen = navLinksContainer.classList.contains("active");
        if (isMobileOpen) {
          hamburger.classList.remove("active");
          navLinksContainer.classList.remove("active");
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
          document.body.style.touchAction = "";
          const href = link.getAttribute("href");
          if (!href || href === "#" || href.startsWith("#")) {
            window.scrollTo(0, savedScrollY);
          }
        }
      });
    });
  }

  /* Active nav highlighters based on viewport section tracking */
  function highlightNavOnScroll() {
    let scrollPosition = window.scrollY + 150;
    document.querySelectorAll("section[id]").forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document
          .querySelector(`.nav-links a[href*=${sectionId}]`)
          ?.classList.add("active");
      } else {
        document
          .querySelector(`.nav-links a[href*=${sectionId}]`)
          ?.classList.remove("active");
      }
    });
  }

   /* ==========================================================================
       2. GPU-ACCELERATED INTERSECTION OBSERVER SCROLL REVEAL ENGINE
       ========================================================================== */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
       3. UNIVERSAL ANIMATED STATISTICS COUNTER MATRIX
       ========================================================================== */
  function initStatCounters() {
    const counterElements = document.querySelectorAll(".stat-number, .impact-stat-num, [data-counter]");

    const parseCounterString = (text) => {
      const regex = /^([^\d.]*)([\d.,]+)(.*)$/;
      const match = text.trim().match(regex);
      if (!match) return null;

      let prefix = match[1] || "";
      let numStr = match[2].replace(/,/g, "");
      let suffix = match[3] || "";

      let targetNum = parseFloat(numStr);
      if (isNaN(targetNum)) return null;

      const decimalSplit = numStr.split(".");
      const decimals = decimalSplit.length > 1 ? decimalSplit[1].length : 0;

      return { prefix, targetNum, suffix, decimals };
    };

    const animateSingleCounter = (el) => {
      if (el.dataset.counterStarted === "true") return;
      el.dataset.counterStarted = "true";

      const rawText = el.dataset.targetVal || el.innerText.trim();
      const parsed = parseCounterString(rawText);
      if (!parsed) return;

      const { prefix, targetNum, suffix, decimals } = parsed;
      const duration = 2000;
      const startTime = performance.now();

      const easeOutQuad = (t) => t * (2 - t);

      const updateFrame = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuad(progress);
        const currentVal = easedProgress * targetNum;

        if (decimals > 0) {
          el.innerText = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;
        } else {
          el.innerText = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateFrame);
        } else {
          if (decimals > 0) {
            el.innerText = `${prefix}${targetNum.toFixed(decimals)}${suffix}`;
          } else {
            el.innerText = `${prefix}${Math.floor(targetNum).toLocaleString()}${suffix}`;
          }
        }
      };

      requestAnimationFrame(updateFrame);
    };

    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSingleCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counterElements.forEach((el) => {
      if (!el.dataset.targetVal) {
        el.dataset.targetVal = el.innerText.trim();
      }
      observer.observe(el);
    });
  }

  initStatCounters();

  /* ==========================================================================
       4. BIO-INDIVIDUAL BMI CALCULATOR ENGINE (RE-ENGINEERED)
       ========================================================================== */
  const unitBtns = document.querySelectorAll(".switch-btn");
  const genderBtns = document.querySelectorAll(".gender-btn");
  const metricInputsGroup = document.getElementById("metric-inputs-group");
  const imperialInputsGroup = document.getElementById("imperial-inputs-group");

  const heightSlider = document.getElementById("height-metric");
  const weightSlider = document.getElementById("weight-metric");
  const heightValLabel = document.getElementById("height-metric-val");
  const weightValLabel = document.getElementById("weight-metric-val");

  const heightFtInput = document.getElementById("height-ft");
  const heightInInput = document.getElementById("height-in");
  const weightLbsInput = document.getElementById("weight-lbs");

  const ageInput = document.getElementById("bmi-age");
  const ageMinusBtn = document.getElementById("age-minus");
  const agePlusBtn = document.getElementById("age-plus");

  const bmiValueDisplay = document.getElementById("bento-bmi-value");
  const bmiStatusBadge = document.getElementById("bento-bmi-status");
  const bmiAdviceDisplay = document.getElementById("bento-bmi-advice");
  const meterIndicator = document.getElementById("meter-indicator");

  let activeUnit = "metric";
  let activeGender = "male";

  // Switch between Metric and Imperial
  unitBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      unitBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeUnit = btn.getAttribute("data-unit");

      if (activeUnit === "metric") {
        metricInputsGroup.classList.remove("hidden");
        imperialInputsGroup.classList.add("hidden");
      } else {
        metricInputsGroup.classList.add("hidden");
        imperialInputsGroup.classList.remove("hidden");
      }
      calculateBmi();
    });
  });

  // Switch gender (visual/minor state changes)
  genderBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      genderBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeGender = btn.getAttribute("data-gender");
      calculateBmi();
    });
  });

  // Metric Range Sliders real-time feedback
  if (heightSlider && weightSlider) {
    heightSlider.addEventListener("input", (e) => {
      heightValLabel.innerText = `${e.target.value} cm`;
      calculateBmi();
    });
    weightSlider.addEventListener("input", (e) => {
      weightValLabel.innerText = `${e.target.value} kg`;
      calculateBmi();
    });
  }

  // Imperial inputs tracking
  [heightFtInput, heightInInput, weightLbsInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", calculateBmi);
    }
  });

  // Age controls (Plus/Minus)
  if (ageMinusBtn && agePlusBtn && ageInput) {
    ageMinusBtn.addEventListener("click", () => {
      let currentVal = parseInt(ageInput.value);
      let minVal = parseInt(ageInput.getAttribute("min") || 15);
      if (currentVal > minVal) {
        ageInput.value = currentVal - 1;
        calculateBmi();
      }
    });

    agePlusBtn.addEventListener("click", () => {
      let currentVal = parseInt(ageInput.value);
      let maxVal = parseInt(ageInput.getAttribute("max") || 90);
      if (currentVal < maxVal) {
        ageInput.value = currentVal + 1;
        calculateBmi();
      }
    });
  }

  // Central Calculation Function
  function calculateBmi() {
    let heightM = 0;
    let weightKg = 0;

    if (activeUnit === "metric") {
      const cm = parseFloat(heightSlider.value);
      const kg = parseFloat(weightSlider.value);
      heightM = cm / 100;
      weightKg = kg;
    } else {
      const feet = parseFloat(heightFtInput.value) || 0;
      const inches = parseFloat(heightInInput.value) || 0;
      const lbs = parseFloat(weightLbsInput.value) || 0;

      const totalInches = feet * 12 + inches;
      heightM = (totalInches * 2.54) / 100; // cm to meters
      weightKg = lbs * 0.453592; // lbs to kg
    }

    if (heightM <= 0 || weightKg <= 0) {
      bmiValueDisplay.innerText = "--";
      bmiStatusBadge.className = "status-badge status-under";
      bmiStatusBadge.innerText = "No Metrics";
      bmiAdviceDisplay.innerText = "Please input valid structural measurements.";
      meterIndicator.style.left = "0%";
      return;
    }

    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    bmiValueDisplay.innerText = bmi;

    let category = "normal";
    let statusText = "Optimal Target";
    let adviceText = "Your physiological body ratio is in prime parameters for athletic building blocks.";
    let meterPercentage = 50;

    // Categorization
    if (bmi < 18.5) {
      category = "under";
      statusText = "Caloric Surplus Advised";
      adviceText = "Optimize systemic protein input and increase structured calorie density to rebuild muscle mass.";
      // Map <18.5 between 5% and 25%
      meterPercentage = 5 + (bmi / 18.5) * 20;
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "normal";
      statusText = "Optimal Target";
      adviceText = "Your physiological body ratio is in prime parameters for athletic building blocks.";
      // Map 18.5 to 25 between 25% and 50%
      meterPercentage = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi >= 25 && bmi < 30) {
      category = "over";
      statusText = "Conditioning Advised";
      adviceText = "Consider incorporating explosive interval training loops to maximize definition.";
      // Map 25 to 30 between 50% and 75%
      meterPercentage = 50 + ((bmi - 25) / 5) * 25;
    } else {
      category = "obese";
      statusText = "High Priority Conditioning";
      adviceText = "Bespoke metabolic conditioning programs and functional recovery strategies are highly advised.";
      // Map >=30 between 75% and 95%
      meterPercentage = 75 + Math.min((bmi - 30) / 15, 1) * 20;
    }

    // Apply active classes to status badge
    bmiStatusBadge.className = `status-badge status-${category}`;
    bmiStatusBadge.innerText = statusText;
    bmiAdviceDisplay.innerText = adviceText;

    // Shift meter indicator
    meterIndicator.style.left = `${Math.min(Math.max(meterPercentage, 5), 95)}%`;
  }

  // Initialize Calculator on load
  calculateBmi();

  /* ==========================================================================
       4a. PREMIUM ECOSYSTEM MOBILE ACCESS WIDGET
       ========================================================================== */
  const btnSendLink = document.getElementById("btn-send-link");
  const appEmailInput = document.getElementById("app-download-email");
  const installerFeedbackMsg = document.getElementById("installer-feedback-msg");

  if (btnSendLink && appEmailInput && installerFeedbackMsg) {
    btnSendLink.addEventListener("click", () => {
      const email = appEmailInput.value.trim();
      
      // Email Regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email || !emailRegex.test(email)) {
        installerFeedbackMsg.className = "installer-msg error";
        installerFeedbackMsg.innerText = "Please enter a valid business email address.";
        installerFeedbackMsg.classList.remove("hidden");
        return;
      }
      
      // Dynamic simulated network call loading state
      btnSendLink.disabled = true;
      btnSendLink.innerText = "Encrypting & Sending...";
      installerFeedbackMsg.className = "installer-msg info";
      installerFeedbackMsg.innerText = "Connecting to secure delivery nodes...";
      installerFeedbackMsg.classList.remove("hidden");
      
      setTimeout(() => {
        btnSendLink.disabled = false;
        btnSendLink.innerText = "Get Access Link";
        appEmailInput.value = "";
        installerFeedbackMsg.className = "installer-msg success";
        installerFeedbackMsg.innerText = "Access link successfully dispatched! Check your secure inbox.";
      }, 1500);
    });
  }


  /* ==========================================================================
       5. AUTOMATED TESTIMONIAL SLIDER CAROUSEL
       ========================================================================== */
  const slider = document.querySelector(".testimonial-slider");
  const cards = document.querySelectorAll(".testimonial-card");
  const dotsContainer = document.querySelector(".carousel-dots");
  let currentIndex = 0;
  let slideInterval;

  // Create Carousel Control Tracking Nodes
  cards.forEach((_, idx) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (idx === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function goToSlide(index) {
    currentIndex = index;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((d) => d.classList.remove("active"));
    dots[currentIndex].classList.add("active");
    resetSlideTimer();
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % cards.length;
    goToSlide(nextIndex);
  }

  function resetSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000); // Shift slides every 5s loop
  }

  resetSlideTimer();

  /* ==========================================================================
       6. LIGHTBOX MASONRY POPUP MECHANICS
       ========================================================================== */
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");

  galleryItems.forEach((img) => {
    img.addEventListener("click", () => {
      lightboxModal.style.display = "flex";
      lightboxImg.src = img.src;
    });
  });

  lightboxClose.addEventListener("click", () => {
    lightboxModal.style.display = "none";
  });

  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.style.display = "none";
    }
  });

  /* ==========================================================================
       6a. MODERN INTERACTIVE FAQ ACCORDION ENGINE
       ========================================================================== */
  const accordionTriggers = document.querySelectorAll(".accordion-trigger");

  // Initialize state on load for any active item
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const content = item.querySelector(".accordion-content");
    const trigger = item.querySelector(".accordion-trigger");
    
    if (item.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";
      trigger.setAttribute("aria-expanded", "true");
    } else {
      content.style.maxHeight = null;
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const currentItem = trigger.closest(".accordion-item");
      const currentContent = currentItem.querySelector(".accordion-content");
      const isCurrentlyActive = currentItem.classList.contains("active");

      // Close other open accordions smoothly
      document.querySelectorAll(".accordion-item").forEach((item) => {
        if (item !== currentItem && item.classList.contains("active")) {
          item.classList.remove("active");
          item.querySelector(".accordion-content").style.maxHeight = null;
          item.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current accordion state
      if (isCurrentlyActive) {
        currentItem.classList.remove("active");
        currentContent.style.maxHeight = null;
        trigger.setAttribute("aria-expanded", "false");
      } else {
        currentItem.classList.add("active");
        currentContent.style.maxHeight = currentContent.scrollHeight + "px";
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
});
