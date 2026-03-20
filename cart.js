/* ══════════════════════════════
   LUMÉ STORE — Shared Cart Logic
   cart.js — include on every page
══════════════════════════════ */

const PRODUCTS = [
  { id:1,  name:'Linen Blazer',       sub:'Relaxed summer cut',       price:189, emoji:'🧥', tag:'New'  },
  { id:2,  name:'Ceramic Pour-Over',  sub:'Hand-glazed stoneware',    price:64,  emoji:'☕', tag:'Hot'  },
  { id:3,  name:'Leather Tote',       sub:'Full-grain, natural tan',  price:225, emoji:'👜', tag:null   },
  { id:4,  name:'Bamboo Sunglasses',  sub:'UV400, eco-polarised',     price:78,  emoji:'🕶️', tag:'New'  },
  { id:5,  name:'Merino Scarf',       sub:'110cm, double-sided',      price:95,  emoji:'🧣', tag:null   },
  { id:6,  name:'Walnut Desk Clock',  sub:'Minimalist silent sweep',  price:112, emoji:'🕰️', tag:'Sale' },
  { id:7,  name:'Linen Throw',        sub:'Washed, 130×180cm',        price:82,  emoji:'🛋️', tag:null   },
  { id:8,  name:'Herb Seed Kit',      sub:'6 varieties, organic',     price:38,  emoji:'🌿', tag:'Hot'  },
  { id:9,  name:'Terrazzo Planter',   sub:'Handcast, 14cm pot',       price:52,  emoji:'🪴', tag:null   },
  { id:10, name:'Soy Candle Trio',    sub:'Cedar, fig & salt air',    price:58,  emoji:'🕯️', tag:'Sale' },
  { id:11, name:'Canvas Sneakers',    sub:'Vulcanised sole, ecru',    price:142, emoji:'👟', tag:null   },
  { id:12, name:'Linen Pillowcase',   sub:'Set of 2, stone-washed',   price:45,  emoji:'🛏️', tag:'New'  },
];

/* ── Cart stored in sessionStorage so it persists across pages ── */
function getCart() {
  try { return JSON.parse(sessionStorage.getItem('lume_cart')) || []; }
  catch { return []; }
}
function saveCart(cart) {
  sessionStorage.setItem('lume_cart', JSON.stringify(cart));
}

function cartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

function cartTotal() {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}

function addToCart(id) {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  updateBadges();
  return product;
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  updateBadges();
}

function removeItem(id) {
  saveCart(getCart().filter(i => i.id !== id));
  updateBadges();
}

function clearCart() {
  sessionStorage.removeItem('lume_cart');
  updateBadges();
}

function updateBadges() {
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = cartCount();
  });
}

/* ── Toast ── */
function showToast(icon, t1, t2) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-t1').textContent = t1;
  document.getElementById('toast-t2').textContent = t2;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ── Pricing helpers ── */
function calcShipping(sub) { return sub >= 500 ? 0 : 60; }
function calcTax(sub) { return Math.round(sub * 0.18); }
function calcGrand(sub) { return sub + calcShipping(sub) + calcTax(sub); }

/* ── Run on load ── */
document.addEventListener('DOMContentLoaded', updateBadges);
