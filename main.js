document.addEventListener('DOMContentLoaded', () => {
  renderFaqList();
  
  initStickyHeader();
  initMobileMenu();
  initInteractiveCustomizer();
  initScrollReveal();
  initHeroCountdown();
  initCustomCursor();
  initSelectedFocusTabs();
  initContactForm();
  initServicePreSelection();
});

/**
 * Renders Rovexa Agency FAQs
 */
function renderFaqList() {
  const container = document.getElementById('faqContainer');
  if (!container) return;

  const faqs = [
    { q: "What does the growth audit actually analyze?", a: "We analyze your entire brand footprint. This includes copy effectiveness, branding guidelines, site speeds, checkout friction, tracking systems, operational logistics, and distribution pipelines." },
    { q: "How long does it take to get my completed roadmap?", a: "For single-pillar audits (Marketing, Tech, Branding, Operations), we deliver the workspace in 24 hours. The Full Growth Audit is delivered within 48 hours." },
    { q: "Do you build the websites and setups you recommend?", a: "Yes. Rovexa is a full-execution growth agency. Once the audit highlights recommendations, you can hire us to implement the design, web builds, copy, automations, and campaigns." },
    { q: "Is the audit price a recurring fee?", a: "No. All audits are a one-time flat service fee. There are no automatic renewals, monthly commitments, or hidden costs." },
    { q: "What happens after I complete payment?", a: "You will receive an instant link to your Rovexa Growth Dashboard by email and WhatsApp. There, you can upload assets, track analysis in progress, and schedule the review call." },
    { q: "Do you work with global brands?", a: "Yes, we work with D2C, B2B, and SaaS brands across India, North America, Europe, and Southeast Asia." }
  ];

  container.innerHTML = faqs.map((faq, index) => `
    <div class="faq-item">
      <button class="faq-header" aria-expanded="false" id="faq-btn-${index}">
        <span class="faq-question">${faq.q}</span>
        <span class="faq-toggle-icon">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </span>
      </button>
      <div class="faq-panel" id="faq-panel-${index}">
        <p class="faq-answer">${faq.a}</p>
      </div>
    </div>
  `).join('');

  initFaqAccordion();
}

/**
 * Sticky Header Scroll States
 */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/**
 * Mobile slide navigation overlay toggle
 */
