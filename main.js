import './style.css'
import { ambilDataProduk } from './data.js'

let semuaProduk = [];
let dataTampil = []; 
let keranjang = [];
let produkTerpilih = null; 
let pilihanVarian = null;
let limitTampil = 8;

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
const convertLink = (link) => {
  if (link.includes('drive.google.com')) {
    const id = link.match(/\/d\/(.+?)\//);
    return id ? `https://drive.google.com/uc?export=view&id=${id[1]}` : link;
  }
  return link;
}

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
          <div class="checkout-digital-info">✨ Produk digital akan dikirimkan langsung ke WhatsApp atau Email Anda setelah pembayaran dikonfirmasi.</div>
          
          <div class="form-group">
            <label class="form-label">Nama Lengkap</label>
            <input type="text" id="namaPembeli" class="form-input" placeholder="Masukkan Nama">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="emailPembeli" class="form-input" placeholder="email@anda.com">
          </div>
          <div class="form-group">
            <label class="form-label">No WhatsApp</label>
            <input type="tel" id="waPembeli" class="form-input" placeholder="08xxxxxxxxxx">
          </div>

          <div class="checkout-summary">
            <div class="summary-row"><span>Total Harga</span> <span id="totalVal">Rp 0</span></div>
          </div>
          <button onclick="checkoutWA()" class="btn-pesan">BELI SEKARANG</button>
        </div>
      </div>
    </div>
  </div>
`;

window.bukaDetailProduk = (id) => {
  const item = semuaProduk.find(p => p.id == id);
  produkTerpilih = item;
  const gambars = item.gambar.split(',').map(s => s.trim());
  const deskripsi = (item.deskripsi || '-').replace(/\|/g, '<br>');

  const konten = document.getElementById('kontenDetail');
  konten.innerHTML = `
    <div class="detail-grid">
      <div class="detail-img-wrapper" style="position:relative;">
        <div class="detail-header-actions">
          <button class="btn-icon-circle" onclick="shareProduk('${item.nama}', ${item.id})" title="Bagikan Produk">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
        </div>
        <img id="imgDetail" src="${convertLink(gambars[0])}" class="detail-img">
      </div>
      <div class="detail-info">
        <h1>${item.nama}</h1>
        <div class="detail-price">${formatRupiah(item.harga_jual)}</div>
        <div class="detail-desc">${deskripsi}</div>
        <button class="btn-add-cart" onclick="masukinKeranjang()">+ Masukkan Keranjang</button>
      </div>
    </div>
  `;
  keDetail();
}

window.shareProduk = (nama, id) => {
  const url = `${window.location.origin}?id=${id}`;
  navigator.clipboard.writeText(url).then(() => {
    alert(`Link produk ${nama} berhasil disalin!`);
  });
}

window.checkoutWA = () => {
  const nama = document.getElementById('namaPembeli').value;
  const email = document.getElementById('emailPembeli').value;
  const wa = document.getElementById('waPembeli').value;

  if (!nama || !email || !wa) { alert("Lengkapi data diri dulu ya!"); return; }

  let pesan = `Halo Andra, saya mau order produk digital:\n\n`;
  keranjang.forEach((item, i) => {
    pesan += `${i+1}. *${item.nama}* - ${formatRupiah(item.harga_jual)}\n`;
  });
  
  const total = keranjang.reduce((a, b) => a + parseInt(b.harga_jual), 0);
  pesan += `\n*Total: ${formatRupiah(total)}*\n\n*Data Pembeli:*\nNama: ${nama}\nEmail: ${email}\nWA: ${wa}\n\nMohon dikirimkan link produknya ya!`;

  window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(pesan)}`);
}

// Navigasi & Render lainnya tetap sama...
window.keHome = () => {
  document.getElementById('viewHome').style.display = 'block';
  document.getElementById('viewDetail').style.display = 'none';
  document.getElementById('viewCheckout').style.display = 'none';
};
window.keDetail = () => {
  document.getElementById('viewHome').style.display = 'none';
  document.getElementById('viewDetail').style.display = 'block';
};
window.bukaKeranjang = () => {
  renderCheckout();
  document.getElementById('viewHome').style.display = 'none';
  document.getElementById('viewDetail').style.display = 'none';
  document.getElementById('viewCheckout').style.display = 'block';
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
      </div>
    `;
  });
  const total = keranjang.reduce((a, b) => a + parseInt(b.harga_jual), 0);
  document.getElementById('totalVal').innerText = formatRupiah(total);
}

const renderProduk = (data) => {
  const container = document.getElementById('produk-container');
  container.innerHTML = '';
  data.forEach(item => {
    container.innerHTML += `
      <div class="card" onclick="bukaDetailProduk(${item.id})">
        <div class="card-img-wrapper"><img src="${convertLink(item.gambar.split(',')[0])}"></div>
        <div class="card-body">
          <h4>${item.nama}</h4>
          <div class="harga-jual">${formatRupiah(item.harga_jual)}</div>
        </div>
      </div>
    `;
  });
}

window.masukinKeranjang = () => {
  keranjang.push(produkTerpilih);
  const badge = document.getElementById('badgeCart');
  badge.innerText = keranjang.length;
  badge.style.display = 'flex';
  alert("Produk ditambahkan ke keranjang!");
}

window.hapusItem = (idx) => {
  keranjang.splice(idx, 1);
  document.getElementById('badgeCart').innerText = keranjang.length;
  renderCheckout();
}

async function init() {
  semuaProduk = await ambilDataProduk();
  
  // Cek jika ada ID produk di URL (untuk fitur Share Link)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  renderProduk(semuaProduk);
  
  if (productId) {
    bukaDetailProduk(productId);
  }
}

init();