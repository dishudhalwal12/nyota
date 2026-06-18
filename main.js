// Nyota Client-Side Interactive Engine



document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Navigation & Header Animations ---
  const mainHeader = document.querySelector('.main-header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Add scroll listener for sticky header background blur
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
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



});