function initMobileMenu() {
  const trigger = document.querySelector('.menu-trigger');
  const overlay = document.querySelector('.nav-overlay');
  const links = document.querySelectorAll('.nav-links a');
  
  if (!trigger || !overlay) return;

  const toggleMenu = () => {
    const isOpen = overlay.classList.toggle('open');
    trigger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  trigger.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('open');
      trigger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Step 2: Interactive Customizer Mockup
 */
function initInteractiveCustomizer() {
  const name1Input = document.getElementById('name1-customizer');
  const name2Input = document.getElementById('name2-customizer');
  const previewName1 = document.getElementById('preview-name1');
  const previewName2 = document.getElementById('preview-name2');
  
  if (!name1Input || !name2Input || !previewName1 || !previewName2) return;

  const updateNames = () => {
    previewName1.textContent = name1Input.value.trim().toUpperCase() || 'MY BRAND';
    previewName2.textContent = name2Input.value.trim().toUpperCase() || 'TECH AUDIT';
  };

  name1Input.addEventListener('input', updateNames);
  name2Input.addEventListener('input', updateNames);
}

/**
 * FAQ Accordion Expand & Collapse
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const panel = item.querySelector('.faq-panel');
    
    if (!header || !panel) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Intersection Observer scroll triggers
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/**
 * 20-minute local storage countdown timer
 */
function initHeroCountdown() {
  const timerLabel = document.getElementById('heroCountdown');
  if (!timerLabel) return;

  const countdownMinutes = 20;
  const countdownDurationSeconds = countdownMinutes * 60;
  const storageKey = 'rovexa:countdown';
  
  let startedAt = Date.now();
  const saved = localStorage.getItem(storageKey);
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.startedAt && (Date.now() - parsed.startedAt < countdownDurationSeconds * 1000)) {
        startedAt = parsed.startedAt;
      } else {
        localStorage.setItem(storageKey, JSON.stringify({ startedAt }));
      }
    } catch {
      localStorage.setItem(storageKey, JSON.stringify({ startedAt }));
    }
  } else {
    localStorage.setItem(storageKey, JSON.stringify({ startedAt }));
  }

  const updateTimer = () => {
    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const remainingSeconds = Math.max(0, countdownDurationSeconds - elapsedSeconds);
    
    if (remainingSeconds === 0) {
      startedAt = Date.now();
      localStorage.setItem(storageKey, JSON.stringify({ startedAt }));
    }

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    timerLabel.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * Custom Cursors tracking over Hero Heading
 */
function initCustomCursor() {
  const heading = document.getElementById('heroHeading');
  const cursor = document.getElementById('customCursor');
  const avatar = document.getElementById('customCursorAvatar');
  const label = document.getElementById('customCursorLabel');

  if (!heading || !cursor || !avatar || !label) return;

  // Track if hovering is enabled based on media capabilities (fine pointers only)
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  heading.style.cursor = 'none';

  heading.addEventListener('pointerenter', (e) => {
    cursor.classList.add('visible');
    updateCursorAvatar(e);
  });

  heading.addEventListener('pointermove', (e) => {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    updateCursorAvatar(e);
  });

  heading.addEventListener('pointerleave', () => {
    cursor.classList.remove('visible');
  });

  function updateCursorAvatar(e) {
    const bounds = heading.getBoundingClientRect();
    const isLeft = e.clientX < bounds.left + bounds.width / 2;
    
    if (isLeft) {
      avatar.style.backgroundImage = "url('images/pinda.png')";
      label.textContent = 'Pinda';
    } else {
      avatar.style.backgroundImage = "url('images/ranveer.png')";
      label.textContent = 'Ranveer';
    }
  }
}

/**
 * Switch tabs in Selected Focus pillar list
 */
function initSelectedFocusTabs() {
  const buttons = document.querySelectorAll('.focus-pill-btn');
  const cards = document.querySelectorAll('.focus-panel-card');
  
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const targetPillar = btn.getAttribute('data-pillar');
      
      // Toggle card panel displays
      cards.forEach(card => {
        card.classList.remove('active');
        if (card.id === `pillar-${targetPillar}`) {
          card.classList.add('active');
        }
      });
    });
  });
}

/**
 * Contact/Inquiry Form Submission
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const whatsapp = document.getElementById('contactWhatsapp').value.trim();
    const brand = document.getElementById('contactBrand').value.trim();
    const focus = document.getElementById('contactFocus').value;
    const message = document.getElementById('contactMessage').value.trim();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          email: email,
          whatsapp: whatsapp,
          brand_name: brand,
          focus_area: focus,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.success) {
        // Redirect to thank-you page with query details
        window.location.href = `/thank-you?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&whatsapp=${encodeURIComponent(whatsapp)}&brand=${encodeURIComponent(brand)}&focus=${encodeURIComponent(focus)}&message=${encodeURIComponent(message)}`;
      } else {
        alert('Something went wrong. Please try again.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Inquiry';
        }
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      alert('Failed to send message. Please try again or email us directly.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Inquiry';
      }
    }
  });
}

/**
 * Service Cards selection scrolls to contact form and pre-fills focus selection
 */
function initServicePreSelection() {
  const links = document.querySelectorAll('[data-pillar-link]');
  const select = document.getElementById('contactFocus');
  if (!links.length || !select) return;

  links.forEach(link => {
    link.addEventListener('click', () => {
      const pillar = link.getAttribute('data-pillar-link');
      if (pillar) {
        select.value = pillar;
      }
    });
  });
}
