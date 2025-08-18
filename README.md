# 📕 Module 06 - Loops, Iteration and High Order Array Methods - Lesson 12. Array Method — Mini Store Analytics Dashboard

## 🎯 Goal
In this capstone project, you will combine **all array iteration methods** you learned (`for...in`, `for...of`, `forEach`, `map`, `filter`, `reduce`) into a single program.  
The project simulates a **mini store analytics dashboard** that handles product data, orders, and reporting.

---

## 🗂 Features
1. **Configuration Logging**  
   - Iterate over settings with `for...in` (using `hasOwnProperty`).  
   - Display each line with `forEach`.

2. **Product Cards (Mapping)**  
   - Transform raw product objects into UI-friendly card data using `map`.  
   - Cards include formatted prices, stock badges, and a highlight flag.

3. **Filtering Products**  
   - Filter cards using `filter` based on search query and stock availability.

4. **Order Totals (Reducing)**  
   - Use `reduce` to calculate revenue, units, totals per category, and revenue with tax.

5. **Report Rendering**  
   - Use `for...of` to print a formatted summary report with totals and featured products.

---

## 📦 Starter Data
```javascript
const config = {
  currency: "€",
  showOutOfStock: false,
  highlightCategory: "Electronics",
  taxRate: 0.2,
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
  { id: "A100", items: [{ productId: 1, qty: 1 }, { productId: 3, qty: 1 }], createdAt: "2025-08-10" },
  { id: "A101", items: [{ productId: 5, qty: 3 }, { productId: 6, qty: 5 }], createdAt: "2025-08-11" },
  { id: "A102", items: [{ productId: 3, qty: 1 }, { productId: 4, qty: 2 }], createdAt: "2025-08-12" },
  { id: "A103", items: [{ productId: 2, qty: 1 }],                           createdAt: "2025-08-12" },
];
```

---

## 📝 Full Solution Code
```javascript
const fmtMoney = (n, currency = config.currency) => `${currency}${n.toFixed(2)}`;

// Step 1 — Config Logging (for...in + forEach)
function logConfig(cfg) {
  const lines = [];
  for (const key in cfg) {
    if (Object.prototype.hasOwnProperty.call(cfg, key)) {
      lines.push(`${key}: ${cfg[key]}`);
    }
  }
  lines.forEach(line => console.log(line));
}
console.log("— CONFIG —");
logConfig(config);

// Step 2 — Map Products into Cards
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

// Step 3 — Filter Products
function filterCards(cards, { query = "", showOutOfStock = false } = {}) {
  const q = query.trim().toLowerCase();
  return cards
    .filter(c => (showOutOfStock ? true : c.inStock))
    .filter(c => (q ? (c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) : true));
}
const visibleCards = filterCards(cards, { query: "electronics", showOutOfStock: config.showOutOfStock });
console.log("\n— VISIBLE CARDS (filtered) —");
visibleCards.forEach(c => console.log(`${c.title} • ${c.priceLabel} • ${c.badge}`));

// Step 4 — Reduce Orders into Totals
const byId = id => products.find(p => p.id === id);
function computeTotals(orders) {
  const base = { revenue: 0, units: 0, totalsByCategory: {} };
  const out = orders.reduce((acc, order) => {
    return order.items.reduce((acc2, item) => {
      const product = byId(item.productId);
      if (!product) return acc2;
      const line = product.price * item.qty;
      acc2.revenue += line;
      acc2.units += item.qty;
      acc2.totalsByCategory[product.category] = (acc2.totalsByCategory[product.category] || 0) + line;
      return acc2;
    }, acc);
  }, base);
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

// Step 5 — Render Report (for...of)
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
```

---

## ✅ Learning Outcomes
- **`for...in`**: Iterate object keys, use `hasOwnProperty` safeguard.  
- **`forEach`**: Side-effect logging.  
- **`map`**: Transform product data into UI cards.  
- **`filter`**: Apply search query & stock filtering.  
- **`reduce`**: Aggregate totals by category and compute revenue.  
- **`for...of`**: Render final report output.  

---

## 🌶️ Stretch Ideas
1. Add **date filtering** for orders.  
2. Compute **top-selling product** using `reduce`.  
3. Sort cards by price or name before rendering.  
4. Warn if any config key is missing during validation.

---

## 📚 References
- [MDN Web Docs: Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- *Eloquent JavaScript* by Marijn Haverbeke
- *You Don’t Know JS* by Kyle Simpson
