//TODO 📕 Module 06 - Loops, Iteration and High Order Array Methods - Lesson 12. Array Method Challenge

//! Since we want to practice all array methods + loops (for...of, for...in, forEach, map, filter, reduce), the project needs to be:
//  • Practical (something you could imagine using).
//  • Rich in data (so we can transform, filter, and summarize).
//  • Simple enough to code step by step.

//TODO  🔥 Capstone: Mini Store Analytics Dashboard

//* 🎯 Goal

//  Build a small analytics script for an online shop. Given a set of **products** and **orders**, your program will:
//  • Validate & log configuration (uses `for...in`, `forEach`)
//  • Prepare UI-ready product cards (uses `map`)
//  • Filter based on search and stock flags (uses `filter`)
//  • Compute totals (overall revenue, units, and per category) (uses `reduce`)
//  • Render summaries line-by-line (uses `for...of`)


//! 🧮 Solution Data & Code

const config = {
    currency: "€",
    showOutOfStock: false,
    highlightCategory: "Electronics",
    taxRate: 0.2, // 20%
};

const products = [
    { id: 1, name: "Laptop Pro 15", category: "Electronics", price: 1499.99, inStock: true },
    { id: 2, name: "Wireless Mouse", category: "Electronics", price: 24.5,    inStock: false },
    { id: 3, name: "Mechanical Keyboard", category: "Electronics", price: 79, inStock: true },
    { id: 4, name: "Water Bottle", category: "Lifestyle", price: 12,         inStock: true },
    { id: 5, name: "Notebook", category: "Stationery", price: 4.5,           inStock: true },
    { id: 6, name: "Pencil", category: "Stationery", price: 1.2,             inStock: true },
];

const orders = [
  // order: items = [{ productId, qty }]
    { id: "A100", items: [{ productId: 1, qty: 1 }, { productId: 3, qty: 1 }], createdAt: "2025-08-10" },
    { id: "A101", items: [{ productId: 5, qty: 3 }, { productId: 6, qty: 5 }], createdAt: "2025-08-11" },
    { id: "A102", items: [{ productId: 3, qty: 1 }, { productId: 4, qty: 2 }], createdAt: "2025-08-12" },
    { id: "A103", items: [{ productId: 2, qty: 1 }], createdAt: "2025-08-12" }, // OOS
];

// ====== Utilities ======
const fmtMoney = (n, currency = config.currency) => `${currency}${n.toFixed(2)}`;

// ====== Step 1 — Read & Validate Config (for...in + forEach) ======
// - Use for...in to iterate config keys.
// - Use hasOwnProperty to ignore prototype keys.
// - Use forEach to log "key: value" (as a side effect).
function logConfig(cfg) {
    const lines = [];
    for (const key in cfg) {
        if (Object.prototype.hasOwnProperty.call(cfg, key)) {
        lines.push(`${key}: ${cfg[key]}`);
        }
    }
    lines.forEach(line => console.log(line)); // side effect
}
console.log("— CONFIG —");
logConfig(config);

// ====== Step 2 — Map products into UI card data (map) ======
// Return an array of objects: { id, title, priceLabel, badge, isHighlighted }
function mapToCards(products) {
    return products.map(p => {
        const priceLabel = fmtMoney(p.price);
        const badge = p.inStock ? "In Stock" : "Out of Stock";
        const isHighlighted = p.category === config.highlightCategory;
        return { id: p.id, title: p.name, priceLabel, badge, isHighlighted, category: p.category, inStock: p.inStock };
    });
}

const cards = mapToCards(products);
console.log("\n— CARDS (mapped) —");
cards.forEach(c => console.log(`${c.title} • ${c.priceLabel} • ${c.badge}${c.isHighlighted ? " • ⭐" : ""}`));

// ====== Step 3 — Filter by search & stock (filter) ======
// Implement: filterCards(cards, { query, showOutOfStock })
function filterCards(cards, { query = "", showOutOfStock = false } = {}) {
    const q = query.trim().toLowerCase();
    return cards
        .filter(c => (showOutOfStock ? true : c.inStock))
        .filter(c => (q ? (c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) : true));
}

