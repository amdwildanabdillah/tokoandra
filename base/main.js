import './style.css'
import { ambilDataProduk } from './data.js'

// --- 1. DAFTAR KODE VOUCHER (Bisa ditambahin sendiri) ---
const LIST_VOUCHER = {
  'ANDRA10': 10000,  // Potongan Rp 10.000
  'HEMAT5': 5000,    // Potongan Rp 5.000
  'PROMO': 2000      // Potongan Rp 2.000
};

// --- STATE GLOBAL ---
let semuaProduk = [];
let dataTampil = []; 
let keranjang = [];
let produkTerpilih = null; 
let limitTampil = 8;
let diskonAktif = 0;      // Nilai potongan (Rupiah)
let namaKodeDiskon = '';  // Nama kode yang dipake

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
const convertLink = (link) => {
  if (link.includes('drive.google.com')) {
    const id = link.match(/\/d\/(.+?)\//);
    return id ? `https://drive.google.com/uc?export=view&id=${id[1]}` : link;
  }
  return link;
}

// 2. SETUP HTML
document.querySelector('#app').innerHTML = `
  <header>
    <div class="header-main">
      <div class="header-wrapper">
        <div class="logo" onclick="keHome()">AndraStore</div>
        <div class="search-box"><input type="text" id="searchInput" placeholder="Cari produk digital..."></div>
        <div class="header-cart" onclick="bukaKeranjang()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <div id="badgeCart" class="header-cart-badge">0</div>
        </div>
      </div>
    </div>
  </header>

  <div id="viewHome" class="main-content">
    <div class="container">
      <div class="banner"><h2>FLASH SALE ⚡</h2><p>Dapatkan Preset & Template Premium!</p></div>
      <div class="kategori-menu">
        <button class="btn-kategori active" onclick="filterProduk('all', this)">Semua</button>
        <button class="btn-kategori" onclick="filterProduk('Lightroom', this)">Lightroom</button>
        <button class="btn-kategori" onclick="filterProduk('PPT', this)">PPT</button>
        <button class="btn-kategori" onclick="filterProduk('Canva', this)">Canva</button>
      </div>
      <div id="produk-container" class="grid-produk"></div>
      <div id="btnLoadMoreArea" class="load-more-container" style="display:none;">
        <button class="btn-loadmore" onclick="muatLebihBanyak()">Muat Lebih Banyak</button>
      </div>
    </div>
  </div>

  <div id="viewDetail" class="main-content" style="display:none;">
    <div class="container detail-page">
      <div onclick="keHome()" class="btn-kembali">← Kembali</div>
      <div id="kontenDetail"></div>
    </div>
  </div>

  <div id="viewCheckout" class="main-content" style="display:none;">
    <div class="container checkout-container">
      <div class="checkout-page">
        <div class="checkout-header">DETAIL PESANAN</div>
        <div class="checkout-body">
          <div id="listCheckout"></div>
          
          <div style="background:#f8fafc; padding:10px; border-radius:8px; margin-bottom:20px; border:1px dashed #cbd5e1;">
            <label class="form-label" style="margin-bottom:5px;">Punya Kode Voucher?</label>
            <div style="display:flex; gap:10px;">
              <input type="text" id="inputVoucher" class="form-input" placeholder="Masukkan Kode (ex: ANDRA10)" style="text-transform:uppercase;">
              <button onclick="cekVoucher()" style="background:#334155; color:white; border:none; padding:0 15px; border-radius:8px; cursor:pointer; font-weight:600;">Pakai</button>
            </div>
            <div id="pesanVoucher" style="font-size:0.8rem; margin-top:5px; font-weight:600;"></div>
          </div>

          <div class="form-group"><label class="form-label">Nama Lengkap</label><input type="text" id="namaPembeli" class="form-input" placeholder="Masukkan Nama"></div>
          <div class="form-group"><label class="form-label">Email</label><input type="email" id="emailPembeli" class="form-input" placeholder="email@anda.com"></div>
          <div class="form-group"><label class="form-label">No WhatsApp</label><input type="tel" id="waPembeli" class="form-input" placeholder="08xxxxxxxxxx"></div>

          <div class="checkout-summary">
            <div class="summary-row"><span>Subtotal</span> <span id="subtotalVal">Rp 0</span></div>
            <div class="summary-row" id="rowDiskon" style="display:none; color:green;">
               <span>Diskon <span id="labelDiskon"></span></span> 
               <span id="diskonVal">-Rp 0</span>
            </div>
            <div class="summary-row total"><span>TOTAL BAYAR</span> <span id="totalVal">Rp 0</span></div>
          </div>
          
          <button onclick="checkoutWA()" class="btn-pesan">PESAN SEKARANG</button>
        </div>
      </div>
    </div>
  </div>
`;

// 3. LOGIC VOUCHER (BARU)
window.cekVoucher = () => {
  const input = document.getElementById('inputVoucher');
  const pesan = document.getElementById('pesanVoucher');
  const kode = input.value.toUpperCase().trim();

  // Reset dulu
  diskonAktif = 0;
  namaKodeDiskon = '';
  document.getElementById('rowDiskon').style.display = 'none';

  if (!kode) {
    pesan.innerHTML = '<span style="color:red">Isi kodenya dulu gan!</span>';
    hitungTotal();
    return;
  }

  // Cek apakah kode ada di daftar?
  if (LIST_VOUCHER[kode]) {
    diskonAktif = LIST_VOUCHER[kode];
    namaKodeDiskon = kode;
    
    pesan.innerHTML = `<span style="color:green">✅ Kode <b>${kode}</b> berhasil! Hemat ${formatRupiah(diskonAktif)}</span>`;
    
    // Tampilkan di Ringkasan
    document.getElementById('rowDiskon').style.display = 'flex';
    document.getElementById('labelDiskon').innerText = `(${kode})`;
    document.getElementById('diskonVal').innerText = `-${formatRupiah(diskonAktif)}`;
    
    hitungTotal();
    showToast(`Voucher ${kode} dipakai!`);
  } else {
    pesan.innerHTML = '<span style="color:red">❌ Kode tidak ditemukan atau kadaluarsa.</span>';
    hitungTotal();
  }
}

const hitungTotal = () => {
  const subtotal = keranjang.reduce((a, b) => a + parseInt(b.harga_jual), 0);
  // Pastikan total tidak minus
  const totalAkhir = Math.max(0, subtotal - diskonAktif);
  
  document.getElementById('subtotalVal').innerText = formatRupiah(subtotal);
  document.getElementById('totalVal').innerText = formatRupiah(totalAkhir);
}

// 4. CHECKOUT WA (UPDATE: Masukkan Info Diskon)
window.checkoutWA = () => {
  const nama = document.getElementById('namaPembeli').value;
  const email = document.getElementById('emailPembeli').value;
  const wa = document.getElementById('waPembeli').value;
  if (!nama || !email || !wa) { showToast('Lengkapi data dulu ya!', 'error'); return; }

  let pesan = `Halo Andra, saya mau order:\n\n`;
  keranjang.forEach((item, i) => {
    pesan += `${i+1}. *${item.nama}* - ${formatRupiah(item.harga_jual)}\n`;
  });
  
  const subtotal = keranjang.reduce((a, b) => a + parseInt(b.harga_jual), 0);
  const totalAkhir = Math.max(0, subtotal - diskonAktif);

  pesan += `\n----------------------------------`;
  pesan += `\nSubtotal: ${formatRupiah(subtotal)}`;
  
  // Kalau pake diskon, tulis di WA
  if (diskonAktif > 0) {
    pesan += `\nDiskon (${namaKodeDiskon}): -${formatRupiah(diskonAktif)}`;
  }
  
  pesan += `\n*TOTAL BAYAR: ${formatRupiah(totalAkhir)}*`;
  pesan += `\n----------------------------------\n`;
  pesan += `\n*Data Pembeli:*\nNama: ${nama}\nEmail: ${email}\nWA: ${wa}`;

  window.open(`https://wa.me/6285830527310?text=${encodeURIComponent(pesan)}`);
}

// ... (SISA KODE SAMA KAYAK SEBELUMNYA) ...

window.keHome = () => {
  document.getElementById('viewHome').style.display = 'block';
  document.getElementById('viewDetail').style.display = 'none';
  document.getElementById('viewCheckout').style.display = 'none';
  document.getElementById('btnShareHeader').style.display = 'none';
};
window.keDetail = () => {
  document.getElementById('viewHome').style.display = 'none';
  document.getElementById('viewDetail').style.display = 'block';
  document.getElementById('btnShareHeader').style.display = 'flex';
};
window.bukaKeranjang = () => {
  // Reset voucher pas buka keranjang baru biar fresh
  diskonAktif = 0; namaKodeDiskon = ''; 
  document.getElementById('inputVoucher').value = '';
  document.getElementById('pesanVoucher').innerHTML = '';
  
  renderCheckout();
  document.getElementById('viewHome').style.display = 'none';
  document.getElementById('viewDetail').style.display = 'none';
  document.getElementById('viewCheckout').style.display = 'block';
  document.getElementById('btnShareHeader').style.display = 'none';
};

const renderCheckout = () => {
  const list = document.getElementById('listCheckout');
  list.innerHTML = '';
  keranjang.forEach((item, idx) => {
    list.innerHTML += `
      <div class="checkout-item">
        <img src="${convertLink(item.gambar.split(',')[0])}">
        <div class="checkout-item-info">
          <div class="checkout-item-title">${item.nama}</div>
          <div class="checkout-item-price">${formatRupiah(item.harga_jual)}</div>
        </div>
        <button onclick="hapusItem(${idx})" class="checkout-delete">Hapus</button>
      </div>`;
  });
  hitungTotal(); // Panggil fungsi hitung baru
};

window.shareCurrentProduk = () => {
  if(produkTerpilih) {
    const url = `${window.location.origin}?id=${produkTerpilih.id}`;
    navigator.clipboard.writeText(url).then(() => showToast(`🔗 Link disalin!`));
  }
}

const renderProduk = (data) => {
  const container = document.getElementById('produk-container');
  container.innerHTML = '';
  data.forEach(item => {
    container.innerHTML += `
      <div class="card" onclick="bukaDetailProduk(${item.id})">
        <div class="card-img-wrapper"><img src="${convertLink(item.gambar.split(',')[0])}"></div>
        <div class="card-body">
          <span class="label-kategori">${item.kategori}</span>
          <h4>${item.nama}</h4>
          <div class="harga-jual">${formatRupiah(item.harga_jual)}</div>
        </div>
      </div>`;
  });
};

window.bukaDetailProduk = (id) => {
  const item = semuaProduk.find(p => p.id == id);
  produkTerpilih = item;
  const gambars = item.gambar.split(',').map(s => s.trim());
  const deskripsi = (item.deskripsi || '-').replace(/\|/g, '<br>');

  const konten = document.getElementById('kontenDetail');
  konten.innerHTML = `
    <div class="detail-grid">
      <div class="detail-img-wrapper">
        <img id="imgDetail" src="${convertLink(gambars[0])}" class="detail-img">
      </div>
      <div class="detail-info">
        <h1>${item.nama}</h1>
        <div class="detail-price">${formatRupiah(item.harga_jual)}</div>
        <div class="detail-desc"><div class="varian-title">Tentang Produk</div>${deskripsi}</div>
        <button class="btn-add-cart" onclick="masukinKeranjang()">+ Masukkan Keranjang</button>
      </div>
    </div>`;
  keDetail();
};

window.masukinKeranjang = () => {
  keranjang.push(produkTerpilih);
  const badge = document.getElementById('badgeCart');
  badge.innerText = keranjang.length;
  badge.style.display = 'flex';
  showToast('🛒 Masuk keranjang!');
};

window.hapusItem = (idx) => {
  keranjang.splice(idx, 1);
  const badge = document.getElementById('badgeCart');
  badge.innerText = keranjang.length;
  if(keranjang.length === 0) document.getElementById('badgeCart').style.display = 'none';
  renderCheckout();
  showToast('🗑️ Item dihapus', 'error');
};

window.filterProduk = (k, el) => {
  document.querySelectorAll('.btn-kategori').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  const filtered = k === 'all' ? semuaProduk : semuaProduk.filter(p => p.kategori === k);
  renderProduk(filtered);
};

window.showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const key = e.target.value.toLowerCase();
  renderProduk(semuaProduk.filter(p => p.nama.toLowerCase().includes(key)));
});

async function init() {
  semuaProduk = await ambilDataProduk();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  renderProduk(semuaProduk);
  if (productId) bukaDetailProduk(productId);
}
init();