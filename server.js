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
 * Route: Rovexa Audit Dashboard
 * Displays the status and results of the purchased brand audit.
 */
app.get('/editor/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const order = await db.getOrderBySlug(slug);
    if (!order) {
      return res.status(404).send('<h1>Audit workspace expired or invalid</h1>');
    }
    
    // Look up service details
    const service = servicesData.find(s => s.id === order.template_id);
    const serviceName = service ? service.name : 'Brand Audit';
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rovexa Audit Workspace — ${order.event_title}</title>
        <link rel="stylesheet" href="/styles.css">
        <style>
          body {
            background-color: #FAF8F5;
            padding: 40px 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .editor-panel {
            background: #FFFFFF;
            border: 1px solid #E5E1DA;
            border-radius: 20px;
            padding: 40px;
            max-width: 650px;
            width: 100%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
            text-align: left;
          }
          .editor-header {
            margin-bottom: 30px;
            border-bottom: 1px solid #E5E1DA;
            padding-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .editor-header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            letter-spacing: -0.03em;
          }
          .mock-canvas {
            border: 1px dashed #E5E1DA;
            padding: 30px;
            border-radius: 12px;
            background: #FAF8F5;
            margin: 20px 0;
            font-family: var(--font-body);
            color: #111;
          }
          .editor-actions {
            display: flex;
            gap: 16px;
            margin-top: 30px;
          }
          .badge {
            display: inline-block;
            background: #0E0E0E;
            color: #FAF8F5;
            padding: 6px 14px;
            border-radius: 99px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 16px;
          }
          .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            color: #D4AF37;
            margin-top: 10px;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            background-color: #D4AF37;
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
        <div class="editor-panel">
          <div class="editor-header">
            <span class="badge">${serviceName}</span>
            <h1>Rovexa Growth Workspace</h1>
            <p class="text-muted">Prepared for: <strong>${order.event_title}</strong></p>
            <div class="status-indicator">
              <span class="status-dot"></span>
              Audit Analysis in Progress (Will be ready in 24 hours)
            </div>
          </div>
          
          <div class="mock-canvas">
            <h3 style="font-size: 18px; margin-bottom: 10px; font-family: var(--font-display);">Next Actions</h3>
            <p class="text-muted" style="font-size: 14px; line-height: 1.5; margin-bottom: 15px;">
              Our growth analysts are reviewing your brand touchpoints. Your custom dashboard link has been saved and sent to:
            </p>
            <ul style="font-size: 14px; margin-left: 20px; color: var(--text-color); line-height: 1.8;">
              <li>Email: <strong>${order.email}</strong></li>
              <li>WhatsApp: <strong>${order.whatsapp}</strong></li>
            </ul>
          </div>
          
          <p class="text-muted" style="font-size: 13px; margin-top: 20px;">
            Save this link to access your completed audit document later:
            <br>
            <code style="background: rgba(0,0,0,0.03); padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 8px; font-size: 12px; font-family: monospace;">http://localhost:${PORT}/editor/${slug}</code>
          </p>

          <div class="editor-actions">
            <button class="btn-pill" onclick="alert('Our team has been notified. We will contact you shortly!')" style="font-size: 14px; padding: 12px 24px;">Schedule Call</button>
            <a href="/" class="btn-outline" style="font-size: 14px; padding: 12px 24px;">Back to Home</a>
          </div>
        </div>
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

  // Look up selected service price from servicesData configuration array
  const service = servicesData.find(s => s.id === template_id);
  if (!service) {
    return res.status(404).json({ error: 'Audit type not found.' });
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
        receipt: `receipt_rovexa_${crypto.randomBytes(4).toString('hex')}`
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
          from: 'Rovexa Growth <audits@rovexa.agency>',
          to: order.email,
          subject: 'Your Rovexa Brand Audit dashboard is ready 🎉',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 20px; line-height: 1.6; color: #111;">
              <h2 style="font-size: 24px; letter-spacing: -0.02em;">Hi ${order.customer_name},</h2>
              <p>Thank you for choosing Rovexa! We have registered your audit request and our analysts are reviewing your brand touchpoints.</p>
              <p><strong>Audit selection:</strong> ${serviceName}</p>
              <p><strong>Brand target:</strong> ${order.event_title}</p>
              <p>You can monitor progress, upload brand files, and schedule your live review call from your unique dashboard:</p>
              <p style="margin: 30px 0;">
                <a href="${dashboardLink}" style="background-color: #111111; color: #ffffff; padding: 12px 28px; border-radius: 99px; text-decoration: none; font-weight: 500; display: inline-block;">View Audit Dashboard</a>
              </p>
              <p>If the button above does not load, please copy and paste the link below directly into your browser:</p>
              <p><code style="background-color: #f5f5f5; padding: 6px; border-radius: 4px; font-size: 13px;">${dashboardLink}</code></p>
              <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
                Questions? Reach out directly at <a href="mailto:hello@rovexa.agency">hello@rovexa.agency</a>.
              </p>
            </div>
          `
        })
      });
      if (res.ok) {
        emailSent = true;
        await db.updateNotificationStatus(order.id, 'email', true);
        console.log(`Audit Confirmation Email successfully dispatched to ${order.email}`);
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
    console.log('Subject: Your Rovexa Brand Audit dashboard is ready 🎉');
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
        body: `Hi ${order.customer_name}, your Rovexa Audit workspace is active! 🎉 Track analysis progress here: ${dashboardLink} — we will contact you shortly.`
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
    console.log(`Message: Hi ${order.customer_name}, your Rovexa Audit workspace is active! 🎉 Track analysis progress here: ${dashboardLink}`);
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
    console.log(`Rovexa v2 Server successfully running at: http://localhost:${PORT}`);
  });
}

module.exports = app;
