// all the packages and experiences live in one array so every page can use them
const items = [
  {id:'gamer-pass', name:'Ultimate Gamer Pass', type:'Package', price:1500, purpose:'Unlimited gaming access for a full day.', includes:['PC gaming','Console gaming','High-speed internet','Snack voucher','Tournament entry']},
  {id:'vip', name:'VIP Gaming Experience', type:'Package', price:1500, purpose:'Premium gaming experience with exclusive facilities.', includes:['Private gaming booth','Premium gaming equipment','Food and drinks','Priority booking','Personal gaming assistant']},
  {id:'training', name:'Esports Training Package', type:'Package', price:1500, purpose:'Improve competitive gaming skills with professional coaching.', includes:['Strategy coaching','Team communication','Match analysis','Practice sessions','Performance feedback']},
  {id:'birthday', name:'Birthday Party Package', type:'Package', price:1500, purpose:'Host a gaming-themed birthday celebration.', includes:['Reserved gaming area','Multiplayer competitions','Party decorations','Catering','Tournament prizes']},
  {id:'vr', name:'Virtual Reality Experience', type:'Experience', price:750, purpose:'Explore immersive virtual reality games.', includes:['VR headset','Choice of games','Staff assistance']},
  {id:'racing', name:'Racing Simulator Challenge', type:'Experience', price:750, purpose:'Race on professional driving simulators.', includes:['Racing simulator','Choice of tracks','Leaderboard competition']},
  {id:'escape', name:'Escape Room Challenge', type:'Experience', price:750, purpose:'Solve puzzles and escape before time runs out.', includes:['Team challenge','Themed escape room','Digital scorecard']}
];

// nav bar with the drop-down menu (same on every page)
const pages = [['index.html','Home'],['about.html','About Us'],['fees.html','Calculate Fees'],['contact.html','Contact']];
function buildNav() {
  let links = '';
  for (let p of pages.slice(0, 2)) links += `<a href="${p[0]}">${p[1]}</a>`;
  links += '<div class="dropdown"><a href="packages.html">Packages &#9662;</a><div class="dropdown-menu">';
  for (let i of items) links += `<a href="details.html?id=${i.id}">${i.name}</a>`;
  links += '</div></div>';
  for (let p of pages.slice(2)) links += `<a href="${p[0]}">${p[1]}</a>`;
  document.getElementById('nav').innerHTML = `<a class="logo" href="index.html">NEXT<b>LEVEL</b></a><nav>${links}</nav>`;
}
buildNav();

function money(n) { return 'R' + n.toFixed(2); }

// packages page: two lists with links + a table
function buildPackages() {
  const pl = document.getElementById('packageList');
  if (!pl) return;
  const el = document.getElementById('experienceList');
  const tbody = document.querySelector('#priceTable tbody');
  for (let i of items) {
    const card = `<a class="card" href="details.html?id=${i.id}"><h3>${i.name}</h3><p>${i.purpose}</p><p>${money(i.price)}</p></a>`;
    (i.type === 'Package' ? pl : el).innerHTML += card;
    tbody.innerHTML += `<tr><td>${i.name}</td><td>${i.type}</td><td>${money(i.price)}</td></tr>`;
  }
}
buildPackages();

// details page: one page that loads whichever item is in the url (?id=vr)
function buildDetails() {
  const box = document.getElementById('details');
  if (!box) return;
  const id = new URLSearchParams(location.search).get('id');
  const item = items.find(x => x.id === id);
  if (!item) { box.innerHTML = '<h2>Not found</h2><p>That package does not exist. <a href="packages.html">Back to packages</a></p>'; return; }
  document.title = item.name;
  let list = '';
  for (let inc of item.includes) list += `<li>${inc}</li>`;
  box.innerHTML = `<h2>${item.name}</h2><div class="card"><p><b>Fee:</b> ${money(item.price)}</p><p><b>Purpose:</b> ${item.purpose}</p><h3>Includes</h3><ul>${list}</ul></div><p><a class="btn" href="fees.html">Add to quote</a></p>`;
}
buildDetails();

// fees page
let selected = []; // the customer's selection is stored in this array
function buildFees() {
  const checks = document.getElementById('checks');
  if (!checks) return;
  for (let i of items) checks.innerHTML += `<div class="check"><input type="checkbox" id="${i.id}" value="${i.id}"><label for="${i.id}" style="margin:0">${i.name} (${money(i.price)})</label></div>`;
  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('requestBtn').addEventListener('click', requestConsultant);
}
buildFees();

function getSelected() {
  selected = [];
  for (let i of items) if (document.getElementById(i.id).checked) selected.push(i);
  return selected;
}
function discountFor(count) {
  if (count === 1) return 0;
  if (count === 2) return 0.05;
  if (count === 3) return 0.10;
  return 0.15; // more than three
}
function calculate() {
  const err = document.getElementById('error');
  err.textContent = '';
  getSelected();
  if (selected.length === 0) { err.textContent = 'Please tick at least one package or experience.'; return; }
  let subtotal = 0;
  for (let s of selected) subtotal += s.price;
  const rate = discountFor(selected.length);
  const discount = subtotal * rate;
  const afterDiscount = subtotal - discount;
  const vat = afterDiscount * 0.15;
  let rows = '';
  for (let s of selected) rows += `<tr><td>${s.name}</td><td>${money(s.price)}</td></tr>`;
  document.getElementById('result').innerHTML = `<h3>Your quote</h3><div class="tablebox"><table><tbody>${rows}
    <tr><td>Subtotal</td><td>${money(subtotal)}</td></tr>
    <tr><td>Discount (${rate * 100}%)</td><td>-${money(discount)}</td></tr>
    <tr><td>VAT (15%)</td><td>${money(vat)}</td></tr>
    <tr><th>Total</th><th>${money(afterDiscount + vat)}</th></tr></tbody></table></div>
    <p>This is a quote only, not an invoice.</p>`;
}
function requestConsultant() {
  const err = document.getElementById('error');
  const name = document.getElementById('cname').value.trim();
  const phone = document.getElementById('cphone').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const time = document.getElementById('ctime').value;
  // error handling: check each field type
  if (!/^[A-Za-z' -]{2,}$/.test(name)) { err.textContent = 'Name must be letters only (at least 2).'; return; }
  if (!/^0\d{9}$/.test(phone)) { err.textContent = 'Phone must be 10 digits and start with 0.'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Please enter a valid email address.'; return; }
  if (time === '') { err.textContent = 'Please choose a contact time.'; return; }
  if (getSelected().length === 0) { err.textContent = 'Please tick at least one package or experience.'; return; }
  err.textContent = '';
  calculate();
  document.getElementById('result').innerHTML += `<p>Thanks ${name}! A consultant will contact you in the ${time.toLowerCase()} to confirm your booking and send an invoice.</p>`;
}
