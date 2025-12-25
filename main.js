import './style.css'
import { ambilDataProduk } from './data.js'

// --- STATE GLOBAL ---
let semuaProduk = [];
let dataTampil = []; 
let keranjang = [];
let produkTerpilih = null; 
let pilihanWarna = null;
let pilihanSize = null;
let limitTampil = 8; // Limit produk awal

// Helper
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
const convertLink = (link) => {
  if (link.includes('drive.google.com')) {
    const id = link.match(/\/d\/(.+?)\//);
    return id ? `https://drive.google.com/uc?export=view&id=${id[1]}` : link;
  }
  return link;
}

// 1. SETUP HTML
document.querySelector('#app').innerHTML = `
  <header>
    <div class="header-main">
      <div class="header-wrapper">
        <div class="logo" onclick="keHome()">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
           AndraStore
        </div>
        
        <div class="search-box">
          <input type="text" id="searchInput" placeholder="Cari baju...">
        </div>

        <div class="header-cart" onclick="bukaKeranjang()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <div id="badgeCart" class="header-cart-badge">0</div>
        </div>
      </div>
    </div>
  </header>

  <div id="viewHome" class="main-content">
    <div class="container">
      <div class="banner"><h2>FLASH SALE ⚡</h2><p>Spesial Hari Ini!</p></div>
      
      <div class="kategori-menu">
        <button class="btn-kategori active" onclick="filterProduk('all', this)">Semua</button>
        <button class="btn-kategori" onclick="filterProduk('Jaket', this)">Jaket</button>
        <button class="btn-kategori" onclick="filterProduk('Kaos', this)">Kaos</button>
        <button class="btn-kategori" onclick="filterProduk('Celana', this)">Celana</button>
      </div>
      
      <div id="produk-container" class="grid-produk"></div>
      
      <div id="btnLoadMoreArea" class="load-more-container" style="display:none;">
        <button class="btn-loadmore" onclick="muatLebihBanyak()">Muat Lebih Banyak</button>
      </div>

      <div id="empty-state" style="display:none; text-align:center; padding:50px;">Produk tidak ditemukan</div>
    </div>
  </div>

  <div id="viewDetail" class="main-content" style="display:none;">
    <div class="container detail-page">
      <div onclick="keHome()" class="btn-kembali">← Kembali Belanja</div>
      <div id="kontenDetail"></div>
    </div>
  </div>

  <div id="modalKeranjang" class="modal-overlay">
    <div class="modal-content">
      <span class="modal-close" onclick="tutupKeranjang()">&times;</span>
      <h3>Keranjang Belanja</h3>
      <div id="listBelanjaan" class="cart-items"></div>
      <div id="formArea"></div>
      <div class="cart-total" style="margin-top:10px;">Total: <span id="totalHarga">Rp 0</span></div>
      <button onclick="checkoutWA()" class="btn-checkout">Checkout via WA</button>
    </div>
  </div>
`

// 2. NAVIGASI
window.keHome = () => {
  document.getElementById('viewHome').style.display = 'block';
  document.getElementById('viewDetail').style.display = 'none';
  window.scrollTo(0,0);
}
window.keDetail = () => {
  document.getElementById('viewHome').style.display = 'none';
  document.getElementById('viewDetail').style.display = 'block';
  window.scrollTo(0,0);
}

// 3. LOGIC RENDER & LOAD MORE
const renderProduk = (data, reset = true) => {
  const container = document.getElementById('produk-container');
  const btnLoad = document.getElementById('btnLoadMoreArea');
  
  if (reset) {
    container.innerHTML = '';
    limitTampil = 8; 
    dataTampil = data; 
  }

  if (dataTampil.length === 0) {
    document.getElementById('empty-state').style.display = 'block';
    btnLoad.style.display = 'none';
    return;
  } else { document.getElementById('empty-state').style.display = 'none'; }

  const yangMauDitampil = dataTampil.slice(0, limitTampil);

  container.innerHTML = ''; 
  yangMauDitampil.forEach(item => {
    let hargaHTML = `<span class="harga-jual">${formatRupiah(item.harga_jual)}</span>`;
    if (item.harga_asli > item.harga_jual) {
      hargaHTML = `<span class="harga-coret">${formatRupiah(item.harga_asli)}</span>` + hargaHTML;
    }
    const firstImg = item.gambar.split(',')[0].trim();

    const card = `
      <div class="card" onclick="bukaDetailProduk(${item.id})">
        <div class="card-img-wrapper">
          <img src="${convertLink(firstImg)}" loading="lazy">
        </div>
        <div class="card-body">
          <span class="label-kategori">${item.kategori}</span>
          <h4>${item.nama}</h4>
          <div style="margin-bottom:5px;">${hargaHTML}</div>
          <button class="btn-lihat">Lihat Produk</button>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });

  if (limitTampil < dataTampil.length) {
    btnLoad.style.display = 'block';
  } else {
    btnLoad.style.display = 'none';
  }
}

window.muatLebihBanyak = () => {
  limitTampil += 8; 
  const container = document.getElementById('produk-container');
  const btnLoad = document.getElementById('btnLoadMoreArea');
  
  const currentCount = container.children.length;
  const nextBatch = dataTampil.slice(currentCount, limitTampil);

  nextBatch.forEach(item => {
    let hargaHTML = `<span class="harga-jual">${formatRupiah(item.harga_jual)}</span>`;
    if (item.harga_asli > item.harga_jual) {
      hargaHTML = `<span class="harga-coret">${formatRupiah(item.harga_asli)}</span>` + hargaHTML;
    }
    const firstImg = item.gambar.split(',')[0].trim();
    const card = `
      <div class="card" onclick="bukaDetailProduk(${item.id})">
        <div class="card-img-wrapper"><img src="${convertLink(firstImg)}" loading="lazy"></div>
        <div class="card-body">
          <span class="label-kategori">${item.kategori}</span>
          <h4>${item.nama}</h4>
          <div style="margin-bottom:5px;">${hargaHTML}</div>
          <button class="btn-lihat">Lihat Produk</button>
        </div>
      </div>
    `;
    container.innerHTML += card; 
  });

  if (limitTampil >= dataTampil.length) {
    btnLoad.style.display = 'none';
  }
}

// 4. DETAIL PAGE
window.bukaDetailProduk = (id) => {
  const item = semuaProduk.find(p => p.id == id);
  produkTerpilih = item;
  pilihanWarna = null; pilihanSize = null;

  const warnas = item.warna ? item.warna.split(',').map(s => s.trim()) : [];
  const sizes = item.size ? item.size.split(',').map(s => s.trim()) : [];
  const gambars = item.gambar.split(',').map(s => s.trim());
  produkTerpilih.listGambar = gambars;

  let warnaHTML = warnas.length > 0 ? `<div class="varian-section"><div class="varian-title">Pilih Warna</div><div class="varian-wrapper">` : '';
  warnas.forEach((w, i) => warnaHTML += `<button class="btn-varian" onclick="pilihVarian('warna', '${w}', this, ${i})">${w}</button>`);
  if(warnas.length > 0) warnaHTML += `</div></div>`;

  let sizeHTML = sizes.length > 0 ? `<div class="varian-section"><div class="varian-title">Pilih Ukuran</div><div class="varian-wrapper">` : '';
  sizes.forEach(s => sizeHTML += `<button class="btn-varian" onclick="pilihVarian('size', '${s}', this)">${s}</button>`);
  if(sizes.length > 0) sizeHTML += `</div></div>`;

  let hargaHTML = `<span class="detail-price">${formatRupiah(item.harga_jual)}</span>`;
  if (item.harga_asli > item.harga_jual) {
    hargaHTML = `<span class="detail-coret">${formatRupiah(item.harga_asli)}</span> ` + hargaHTML;
  }

  let deskripsiPanjang = item.deskripsi || '-';
  deskripsiPanjang = deskripsiPanjang.replace(/\|/g, '<br>'); 

  const konten = document.getElementById('kontenDetail');
  konten.innerHTML = `
    <div class="detail-grid">
      <div class="detail-img-wrapper"><img id="imgDetail" src="${convertLink(gambars[0])}" class="detail-img"></div>
      <div class="detail-info">
        <h1>${item.nama}</h1>
        <div class="detail-price-box">${hargaHTML}</div>
        <div class="detail-desc"><div class="varian-title">Deskripsi</div>${deskripsiPanjang}</div>
        ${warnaHTML} ${sizeHTML}
        <div class="detail-actions">
          <button class="btn-add-cart" onclick="masukinKeranjang()">+ Masukkan Keranjang</button>
        </div>
      </div>
    </div>
  `;
  keDetail();
}

window.pilihVarian = (tipe, nilai, el, index = 0) => {
  el.parentElement.querySelectorAll('.btn-varian').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  if (tipe === 'warna') {
    pilihanWarna = nilai;
    if (produkTerpilih.listGambar && produkTerpilih.listGambar[index]) {
      const img = document.getElementById('imgDetail');
      img.style.opacity = 0.5;
      setTimeout(() => { img.src = convertLink(produkTerpilih.listGambar[index]); img.style.opacity = 1; }, 200);
    }
  }
  if (tipe === 'size') pilihanSize = nilai;
}

// 5. KERANJANG
window.masukinKeranjang = () => {
  const item = produkTerpilih;
  if ((item.warna && !pilihanWarna) || (item.size && !pilihanSize)) { alert('Pilih varian dulu ya!'); return; }
  
  const varianLabel = `${pilihanWarna || ''} ${pilihanSize || ''}`.trim();
  const cartId = `${item.id}-${varianLabel}`;
  const existing = keranjang.find(i => i.cartId === cartId);
  
  if (existing) existing.qty++;
  else keranjang.push({ ...item, cartId, varian: varianLabel, qty: 1 });

  updateTampilanKeranjang();
  alert('Masuk keranjang! 🛒');
  keHome();
}

const updateTampilanKeranjang = () => {
  const qty = keranjang.reduce((a, b) => a + b.qty, 0);
  const badge = document.getElementById('badgeCart');
  badge.innerText = qty;
  badge.style.display = qty > 0 ? 'flex' : 'none';
}

window.bukaKeranjang = () => {
  const list = document.getElementById('listBelanjaan');
  list.innerHTML = '';
  let total = 0;
  keranjang.forEach((item, idx) => {
    const sub = item.harga_jual * item.qty;
    total += sub;
    list.innerHTML += `
      <div class="cart-item">
        <div><strong>${item.nama}</strong> ${item.varian ? '<br><small>'+item.varian+'</small>' : ''}<br><small>${item.qty} x ${formatRupiah(item.harga_jual)}</small></div>
        <div><b>${formatRupiah(sub)}</b><button onclick="hapusItem(${idx})" style="border:none; bg:none; color:red; margin-left:8px; cursor:pointer;">✕</button></div>
      </div>`;
  });

  const formArea = document.getElementById('formArea');
  if (formArea.innerHTML === '') {
    formArea.innerHTML = `
      <div style="margin-top:15px; border-top:1px dashed #eee; padding-top:15px;">
        <label style="font-size:0.85rem; font-weight:700;">Nama Penerima</label>
        <input type="text" id="namaPembeli" placeholder="Nama Lengkap..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:6px; margin:5px 0 10px;">
        <label style="font-size:0.85rem; font-weight:700;">Alamat Lengkap</label>
        <textarea id="alamatPembeli" placeholder="Jalan, RT/RW, Kota..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:6px; margin:5px 0 10px; height:60px;"></textarea>
      </div>`;
  }
  document.getElementById('totalHarga').innerText = formatRupiah(total);
  document.getElementById('modalKeranjang').style.display = 'flex';
}

window.hapusItem = (idx) => {
  keranjang.splice(idx, 1);
  updateTampilanKeranjang();
  bukaKeranjang();
  if (keranjang.length === 0) tutupKeranjang();
}
window.tutupKeranjang = () => document.getElementById('modalKeranjang').style.display = 'none';

window.checkoutWA = () => {
  if (keranjang.length === 0) return;
  const nama = document.getElementById('namaPembeli').value;
  const alamat = document.getElementById('alamatPembeli').value;
  if (!nama || !alamat) { alert("Nama & Alamat wajib diisi!"); return; }

  let text = `Hi kak, saya mau order.\n\n`;
  let totalBelanja = 0;
  keranjang.forEach((item, i) => {
    const sub = item.harga_jual * item.qty;
    totalBelanja += sub;
    text += `${i+1}. *${item.nama}*\nJumlah : ${item.qty}\n${item.varian ? 'Varian : '+item.varian+'\n' : ''}Harga Total : ${formatRupiah(sub)}\n\n`;
  });
  text += `----------------------------------\nSubtotal : ${formatRupiah(totalBelanja)}\nOngkir : (Cek Admin)\n*TOTAL : ${formatRupiah(totalBelanja)}* (Belum Ongkir)\n----------------------------------\n\n*Nama :*\n${nama}\n\n*Alamat :*\n${alamat}\n\n*Pembayaran :*\nTransfer BCA / DANA (Info Admin)`;
  
  // --- NOMOR WA ANDRA (FIXED) ---
  const noWA = "6281234567890"; 
  
  window.open(`https://wa.me/${noWA}?text=${encodeURIComponent(text)}`);
}

// INITIALIZE
async function init() {
  semuaProduk = await ambilDataProduk();
  renderProduk(semuaProduk);
}
window.filterProduk = (k, el) => {
  document.querySelectorAll('.btn-kategori').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  const filtered = k === 'all' ? semuaProduk : semuaProduk.filter(p => p.kategori === k);
  renderProduk(filtered, true);
}
document.getElementById('searchInput').addEventListener('input', (e) => {
  renderProduk(semuaProduk.filter(p => p.nama.toLowerCase().includes(e.target.value.toLowerCase())));
});

init();