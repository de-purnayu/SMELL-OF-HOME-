import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "https://qvoeypwdsckwwnvoktdy.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_Pm5YEfhrWwL7PaE3i8sMbA_OmdmSvgF";
const supabase = createClient(supabaseUrl, supabaseKey);

const db = new Database("cakes.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image_url TEXT,
    ingredients TEXT,
    is_featured INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    product_name TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insert = db.prepare("INSERT INTO products (name, description, price, category, image_url, ingredients, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)");
  const cakes = [
    ["Almond Chocolate Truffle", "Rich, moist chocolate cake topped with crunchy almonds and a golden 'Happy Birthday' wish.", 650, "Chocolate", "https://image2url.com/r2/default/images/1773226984144-7f345b06-9822-4b21-959f-f42e31280280.png", "Flour, Cocoa, Butter, Sugar, Eggs, Dark Chocolate, Roasted Almonds", 1],
    ["Traditional Saree Doll Cake", "A beautiful handcrafted cake featuring a traditional saree-clad figurine, perfect for mothers and grandmothers.", 950, "Custom", "https://image2url.com/r2/default/images/1773227058963-74aa938f-e831-4a95-9b79-573271915d10.png", "Flour, Buttermilk, Cream Cheese, Fondant Art", 1],
    ["Biscoff Anniversary Special", "Silky smooth Biscoff cream cake decorated with authentic Lotus Biscoff cookies and gold leaf accents.", 850, "Custom", "https://image2url.com/r2/default/images/1773227182831-b88c7fad-d015-4783-9c5d-f9b255a73ec1.png", "Flour, Biscoff Spread, Lotus Cookies, Butter, Milk", 1],
    ["Eggless Vanilla Bean Dream", "Classic vanilla cake with real Madagascar vanilla beans, made without eggs for a light and airy texture.", 550, "Eggless", "https://image2url.com/r2/default/images/1773226984144-7f345b06-9822-4b21-959f-f42e31280280.png", "Flour, Vanilla Beans, Butter, Milk, Yogurt", 1],
    ["Red Velvet Romance", "Silky red velvet layers with our signature cream cheese frosting.", 750, "Red Velvet", "https://image2url.com/r2/default/images/1773227058963-74aa938f-e831-4a95-9b79-573271915d10.png", "Flour, Buttermilk, Beetroot extract, Cream Cheese", 0]
  ];
  cakes.forEach(cake => insert.run(...cake));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/products/featured", (req, res) => {
    const products = db.prepare("SELECT * FROM products WHERE is_featured = 1").all();
    res.json(products);
  });

  app.post("/api/orders", async (req, res) => {
    const { first_name, last_name, email, street_address, city, zip_code, product_name, total_amount } = req.body;
    
    // 1. Save to Local SQLite (Backup)
    const info = db.prepare(`
      INSERT INTO orders (first_name, last_name, email, street_address, city, zip_code, product_name, total_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(first_name, last_name, email, street_address, city, zip_code, product_name, total_amount);

    // 2. Save to Supabase
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          { 
            first_name, 
            last_name, 
            email, 
            street_address, 
            city, 
            zip_code, 
            product_name, 
            total_amount, 
            status: 'pending'
          }
        ]);
      
      if (error) {
        console.error("Supabase Error:", error);
      } else {
        console.log("Order synced to Supabase:", data);
      }
    } catch (err) {
      console.error("Failed to sync to Supabase:", err);
    }

    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/admin/orders", async (req, res) => {
    // Try fetching from Supabase first
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return res.json(data);
      }
      console.error("Supabase Fetch Error:", error);
    } catch (err) {
      console.error("Failed to fetch from Supabase:", err);
    }

    // Fallback to SQLite
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    res.json(orders);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
