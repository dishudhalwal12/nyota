// Nyota Client-Side Interactive Engine



document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Navigation & Header Animations ---
  const mainHeader = document.querySelector('.main-header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Add scroll listener for sticky header background blur
  window.addEventListener('scroll', () => {
    const heroScrollTrack = document.getElementById('heroScrollTrack');
    if (heroScrollTrack) {
      const heroHeight = heroScrollTrack.offsetHeight;
      if (window.scrollY > heroHeight - 80) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    } else {
      if (window.scrollY > 20) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }
  });

  // Toggle mobile menu
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
      
      // Animate hamburger lines to X
      const lines = menuToggle.querySelectorAll('.hamburger-line');
      if (mobileNav.classList.contains('open')) {
        lines[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      }
    });

    // Close menu on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('active');
        const lines = menuToggle.querySelectorAll('.hamburger-line');
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      });
    });
  }

  // --- 2. Template Gallery Render & Filter ---
  const templates = [
    {
      id: "laavan",
      name: "Laavan",
      category: "sikh",
      price: 3999,
      description: "Perfect for Sikh weddings — effortless to edit, share. Designed to feel completely yours.",
      class: "card-laavan",
      screenClass: "screen-laavan",
      ornament: "✦",
      names: "Harpreet &<br>Prabhjot",
      date: "December 12, 2026",
      location: "Amritsar",
      badge: "",
      tag: "Sikh Weddings"
    },
    {
      id: "mandap",
      name: "Mandap",
      category: "hindu",
      price: 3499,
      description: "Built around the rituals that matter — mandap, mantras, and all.",
      class: "card-mandap",
      screenClass: "screen-mandap",
      ornament: "❁",
      names: "Abhishek &<br>Kanika",
      date: "November 20, 2026",
      location: "Mumbai",
      badge: "Popular",
      tag: "Hindu Weddings"
    },
    {
      id: "nikah-nama",
      name: "Nikah Nama",
      category: "muslim",
      price: 2999,
      description: "Elegant, understated, and true to tradition — for your nikah invite.",
      class: "card-nikah",
      screenClass: "screen-nikah",
      ornament: "✦",
      names: "Zayn &<br>Yasmin",
      date: "January 10, 2027",
      location: "Lucknow",
      badge: "",
      tag: "Muslim Weddings"
    },
    {
      id: "vow-veil",
      name: "Vow & Veil",
      category: "christian",
      price: 2799,
      description: "A clean, romantic template for church weddings and receptions.",
      class: "card-vow",
      screenClass: "screen-vow",
      ornament: "❀",
      names: "Chris &<br>Michelle",
      date: "December 18, 2026",
      location: "Goa",
      badge: "",
      tag: "Christian Weddings"
    },
    {
      id: "thirumanam",
      name: "Thirumanam",
      category: "south-indian",
      price: 3299,
      description: "Inspired by South-Indian wedding motifs — kolam patterns, temple gold, and warmth.",
      class: "card-thirumanam",
      screenClass: "screen-thirumanam",
      ornament: "❃",
      names: "Karthik &<br>Divya",
      date: "February 04, 2027",
      location: "Chennai",
      badge: "",
      tag: "South-Indian Weddings"
    },
    {
      id: "the-route",
      name: "The Route",
      category: "save-date",
      price: 2499,
      description: "A playful save-the-date with a built-in map — because half your guests will ask for directions anyway.",
      class: "card-route",
      screenClass: "screen-route",
      ornament: "✵",
      names: "Kabir &<br>Alia",
      date: "December 25, 2026",
      location: "Goa",
      badge: "New",
      tag: "Save the Date"
    }
  ];

  const templatesGrid = document.getElementById('templatesGrid');
  const filterChips = document.querySelectorAll('.filter-chip');

  // Render cards helper
  function renderTemplates(filterCategory = 'all') {
    if (!templatesGrid) return;
    
    templatesGrid.innerHTML = '';
    
    const filtered = templates.filter(t => {
      if (filterCategory === 'all') return true;
      return t.category === filterCategory;
    });
    
    filtered.forEach(t => {
      const card = document.createElement('div');
      card.className = `template-card ${t.class}`;
      card.innerHTML = `
        <div class="template-device-frame">
          <div class="template-device-screen ${t.screenClass}">
            <div class="template-card-header-icons">
              <div class="badge-row-left">
                <span class="color-variants-badge" title="Color variants">🎨</span>
                ${t.badge ? `<span style="font-size:9px; background:#0E0E0E; color:#FFF; padding:2px 8px; border-radius:99px; text-transform:uppercase; font-weight:600; letter-spacing:0.05em;">${t.badge}</span>` : ''}
              </div>
              <span class="eye-preview-btn" title="Live Preview">👁</span>
            </div>
            
            <div class="screen-ornament">${t.ornament}</div>
            <div class="template-desc-names">${t.names}</div>
            
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing:0.05em; opacity: 0.8; margin-top: auto;">
              ${t.date}<br>${t.location}
            </div>
          </div>
        </div>
        
        <div class="template-meta-info">
          <div class="template-name-row">
            <span class="template-card-title">${t.name}</span>
            <span class="template-card-category">${t.tag}</span>
          </div>
          <span class="template-price-badge">₹${t.price.toLocaleString('en-IN')}</span>
        </div>
        
        <p class="template-card-body-text">${t.description}</p>
        
        <button class="template-select-cta" data-template-id="${t.id}">Choose Template</button>
      `;
      templatesGrid.appendChild(card);
    });

    // Add event listeners to newly created buttons
    document.querySelectorAll('.template-select-cta').forEach(button => {
      button.addEventListener('click', (e) => {
        const templateId = e.target.getAttribute('data-template-id');
        openCheckoutModal(templateId);
      });
    });

  }

  // Initial gallery rendering
  renderTemplates();

  // Handle category chip filter changes
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      filterChips.forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      
      const category = e.target.getAttribute('data-category');
      renderTemplates(category);
    });
  });

  // --- 3. Checkout Modal & Payment integration ---
  const checkoutModal = document.getElementById('checkoutModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const modalTemplateName = document.getElementById('modalTemplateName');
  const modalTemplatePrice = document.getElementById('modalTemplatePrice');
  const payButton = document.getElementById('payButton');

  let activeTemplateId = null;

  function openCheckoutModal(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    activeTemplateId = templateId;
    modalTemplateName.textContent = `Template: ${template.name} (${template.tag})`;
    modalTemplatePrice.textContent = `₹${template.price.toLocaleString('en-IN')}`;
    
    if (checkoutModal) {
      checkoutModal.classList.add('open');
      document.body.style.overflow = 'hidden'; // prevent scroll
    }
  }

  function closeCheckoutModal() {
    if (checkoutModal) {
      checkoutModal.classList.remove('open');
      document.body.style.overflow = '';
      checkoutForm.reset();
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCheckoutModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeCheckoutModal);

  // Submit checkout form & integrate Razorpay payments
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const custName = document.getElementById('custName').value;
      const custEmail = document.getElementById('custEmail').value;
      const custWhatsapp = document.getElementById('custWhatsapp').value;
      const eventTitle = document.getElementById('eventTitle').value;

      if (!activeTemplateId) return;

      payButton.disabled = true;
      payButton.textContent = 'Processing Workspace Setup...';

      try {
        // 1. Create order on the Express server backend
        const response = await fetch('/api/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            template_id: activeTemplateId,
            customer_name: custName,
            email: custEmail,
            whatsapp: custWhatsapp,
            event_title: eventTitle
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create order on server');
        }

        const orderData = await response.json();

        // 2. Configure and trigger Razorpay Checkout popup
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Nyota Invites',
          description: `Visual editor access for template: ${activeTemplateId}`,
          order_id: orderData.order_id,
          handler: async function (paymentResponse) {
            payButton.textContent = 'Verifying Transaction...';
            
            try {
              // 3. Verify Razorpay signature on our backend
              const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  razorpay_order_id: orderData.order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature
                })
              });

              const verificationResult = await verifyResponse.json();

              if (verificationResult.success) {
                // Redirect to thank-you confirmation page with details
                closeCheckoutModal();
                window.location.href = `/thank-you?name=${encodeURIComponent(custName)}&email=${encodeURIComponent(custEmail)}&whatsapp=${encodeURIComponent(custWhatsapp)}&brand=${encodeURIComponent(eventTitle)}&focus=${encodeURIComponent(activeTemplateId)}&slug=${verificationResult.editor_slug}`;
              } else {
                alert('Payment verification failed. Please contact hello@nyota.design');
                payButton.disabled = false;
                payButton.textContent = 'Proceed to Customize (Pay Now)';
              }
            } catch (err) {
              console.error('Error during verification fetch:', err);
              alert('Network error verifying payment.');
              payButton.disabled = false;
              payButton.textContent = 'Proceed to Customize (Pay Now)';
            }
          },
          prefill: {
            name: custName,
            email: custEmail,
            contact: custWhatsapp
          },
          theme: {
            color: '#111111'
          },
          modal: {
            ondismiss: function () {
              payButton.disabled = false;
              payButton.textContent = 'Proceed to Customize (Pay Now)';
            }
          }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

      } catch (err) {
        console.error('Checkout creation error:', err);
        alert('Could not connect to payment gateway. Please check your credentials or network connection.');
        payButton.disabled = false;
        payButton.textContent = 'Proceed to Customize (Pay Now)';
      }
    });
  }

  // --- 4. FAQ Accordion Panels ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all open panels
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        parent.classList.add('active');
        const answer = parent.querySelector('.faq-answer');
        // dynamically set max height for animation
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- 5. Newsletter Submission Handler ---
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing to Nyota releases! We\'ll notify you when new templates go live.');
      newsletterForm.reset();
    });
  }

  // --- 6. Smooth Scroll Helper ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 7. Scroll Morph Hero Animation Engine ---
  const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80",
    "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=300&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80",
    "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=300&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80",
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300&q=80",
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&q=80",
    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300&q=80",
    "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=300&q=80",
    "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=300&q=80"
  ];

  class RobustSpringSolver {
    constructor(initialValue, frequency = 1.5, dampingRatio = 0.85) {
      this.current = initialValue;
      this.target = initialValue;
      this.velocity = 0;
      this.frequency = frequency;
      this.dampingRatio = dampingRatio;
    }
    update(dt) {
      if (this.frequency <= 0) {
        this.current = this.target;
        this.velocity = 0;
        return this.current;
      }
      const w0 = this.frequency * 2 * Math.PI;
      const damping = 2 * this.dampingRatio * w0;
      const subSteps = 4;
      const h = dt / subSteps;
      for (let i = 0; i < subSteps; i++) {
        const acceleration = - (w0 * w0) * (this.current - this.target) - damping * this.velocity;
        this.velocity += acceleration * h;
        this.current += this.velocity * h;
      }
      return this.current;
    }
  }

  const lerp = (start, end, t) => start * (1 - t) + end * t;

  const heroScrollTrack = document.getElementById('heroScrollTrack');
  const heroContainer = document.getElementById('heroContainer');
  const morphCardsContainer = document.getElementById('morphCardsContainer');
  const introTextBlock = document.getElementById('introTextBlock');
  const activeContentBlock = document.getElementById('activeContentBlock');

  if (heroScrollTrack && heroContainer && morphCardsContainer) {
    // 1. Generate 20 Cards
    morphCardsContainer.innerHTML = '';
    const cards = [];

    HERO_IMAGES.forEach((src, idx) => {
      const card = document.createElement('div');
      card.className = 'morph-card';
      card.innerHTML = `
        <div class="morph-card-inner">
          <div class="card-front">
            <img src="${src}" alt="hero-${idx}" loading="lazy">
            <div class="card-front-overlay"></div>
          </div>
          <div class="card-back">
            <span class="card-back-view">View</span>
            <p class="card-back-details">Details</p>
          </div>
        </div>
      `;
      morphCardsContainer.appendChild(card);
      cards.push(card);
    });

    // 2. Setup Dimensions
    let containerWidth = heroContainer.offsetWidth;
    let containerHeight = heroContainer.offsetHeight;

    function handleResize() {
      containerWidth = heroContainer.offsetWidth;
      containerHeight = heroContainer.offsetHeight;
    }
    window.addEventListener('resize', handleResize);

    // 3. Setup mousemove parallax
    let mouseX = 0;
    heroContainer.addEventListener('mousemove', (e) => {
      const rect = heroContainer.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1; // -1 to 1
      mouseX = normalizedX * 100; // Move +/- 100px
    });

    // 4. Setup scroll tracking
    let virtualScroll = 0;
    function handleScroll() {
      const rect = heroScrollTrack.getBoundingClientRect();
      const scrollY = -rect.top;
      const maxScroll = rect.height - window.innerHeight;
      if (maxScroll > 0) {
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
        virtualScroll = progress * 3000;
      } else {
        virtualScroll = 0;
      }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 5. Phase Transitions
    let introPhase = "scatter";
    setTimeout(() => { introPhase = "line"; }, 500);
    setTimeout(() => { introPhase = "circle"; }, 2500);

    // 6. Define Scatter Positions
    const scatterPositions = HERO_IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0
    }));

    // 7. Initialize Springs
    const scrollSpring = new RobustSpringSolver(0, 0.7, 0.95); // Damped luxury scroll inertia
    const parallaxSpring = new RobustSpringSolver(0, 1.0, 1.0); // Critically damped parallax

    const cardSprings = HERO_IMAGES.map((_, idx) => ({
      x: new RobustSpringSolver(scatterPositions[idx].x, 1.3, 0.90),
      y: new RobustSpringSolver(scatterPositions[idx].y, 1.3, 0.90),
      rotation: new RobustSpringSolver(scatterPositions[idx].rotation, 1.0, 0.85),
      scale: new RobustSpringSolver(0.6, 1.0, 0.85),
      opacity: new RobustSpringSolver(0, 1.2, 1.0)
    }));

    // 8. Animation Loop
    let lastTime = 0;
    function tick(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.1); // in seconds, capped at 100ms
      lastTime = timestamp;

      // Update general springs
      const smoothedScroll = scrollSpring.update(dt);
      const parallaxValue = parallaxSpring.update(dt);

      // Set targets
      scrollSpring.target = virtualScroll;
      parallaxSpring.target = mouseX;

      // Morph progress & rotation based on smoothed scroll
      const morphValue = Math.min(Math.max(smoothedScroll / 600, 0), 1);
      const rotateValue = smoothedScroll > 600 ? ((smoothedScroll - 600) / 2400) * 360 : 0;

      // Update intro text and active content opacity
      if (introTextBlock) {
        if (introPhase === "circle" && morphValue < 0.5) {
          introTextBlock.style.opacity = Math.max(1 - morphValue * 2, 0);
          introTextBlock.style.filter = `blur(${morphValue * 10}px)`;
        } else if (introPhase === "circle" && morphValue >= 0.5) {
          introTextBlock.style.opacity = 0;
          introTextBlock.style.filter = "blur(10px)";
        } else {
          introTextBlock.style.opacity = 1;
          introTextBlock.style.filter = "blur(0px)";
        }
      }

      if (activeContentBlock) {
        if (morphValue > 0.8) {
          const t = (morphValue - 0.8) / 0.2; // 0 to 1
          activeContentBlock.style.opacity = t;
          activeContentBlock.style.transform = `translateY(${lerp(20, 0, t)}px)`;
        } else {
          activeContentBlock.style.opacity = 0;
          activeContentBlock.style.transform = "translateY(20px)";
        }
      }

      // Calculate targets and update card springs
      cards.forEach((card, i) => {
        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

        if (introPhase === "scatter") {
          target = scatterPositions[i];
        } else if (introPhase === "line") {
          const lineSpacing = 70;
          const lineTotalWidth = 20 * lineSpacing;
          const lineX = i * lineSpacing - lineTotalWidth / 2;
          target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
        } else {
          // Circle & bottom-strip morph
          const isMobile = containerWidth < 768;
          const minDimension = Math.min(containerWidth, containerHeight);

          // A. Circle Position
          const circleRadius = Math.min(minDimension * 0.35, 350);
          const circleAngle = (i / 20) * 360;
          const circleRad = (circleAngle * Math.PI) / 180;
          const circlePos = {
            x: Math.cos(circleRad) * circleRadius,
            y: Math.sin(circleRad) * circleRadius,
            rotation: circleAngle + 90
          };

          // B. Bottom Arc Position
          const baseRadius = Math.min(containerWidth, containerHeight * 1.5);
          const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
          const arcApexY = containerHeight * (isMobile ? 0.35 : 0.25);
          const arcCenterY = arcApexY + arcRadius;
          const spreadAngle = isMobile ? 100 : 130;
          const startAngle = -90 - (spreadAngle / 2);
          const step = spreadAngle / 19;

          const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
          const maxRotation = spreadAngle * 0.8;
          const boundedRotation = -scrollProgress * maxRotation;

          const currentArcAngle = startAngle + (i * step) + boundedRotation;
          const arcRad = (currentArcAngle * Math.PI) / 180;

          const arcPos = {
            x: Math.cos(arcRad) * arcRadius + parallaxValue,
            y: Math.sin(arcRad) * arcRadius + arcCenterY,
            rotation: currentArcAngle + 90,
            scale: isMobile ? 1.4 : 1.8
          };

          // C. Interpolate (Morph)
          target = {
            x: lerp(circlePos.x, arcPos.x, morphValue),
            y: lerp(circlePos.y, arcPos.y, morphValue),
            rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
            scale: lerp(1, arcPos.scale, morphValue),
            opacity: 1
          };
        }

        // Apply springs
        const springs = cardSprings[i];
        springs.x.target = target.x;
        springs.y.target = target.y;
        springs.rotation.target = target.rotation;
        springs.scale.target = target.scale;
        springs.opacity.target = target.opacity;

        const currentX = springs.x.update(dt);
        const currentY = springs.y.update(dt);
        const currentRot = springs.rotation.update(dt);
        const currentScale = springs.scale.update(dt);
        const currentOpacity = springs.opacity.update(dt);

        card.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRot}deg) scale(${currentScale})`;
        card.style.opacity = currentOpacity;
      });

      requestAnimationFrame(tick);
    }

    // Bootstrap first frame
    requestAnimationFrame((timestamp) => {
      lastTime = timestamp;
      requestAnimationFrame(tick);
    });
  }
});
