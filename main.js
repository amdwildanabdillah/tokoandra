import './style.css'
import { ambilDataProduk } from './data.js'

// --- STATE GLOBAL ---
let semuaProduk = [];
let dataTampil = []; 
let keranjang = [];
let produkTerpilih = null; 
let pilihanWarna = null;
let pilihanSize = null;
let limitTampil = 8;

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
        <div class="search-box"><input type="text" id="searchInput" placeholder="Cari baju..."></div>
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

  <div id="viewCheckout" class="main-content" style="display:none;">
    <div class="container checkout-container">
      <div onclick="keHome()" class="btn-kembali">← Tambah Barang Lagi</div>
      
      <div class="checkout-page">
        <div class="checkout-header">DETAIL PESANAN</div>
        
        <div class="checkout-body">
          <div id="listCheckout"></div> <hr style="border:0; border-top:1px dashed #e2e8f0; margin:20px 0;">

          <div class="form-group">
            <label class="form-label">Nama Lengkap</label>
            <input type="text" id="namaPembeli" class="form-input" placeholder="Masukkan Nama">
          </div>
          <div class="form-group">
            <label class="form-label">No WhatsApp</label>
            <input type="tel" id="waPembeli" class="form-input" placeholder="08xxxxx">
          </div>
          <div class="form-group">
            <label class="form-label">Alamat Lengkap</label>
            <textarea id="alamatPembeli" class="form-input form-textarea" placeholder="Jalan, RT/RW, Kecamatan, Kota, Kode Pos..."></textarea>
          </div>

          <div class="checkout-summary">
            <div class="summary-row"><span>Subtotal Produk</span> <span id="subtotalVal">Rp 0</span></div>
            <div class="summary-row"><span>Biaya Ongkir</span> <span>Cek Admin</span></div>
            <div class="summary-row"><span>Biaya Layanan</span> <span>Gratis</span></div>
            <div class="summary-row total"><span>TOTAL ESTIMASI</span> <span id="totalVal">Rp 0</span></div>
          </div>

          <button onclick="checkoutWA()" class="btn-pesan">PESAN SEKARANG</button>
        </div>
      </div>
    </div>
  </div>