// Demo search: electronics only, hide out of stock (from config)
const visibleCards = filterCards(cards, { query: "electronics", showOutOfStock: config.showOutOfStock });
console.log("\n— VISIBLE CARDS (filtered) —");
visibleCards.forEach(c => console.log(`${c.title} • ${c.priceLabel} • ${c.badge}`));

// ====== Step 4 — Compute order totals (reduce) ======
// 1) Helper to find product by id
const byId = id => products.find(p => p.id === id);

// 2) Compute grand totals across all orders:
//    - revenue (sum of price * qty)
//    - units (sum of qty)
//    - totalsByCategory (money per category)
//    - revenueWithTax (apply config.taxRate at the end)
function computeTotals(orders) {
    const base = { revenue: 0, units: 0, totalsByCategory: {} };

    const out = orders.reduce((acc, order) => {
        // each order has items -> reduce each item into acc
        return order.items.reduce((acc2, item) => {
        const product = byId(item.productId);
        if (!product) return acc2;

        const line = product.price * item.qty;
        acc2.revenue += line;
        acc2.units += item.qty;
        acc2.totalsByCategory[product.category] =
            (acc2.totalsByCategory[product.category] || 0) + line;
        return acc2;
        }, acc);
    }, base);

    // round once at the end
    out.revenue = Number(out.revenue.toFixed(2));
    for (const cat in out.totalsByCategory) {
        out.totalsByCategory[cat] = Number(out.totalsByCategory[cat].toFixed(2));
    }
    const revenueWithTax = Number((out.revenue * (1 + config.taxRate)).toFixed(2));
    return { ...out, revenueWithTax };
}

const totals = computeTotals(orders);
console.log("\n— TOTALS (reduced) —");
console.log(`Units: ${totals.units}`);
console.log(`Revenue: ${fmtMoney(totals.revenue)}`);
console.log(`Revenue (with tax): ${fmtMoney(totals.revenueWithTax)}`);
console.log("By Category:", totals.totalsByCategory);

// ====== Step 5 — Render a concise report (for...of) ======
// Use for...of to iterate arrays cleanly and format lines.
function renderReport(cards, totals) {
    console.log("\n— REPORT —");
    console.log(`Products shown: ${cards.length}`);
    console.log(`Total units sold: ${totals.units}`);
    console.log(`Revenue (net): ${fmtMoney(totals.revenue)}`);
    console.log(`Revenue (tax incl.): ${fmtMoney(totals.revenueWithTax)}`);
    console.log("Categories:");
    for (const [cat, amount] of Object.entries(totals.totalsByCategory)) {
        console.log(`  - ${cat}: ${fmtMoney(amount)}`);
    }

    console.log("\nFeatured Products:");
    for (const card of cards) {
        const star = card.isHighlighted ? "⭐ " : "";
        console.log(`  ${star}${card.title} — ${card.priceLabel} (${card.badge})`);
    }
}

renderReport(visibleCards, totals);

//  ‼️ Feedback:

//* ✅ What You’ve Practiced (and where)
//  • `for...in` → `logConfig` to iterate object keys (with `hasOwnProperty` guard).
//  • `forEach` → Side-effect logging of config lines and card lines.
//  • `map` → `mapToCards` transforms raw products into UI-ready card objects.
//  • `filter` → `filterCards` narrows by search text and in-stock visibility.
//  • `reduce` → `computeTotals` aggregates revenue, units, and per-category totals.
//  • `for...of` → `renderReport` to iterate report lines and `Object.entries(...)`.

//* 🧪 Mini Checklist (Run & Verify)
//  • Do you see a CONFIG block printed?
//  • Do you get a CARDS (mapped) list with prices and badges?
//  • Can you tweak `config.showOutOfStock` and see the VISIBLE CARDS change?
//  • Do totals show Units, Revenue, and By Category?
//  • Does the REPORT section list categories and featured products with a star ⭐?

//* 🌶️ Optional Stretch Ideas
//  1. Add date filters for `orders` (e.g., only include orders after `"2025-08-11"`).
//  2. Top seller: compute product with highest units sold using another `reduce`.
//  3. Sorting: sort `visibleCards` by price or name before rendering.
//  4. Config validation: if a config value is missing, warn using `for...in` and a small rules object.
