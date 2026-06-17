const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let dbPath = path.join(__dirname, 'nyota.db');

// In serverless/Vercel environments, the root filesystem is read-only.
// We copy the database to /tmp/ to make sure SQLite write operations (inquiries/orders) succeed.
if (process.env.VERCEL || process.env.NOW_BUILD_TRIGGER) {
  const tmpDbPath = path.join('/tmp', 'nyota.db');
  try {
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, tmpDbPath);
        console.log('Successfully copied seed database to /tmp/nyota.db');
      } else {
        console.log('Seed database nyota.db not found in source directory.');
      }
    } else {
      console.log('Database already exists in /tmp/nyota.db');
    }
    dbPath = tmpDbPath;
  } catch (err) {
    console.error('Failed to configure SQLite database in /tmp:', err);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database: nyota.db');
    initializeSchema();
  }
});

function initializeSchema() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        event_title TEXT NOT NULL,
        template_id TEXT NOT NULL,
        amount_paid INTEGER NOT NULL,
        razorpay_order_id TEXT UNIQUE NOT NULL,
        razorpay_payment_id TEXT UNIQUE,
        editor_slug TEXT UNIQUE,
        email_sent_status INTEGER DEFAULT 0,
        whatsapp_sent_status INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating orders table:', err);
      } else {
        console.log('Orders database schema initialized successfully.');
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        focus_area TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating inquiries table:', err);
      } else {
        console.log('Inquiries database schema initialized successfully.');
      }
    });
  });
}

/**
 * Creates a new pre-payment order record in the DB
 */
function createPendingOrder({ customer_name, email, whatsapp, event_title, template_id, amount_paid, razorpay_order_id }) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO orders (customer_name, email, whatsapp, event_title, template_id, amount_paid, razorpay_order_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [customer_name, email, whatsapp, event_title, template_id, amount_paid, razorpay_order_id], function(err) {
      if (err) {
        console.error('Database insertion error:', err);
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

/**
 * Updates an order once payment is successfully verified
 */
function confirmOrderPayment({ razorpay_order_id, razorpay_payment_id, editor_slug }) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE orders 
      SET razorpay_payment_id = ?, editor_slug = ?
      WHERE razorpay_order_id = ?
    `;
    db.run(query, [razorpay_payment_id, editor_slug, razorpay_order_id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
}

/**
 * Fetches order details by its order ID
 */
function getOrderByOrderId(razorpay_order_id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM orders WHERE razorpay_order_id = ?', [razorpay_order_id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Fetches order details by editor slug
 */
function getOrderBySlug(editor_slug) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM orders WHERE editor_slug = ?', [editor_slug], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Updates sending status for email/WhatsApp logs
 */
function updateNotificationStatus(order_id, type, status) {
  return new Promise((resolve, reject) => {
    const column = type === 'email' ? 'email_sent_status' : 'whatsapp_sent_status';
    const query = `UPDATE orders SET ${column} = ? WHERE id = ?`;
    db.run(query, [status ? 1 : -1, order_id], function(err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
}

/**
 * Creates a new inquiry submission record in the DB
 */
function createInquiry({ customer_name, email, whatsapp, brand_name, focus_area, message }) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO inquiries (customer_name, email, whatsapp, brand_name, focus_area, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [customer_name, email, whatsapp, brand_name, focus_area, message], function(err) {
      if (err) {
        console.error('Database insertion error for inquiry:', err);
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

module.exports = {
  createPendingOrder,
  confirmOrderPayment,
  getOrderByOrderId,
  getOrderBySlug,
  updateNotificationStatus,
  createInquiry
};