`

// 2. NAVIGASI
window.keHome = () => {
  document.getElementById('viewHome').style.display = 'block';
  document.getElementById('viewDetail').style.display = 'none';
  document.getElementById('viewCheckout').style.display = 'none';
  window.scrollTo(0,0);
}
window.keDetail = () => {
  document.getElementById('viewHome').style.display = 'none';
  document.getElementById('viewDetail').style.display = 'block';
  document.getElementById('viewCheckout').style.display = 'none';
  window.scrollTo(0,0);
}
window.bukaKeranjang = () => {
  // Ganti fungsi bukaKeranjang jadi pindah halaman Checkout
  renderHalamanCheckout();
  document.getElementById('viewHome').style.display = 'none';
  document.getElementById('viewDetail').style.display = 'none';
  document.getElementById('viewCheckout').style.display = 'block';
  window.scrollTo(0,0);
}

// 3. RENDER CHECKOUT PAGE
const renderHalamanCheckout = () => {
  const list = document.getElementById('listCheckout');
  list.innerHTML = '';
  let total = 0;

  if (keranjang.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding:20px; color:#64748b;">Keranjang masih kosong nih.</div>';
    document.getElementById('subtotalVal').innerText = 'Rp 0';
    document.getElementById('totalVal').innerText = 'Rp 0';
    return;
  }

  keranjang.forEach((item, idx) => {
    const sub = item.harga_jual * item.qty;
    total += sub;
    const varianInfo = item.varian ? item.varian : '-';
    const firstImg = item.gambar.split(',')[0].trim(); // Ambil gambar pertama

    list.innerHTML += `
      <div class="checkout-item">
        <img src="${convertLink(firstImg)}">
        <div class="checkout-item-info">
          <div class="checkout-item-title">${item.nama}</div>
          <div class="checkout-item-variant">Varian: ${varianInfo}</div>
          <div class="checkout-item-price">${item.qty} x ${formatRupiah(item.harga_jual)}</div>
        </div>
        <div>
          <div style="font-weight:bold; font-size:0.9rem;">${formatRupiah(sub)}</div>
          <div class="checkout-delete" onclick="hapusItem(${idx})">Hapus</div>
        </div>
      </div>
    `;
  });

  document.getElementById('subtotalVal').innerText = formatRupiah(total);
  document.getElementById('totalVal').innerText = formatRupiah(total);
}

// 4. LOGIC RENDER PRODUK (Sama)
const renderProduk = (data, reset = true) => {
  const container = document.getElementById('produk-container');
  const btnLoad = document.getElementById('btnLoadMoreArea');
  
  if (reset) { container.innerHTML = ''; limitTampil = 8; dataTampil = data; }
  if (dataTampil.length === 0) {
    document.getElementById('empty-state').style.display = 'block'; btnLoad.style.display = 'none'; return;
  } else { document.getElementById('empty-state').style.display = 'none'; }

  const yangMauDitampil = dataTampil.slice(0, limitTampil);
  if (reset) container.innerHTML = ''; 
  
  yangMauDitampil.forEach(item => {
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

  if (limitTampil < dataTampil.length) btnLoad.style.display = 'block';
  else btnLoad.style.display = 'none';
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
  if (limitTampil >= dataTampil.length) btnLoad.style.display = 'none';
}

// 5. DETAIL PAGE (Sama)
window.bukaDetailProduk = (id) => {
  const item = semuaProduk.find(p => p.id == id);
  produkTerpilih = item;
  pilihanWarna = null; pilihanSize = null;

  const warnas = item.warna ? item.warna.split(',').map(s => s.trim()) : [];
  const sizes = item.size ? item.size.split(',').map(s => s.trim()) : [];
  const gambars = item.gambar.split(',').map(s => s.trim());
  produkTerpilih.listGambar = gambars;

  let warnaHTML = warnas.length > 0 ? `<div class="varian-section"><div class="varian-title">Pilih Warna</div>` : '';
  warnas.forEach((w, i) => warnaHTML += `<button class="btn-varian" onclick="pilihVarian('warna', '${w}', this, ${i})">${w}</button>`);
  if(warnas.length > 0) warnaHTML += `</div>`;

  let sizeHTML = sizes.length > 0 ? `<div class="varian-section"><div class="varian-title">Pilih Ukuran</div>` : '';
  sizes.forEach(s => sizeHTML += `<button class="btn-varian" onclick="pilihVarian('size', '${s}', this)">${s}</button>`);
  if(sizes.length > 0) sizeHTML += `</div>`;

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

// 6. KERANJANG & CHECKOUT
window.masukinKeranjang = () => {
  const item = produkTerpilih;
  if ((item.warna && !pilihanWarna) || (item.size && !pilihanSize)) { alert('Pilih varian dulu ya!'); return; }
  
  const varianLabel = `${pilihanWarna || ''} ${pilihanSize || ''}`.trim();
  const cartId = `${item.id}-${varianLabel}`;
  const existing = keranjang.find(i => i.cartId === cartId);
  
  if (existing) existing.qty++;
  else keranjang.push({ ...item, cartId, varian: varianLabel, qty: 1 });

  updateBadge();
  alert('Berhasil masuk keranjang! Silakan cek di pojok kanan atas.');
}

const updateBadge = () => {
  const qty = keranjang.reduce((a, b) => a + b.qty, 0);
  const badge = document.getElementById('badgeCart');
  badge.innerText = qty;
  badge.style.display = qty > 0 ? 'flex' : 'none';
}

window.hapusItem = (idx) => {
  keranjang.splice(idx, 1);
  updateBadge();
  renderHalamanCheckout(); // Render ulang halaman checkout
}

window.checkoutWA = () => {
  if (keranjang.length === 0) return;
  const nama = document.getElementById('namaPembeli').value;
  const wa = document.getElementById('waPembeli').value;
  const alamat = document.getElementById('alamatPembeli').value;

  if (!nama || !wa || !alamat) { alert("Mohon lengkapi Nama, WA, dan Alamat!"); return; }

  let text = `Hi kak, saya mau order.\n\n`;
  let totalBelanja = 0;
  keranjang.forEach((item, i) => {
    const sub = item.harga_jual * item.qty;
    totalBelanja += sub;
    text += `${i+1}. *${item.nama}*\nJumlah : ${item.qty}\n${item.varian ? 'Varian : '+item.varian+'\n' : ''}Harga Total : ${formatRupiah(sub)}\n\n`;
  });

  text += `----------------------------------\nSubtotal : ${formatRupiah(totalBelanja)}\nOngkir : (Cek Admin)\n*TOTAL ESTIMASI: ${formatRupiah(totalBelanja)}*\n----------------------------------\n\n*DATA PEMBELI*\nNama : ${nama}\nNo WA : ${wa}\nAlamat : ${alamat}\n\n*Pembayaran :*\nTransfer BCA / DANA (Info Admin)`;

  const noWA = "6281234567890"; // NOMOR ANDRA
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