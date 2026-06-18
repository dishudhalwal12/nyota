require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const db = require('./db');
const servicesData = require('./services-data');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

const isRazorpayMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_NYOTA');

let razorpay = null;
if (!isRazorpayMock) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('Razorpay SDK initialized with custom credentials.');
  } catch (err) {
    console.error('Error initializing Razorpay, falling back to mock mode:', err);
  }
} else {
  console.log('--- RUNNING IN RAZORPAY MOCK MODE ---');
  console.log('Real transactions will be bypassed. Key-ID starts with default.');
}

/**
 * Route: Thank-you confirmation page redirect helper
 */
app.get('/thank-you', (req, res) => {
  res.sendFile(path.join(__dirname, 'thank-you.html'));
});

/**
 * Route: Nyota Invite Workspace
 * Displays the visual editor mockup for the purchased wedding invitation website template.
 */
app.get('/editor/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const order = await db.getOrderBySlug(slug);
    if (!order) {
      return res.status(404).send('<h1>Visual workspace expired or invalid</h1>');
    }
    
    // Look up template details
    const service = servicesData.find(s => s.id === order.template_id);
    const serviceName = service ? service.name : 'Wedding Invite';
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nyota Editor — ${order.event_title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
        <style>
          body {
            background-color: #FAF8F5;
            margin: 0;
            font-family: 'Inter', sans-serif;
            color: #0E0E0E;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          header {
            background: #FFFFFF;
            border-bottom: 1px solid #E5E1DA;
            padding: 16px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            font-weight: 700;
            font-size: 20px;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: 'Playfair Display', serif;
          }
          .badge {
            background: #0E0E0E;
            color: #FAF8F5;
            padding: 4px 10px;
            border-radius: 99px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
          }
          .workspace {
            display: flex;
            flex: 1;
          }
          @media (max-width: 768px) {
            .workspace {
              flex-direction: column-reverse;
            }
          }
          .sidebar {
            width: 380px;
            background: #FFFFFF;
            border-right: 1px solid #E5E1DA;
            padding: 32px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            box-sizing: border-box;
          }
          @media (max-width: 768px) {
            .sidebar {
              width: 100%;
              border-right: none;
              border-top: 1px solid #E5E1DA;
            }
          }
          .sidebar h2 {
            font-size: 22px;
            margin: 0 0 4px 0;
            letter-spacing: -0.03em;
            font-family: 'Playfair Display', serif;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .form-group label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666;
          }
          .form-input {
            border: 1px solid #E5E1DA;
            border-radius: 8px;
            padding: 10px 14px;
            font-family: inherit;
            font-size: 14px;
            color: inherit;
            background-color: #FAF8F5;
          }
          .form-input:focus {
            outline: none;
            border-color: #111111;
          }
          .preview-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
            background-color: #FAF8F5;
          }
          .phone-mockup {
            width: 320px;
            height: 568px;
            background: #FFFFFF;
            border: 12px solid #0E0E0E;
            border-radius: 36px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.04);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .phone-screen {
            flex: 1;
            padding: 30px 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            background: linear-gradient(135deg, #FAF8F5 0%, #FFFDF9 100%);
            box-sizing: border-box;
          }
          .screen-ornament {
            font-size: 24px;
            color: #D4AF37;
          }
          .screen-names {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            margin: 16px 0;
            letter-spacing: -0.02em;
            line-height: 1.2;
          }
          .screen-details {
            font-size: 14px;
            color: #555555;
            line-height: 1.6;
          }
          .screen-btn {
            background: #111111;
            color: #FFFFFF;
            border: none;
            border-radius: 99px;
            padding: 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
          }
          .editor-actions {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .btn-pill {
            background: #111111;
            color: #FFFFFF;
            border: none;
            border-radius: 99px;
            padding: 14px 24px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          .btn-pill:hover {
            transform: scale(1.02);
            opacity: 0.9;
          }
          .btn-outline {
            background: transparent;
            color: #111111;
            border: 1px solid #111111;
            border-radius: 99px;
            padding: 14px 24px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          .btn-outline:hover {
            background: #FAF8F5;
          }
          .live-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            color: #2E7D32;
            margin-bottom: 8px;
          }
          .live-dot {
            width: 8px;
            height: 8px;
            background-color: #2E7D32;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.6; }
          }
        </style>
      </head>
      <body>
        <header>
          <div class="logo">
            ✦ Nyota <span class="badge" style="margin-left: 12px;">Visual Editor</span>
          </div>
          <div style="font-size: 13px; color: #666;">
            Template: <strong>${serviceName}</strong>
          </div>
        </header>
        
        <div class="workspace">
          <div class="sidebar">
            <div>
              <h2>Edit Invitation</h2>
              <p style="font-size: 13px; color: #666; margin: 0 0 20px 0;">Customise your invite parameters in real time.</p>
            </div>
            
            <div class="form-group">
              <label>Partner 1 Name</label>
              <input type="text" id="partner1" class="form-input" value="${order.customer_name}">
            </div>
            
            <div class="form-group">
              <label>Partner 2 Name</label>
              <input type="text" id="partner2" class="form-input" value="Kanika">
            </div>
            
            <div class="form-group">
              <label>Event Date</label>
              <input type="text" id="eventDate" class="form-input" value="November 20, 2026">
            </div>
            
            <div class="form-group">
              <label>Venue Location</label>
              <input type="text" id="venue" class="form-input" value="${order.event_title}">
            </div>
            
            <div class="editor-actions">
              <button class="btn-pill" onclick="alert('Invite changes successfully published!')">Publish Changes</button>
              <a href="/" class="btn-outline">Exit Editor</a>
            </div>
          </div>
          
          <div class="preview-area">
            <div class="live-badge">
              <span class="live-dot"></span>
              Live Preview
            </div>
            <div class="phone-mockup">
              <div class="phone-screen">
                <div class="screen-ornament">⚜</div>
                <div>
                  <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888;">Save the Date</div>
                  <div class="screen-names" id="previewNames">${order.customer_name} & Kanika</div>
                  <div style="font-size: 12px; font-style: italic; color: #666; margin-top: 8px;">Are getting married</div>
                </div>
                <div>
                  <div class="screen-details" id="previewDetails">
                    <strong id="previewDate">November 20, 2026</strong><br>
                    <span id="previewVenue">${order.event_title}</span>
                  </div>
                  <button class="screen-btn" onclick="alert('This will trigger RSVP submission form.')">RSVP Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <script>
          const p1Input = document.getElementById('partner1');
          const p2Input = document.getElementById('partner2');
          const dateInput = document.getElementById('eventDate');
          const venueInput = document.getElementById('venue');
          
          const namesPreview = document.getElementById('previewNames');
          const datePreview = document.getElementById('previewDate');
          const venuePreview = document.getElementById('previewVenue');
          
          function updatePreview() {
            namesPreview.textContent = p1Input.value + ' & ' + p2Input.value;
            datePreview.textContent = dateInput.value;
            venuePreview.textContent = venueInput.value;
          }
          
          p1Input.addEventListener('input', updatePreview);
          p2Input.addEventListener('input', updatePreview);
          dateInput.addEventListener('input', updatePreview);
          venueInput.addEventListener('input', updatePreview);
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error fetching order from slug:', err);
    res.status(500).send('Database lookup error');
  }
});

/**
 * Endpoint: POST /api/create-order
 * Initiates Razorpay Order or returns dummy credentials if in mock sandbox mode.
 */
app.post('/api/create-order', async (req, res) => {
  const { template_id, customer_name, email, whatsapp, event_title } = req.body;

  if (!template_id || !customer_name || !email || !whatsapp || !event_title) {
    return res.status(400).json({ error: 'Missing required details.' });
  }

  // Look up selected template price from servicesData configuration array
  const service = servicesData.find(s => s.id === template_id);
  if (!service) {
    return res.status(404).json({ error: 'Template not found.' });
  }

  const priceAmount = service.price;

  try {
    let order_id = '';
    
    if (isRazorpayMock) {
      order_id = `order_mock_${crypto.randomBytes(8).toString('hex')}`;
    } else {
      const options = {
        amount: priceAmount * 100, // paise
        currency: 'INR',
        receipt: `receipt_nyota_${crypto.randomBytes(4).toString('hex')}`
      };
      
      const response = await razorpay.orders.create(options);
      order_id = response.id;
    }

    await db.createPendingOrder({
      customer_name,
      email,
      whatsapp,
      event_title,
      template_id,
      amount_paid: priceAmount,
      razorpay_order_id: order_id
    });

    res.json({
      order_id,
      amount: priceAmount * 100,
      currency: 'INR',
      key_id: isRazorpayMock ? 'rzp_test_NYOTA12345678' : process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error('Failed to create payment order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Endpoint: POST /api/verify-payment
 * Verifies Razorpay signature and triggers Email/WhatsApp delivery.
 */
app.post('/api/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id) {
    return res.status(400).json({ error: 'Missing required verify parameters.' });
  }

  try {
    let verified = false;

    if (isRazorpayMock) {
      verified = razorpay_order_id.startsWith('order_mock_');
    } else {
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      verified = generated_signature === razorpay_signature;
    }

    if (!verified) {
      return res.status(400).json({ error: 'Signature verification failed.' });
    }

    const order = await db.getOrderByOrderId(razorpay_order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order reference not found.' });
    }

    if (order.razorpay_payment_id) {
      return res.json({ success: true, editorSlug: order.editor_slug });
    }

    const editorSlug = `audit-${crypto.randomBytes(6).toString('hex')}`;

    await db.confirmOrderPayment({
      razorpay_order_id,
      razorpay_payment_id,
      editor_slug: editorSlug
    });

    const updatedOrder = await db.getOrderByOrderId(razorpay_order_id);
    
    const deliveryResult = await triggerDelivery(updatedOrder);

    res.json({
      success: true,
      editorSlug,
      emailSent: deliveryResult.emailSent,
      whatsappSent: deliveryResult.whatsappSent
    });

  } catch (err) {
    console.error('Failed to verify payment:', err);
    res.status(500).json({ error: 'Verification internal error.' });
  }
});

/**
 * Endpoint: POST /api/razorpay-webhook
 * Webhook validation listener as backup source of truth.
 */
app.post('/api/razorpay-webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'NYOTAWebhookSecret123';
  
  if (!signature) {
    return res.status(400).send('Missing webhook signature');
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).send('Webhook signature mismatch');
  }

  const event = req.body.event;
  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    const razorpay_order_id = payment.order_id;
    const razorpay_payment_id = payment.id;

    try {
      const order = await db.getOrderByOrderId(razorpay_order_id);
      if (order && !order.razorpay_payment_id) {
        const editorSlug = `audit-${crypto.randomBytes(6).toString('hex')}`;
        await db.confirmOrderPayment({
          razorpay_order_id,
          razorpay_payment_id,
          editor_slug: editorSlug
        });
        const updatedOrder = await db.getOrderByOrderId(razorpay_order_id);
        await triggerDelivery(updatedOrder);
      }
    } catch (err) {
      console.error('Error handling webhook confirmation:', err);
    }
  }

  res.send({ status: 'ok' });
});

/**
 * Trigger Email and WhatsApp Notification API Delivery loops
 */
async function triggerDelivery(order) {
  const dashboardLink = `http://localhost:${PORT}/editor/${order.editor_slug}`;
  let emailSent = false;
  let whatsappSent = false;

  const service = servicesData.find(s => s.id === order.template_id);
  const serviceName = service ? service.name : 'Brand Audit';

  // 1. Send Transactional Email
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Nyota Invites <hello@nyota.design>',
          to: order.email,
          subject: 'Your Nyota Wedding Website is ready 🎉',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 20px; line-height: 1.6; color: #111;">
              <h2 style="font-size: 24px; letter-spacing: -0.02em;">Hi ${order.customer_name},</h2>
              <p>Thank you for choosing Nyota! We have generated your wedding website workspace. You can now use the visual editor to customise it.</p>
              <p><strong>Template selection:</strong> ${serviceName}</p>
              <p><strong>Wedding:</strong> ${order.event_title}</p>
              <p>You can customise details, edit templates, and publish your live invite page from your workspace:</p>
              <p style="margin: 30px 0;">
                <a href="${dashboardLink}" style="background-color: #111111; color: #ffffff; padding: 12px 28px; border-radius: 99px; text-decoration: none; font-weight: 500; display: inline-block;">Open Visual Editor</a>
              </p>
              <p>If the button above does not load, please copy and paste the link below directly into your browser:</p>
              <p><code style="background-color: #f5f5f5; padding: 6px; border-radius: 4px; font-size: 13px;">${dashboardLink}</code></p>
              <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
                Questions? Reach out directly at <a href="mailto:hello@nyota.design">hello@nyota.design</a>.
              </p>
            </div>
          `
        })
      });
      if (res.ok) {
        emailSent = true;
        await db.updateNotificationStatus(order.id, 'email', true);
        console.log(`Template confirmation email successfully dispatched to ${order.email}`);
      } else {
        const errText = await res.text();
        console.error('Email API response error details:', errText);
      }
    } catch (err) {
      console.error('Failed to connect to email sending API:', err);
    }
  } else {
    // Console Sandbox mode logging
    console.log('\n--- [EMAIL SANDBOX NOTICE] ---');
    console.log(`To: ${order.email}`);
    console.log('Subject: Your Nyota Wedding Website is ready 🎉');
    console.log(`Body Link: ${dashboardLink}`);
    console.log('------------------------------\n');
    emailSent = true;
  }

  // 2. Send Transactional WhatsApp Message
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const formattedNum = order.whatsapp.startsWith('+') ? order.whatsapp : `+${order.whatsapp}`;
      
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${formattedNum}`,
        body: `Hi ${order.customer_name}, your Nyota workspace is active! 🎉 Access your visual editor here: ${dashboardLink}`
      });
      
      whatsappSent = true;
      await db.updateNotificationStatus(order.id, 'whatsapp', true);
      console.log(`WhatsApp message successfully sent to ${formattedNum}`);
    } catch (err) {
      console.error('Twilio WhatsApp API error:', err);
    }
  } else {
    // Console Sandbox mode logging
    console.log('\n--- [WHATSAPP SANDBOX NOTICE] ---');
    console.log(`To: ${order.whatsapp}`);
    console.log(`Message: Hi ${order.customer_name}, your Nyota workspace is active! 🎉 Access your visual editor here: ${dashboardLink}`);
    console.log('----------------------------------\n');
    whatsappSent = true;
  }

  return { emailSent, whatsappSent };
}

/**
 * Endpoint: POST /api/contact
 * Captures user contact inquiries, registers them in SQLite database, logs sandbox notifications.
 */
app.post('/api/contact', async (req, res) => {
  const { customer_name, email, whatsapp, brand_name, focus_area, message } = req.body;

  if (!customer_name || !email || !whatsapp || !brand_name || !focus_area || !message) {
    return res.status(400).json({ error: 'Missing required inquiry details.' });
  }

  try {
    const result = await db.createInquiry({
      customer_name,
      email,
      whatsapp,
      brand_name,
      focus_area,
      message
    });

    // Console Sandbox mode logging
    console.log('\n--- [NEW INQUIRY RECEIVED] ---');
    console.log(`ID: ${result.id}`);
    console.log(`From: ${customer_name} <${email}>`);
    console.log(`WhatsApp: ${whatsapp}`);
    console.log(`Brand Target: ${brand_name}`);
    console.log(`Primary Focus: ${focus_area}`);
    console.log(`Message: ${message}`);
    console.log('------------------------------\n');

    res.json({ success: true, id: result.id });
  } catch (err) {
    console.error('Failed to record contact inquiry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Nyota v2 Server successfully running at: http://localhost:${PORT}`);
  });
}

module.exports = app;
