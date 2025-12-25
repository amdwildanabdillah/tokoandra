import './style.css'
import { ambilDataProduk } from './data.js'

// --- STATE GLOBAL ---
let semuaProduk = [];
let keranjang = [];
let produkTerpilih = null; 
let pilihanWarna = null;
let pilihanSize = null;

// Helper
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
const convertLink = (link) => {
  if (link.includes('drive.google.com')) {
    const id = link.match(/\/d\/(.+?)\//);
    return id ? `https://drive.google.com/uc?export=view&id=${id[1]}` : link;
  }
  return link;
}

// 1. SETUP HTML (HOME & DETAIL VIEW)
document.querySelector('#app').innerHTML = `
  <header>
    <div class="header-main">
      <div class="header-wrapper">
        <div class="logo" onclick="keHome()">🛍️ Toko Andra</div>
        <div class="search-box"><input type="text" id="searchInput" placeholder="Cari baju..."></div>
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
      <div id="formArea"></div> <div class="cart-total" style="margin-top:10px;">Total: <span id="totalHarga">Rp 0</span></div>
      <button onclick="checkoutWA()" class="btn-checkout">Checkout via WA</button>
    </div>
  </div>

  <div id="tombolKeranjang" class="float-cart" onclick="bukaKeranjang()">
    <span>🛒</span><span id="jmlItem">0</span>
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

// 3. RENDER GRID HOME
const renderProduk = (data) => {
  const container = document.getElementById('produk-container');
  container.innerHTML = '';
  
  if (data.length === 0) {
    document.getElementById('empty-state').style.display = 'block'; return;
  } else { document.getElementById('empty-state').style.display = 'none'; }

  data.forEach(item => {
    let hargaHTML = `<div class="harga-jual">${formatRupiah(item.harga_jual)}</div>`;
    if (item.harga_asli > item.harga_jual) {
      hargaHTML = `<div class="harga-coret">${formatRupiah(item.harga_asli)}</div>` + hargaHTML;
    }

    // Ambil gambar pertama untuk thumbnail
    const firstImg = item.gambar.split(',')[0].trim();

    const card = `
      <div class="card" onclick="bukaDetailProduk(${item.id})">
        <div class="card-img-wrapper">
          <img src="${convertLink(firstImg)}" loading="lazy">
        </div>
        <div class="card-body">
          <span class="label-kategori">${item.kategori}</span>
          <h4>${item.nama}</h4>
          <div class="card-harga-wrapper">${hargaHTML}</div>
          <button class="btn-lihat">Lihat Detail</button>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// 4. BUKA HALAMAN DETAIL
window.bukaDetailProduk = (id) => {
  const item = semuaProduk.find(p => p.id == id);
  produkTerpilih = item;
  pilihanWarna = null;
  pilihanSize = null;

  const warnas = item.warna ? item.warna.split(',').map(s => s.trim()) : [];
  const sizes = item.size ? item.size.split(',').map(s => s.trim()) : [];
  const gambars = item.gambar.split(',').map(s => s.trim());
  produkTerpilih.listGambar = gambars;

  // HTML Varian
  let warnaHTML = warnas.length > 0 ? `<div class="varian-section"><div class="varian-title">Pilih Warna</div><div class="varian-wrapper">` : '';
  warnas.forEach((w, index) => {
    warnaHTML += `<button class="btn-varian" onclick="pilihVarian('warna', '${w}', this, ${index})">${w}</button>`;
  });
  if(warnas.length > 0) warnaHTML += `</div></div>`;

  let sizeHTML = sizes.length > 0 ? `<div class="varian-section"><div class="varian-title">Pilih Ukuran</div><div class="varian-wrapper">` : '';
  sizes.forEach(s => {
    sizeHTML += `<button class="btn-varian" onclick="pilihVarian('size', '${s}', this)">${s}</button>`;
  });
  if(sizes.length > 0) sizeHTML += `</div></div>`;

  // HTML Harga
  let hargaHTML = `<div class="detail-price">${formatRupiah(item.harga_jual)}</div>`;
  if (item.harga_asli > item.harga_jual) {
    hargaHTML = `<div class="detail-coret">${formatRupiah(item.harga_asli)}</div>` + hargaHTML;
  }

  // --- LOGIC DESKRIPSI PANJANG (Ubah | jadi <br>) ---
  let deskripsiPanjang = item.deskripsi || '-';
  deskripsiPanjang = deskripsiPanjang.replace(/\|/g, '<br>'); 

  // Render Full Page
  const konten = document.getElementById('kontenDetail');
  konten.innerHTML = `
    <div class="detail-grid">
      <div class="detail-img-wrapper">
        <img id="imgDetail" src="${convertLink(gambars[0])}" class="detail-img">
      </div>
      
      <div class="detail-info">
        <h1>${item.nama}</h1>
        <div class="detail-price-box">${hargaHTML}</div>
        
        <div class="detail-desc">
          <div class="varian-title">Deskripsi Produk</div>
          ${deskripsiPanjang}
        </div>
        
        ${warnaHTML}
        ${sizeHTML}

        <div class="detail-actions">
          <button class="btn-add-cart" onclick="masukinKeranjang()">
            + Masukkan Keranjang
          </button>
        </div>
      </div>
    </div>
  `;

  keDetail(); // Switch ke tampilan detail
}

// Logic Ganti Gambar & Varian
window.pilihVarian = (tipe, nilai, el, index = 0) => {
  const parent = el.parentElement;
  parent.querySelectorAll('.btn-varian').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');

  if (tipe === 'warna') {
    pilihanWarna = nilai;
    if (produkTerpilih.listGambar && produkTerpilih.listGambar[index]) {
      const imgEl = document.getElementById('imgDetail');
      imgEl.style.opacity = 0.5;
      setTimeout(() => {
        imgEl.src = convertLink(produkTerpilih.listGambar[index]);
        imgEl.style.opacity = 1;
      }, 200);
    }
  }
  if (tipe === 'size') pilihanSize = nilai;
}

// 5. KERANJANG LOGIC
window.masukinKeranjang = () => {
  const punyaWarna = produkTerpilih.warna && produkTerpilih.warna.trim() !== '';
  const punyaSize = produkTerpilih.size && produkTerpilih.size.trim() !== '';

  if (punyaWarna && !pilihanWarna) { alert('Harap pilih warna dulu ya!'); return; }
  if (punyaSize && !pilihanSize) { alert('Harap pilih ukuran dulu ya!'); return; }

  const varianLabel = `${pilihanWarna || ''} ${pilihanSize || ''}`.trim();
  const cartId = `${produkTerpilih.id}-${varianLabel}`;

  const existing = keranjang.find(i => i.cartId === cartId);
  if (existing) { existing.qty++; } 
  else { keranjang.push({ ...produkTerpilih, cartId, varian: varianLabel, qty: 1 }); }

  updateTampilanKeranjang();
  alert('Berhasil masuk keranjang! 🛒');
  keHome();
  
  const btn = document.getElementById('tombolKeranjang');
  btn.style.transform = "scale(1.2)";
  setTimeout(() => btn.style.transform = "scale(1)", 200);
}

const updateTampilanKeranjang = () => {
  const qty = keranjang.reduce((a, b) => a + b.qty, 0);
  document.getElementById('jmlItem').innerText = qty;
  document.getElementById('tombolKeranjang').style.display = qty > 0 ? 'flex' : 'none';
}

window.bukaKeranjang = () => {
  const list = document.getElementById('listBelanjaan');
  list.innerHTML = '';
  let total = 0;

  keranjang.forEach((item, idx) => {
    const sub = item.harga_jual * item.qty;
    total += sub;
    const varianInfo = item.varian ? `<br><small style="color:#64748b">Varian: ${item.varian}</small>` : '';
    list.innerHTML += `
      <div class="cart-item">
        <div><strong>${item.nama}</strong> ${varianInfo}<br><small>${item.qty} x ${formatRupiah(item.harga_jual)}</small></div>
        <div><b>${formatRupiah(sub)}</b><button onclick="hapusItem(${idx})" style="border:none; bg:none; color:red; margin-left:8px; cursor:pointer;">✕</button></div>
      </div>
    `;
  });

  // Form Checkout Inject
  const formArea = document.getElementById('formArea');
  if (formArea.innerHTML === '') {
    formArea.innerHTML = `
      <div style="margin-top:15px; border-top:1px dashed #eee; padding-top:15px;">
        <label style="font-size:0.85rem; font-weight:700;">Nama Penerima</label>
        <input type="text" id="namaPembeli" placeholder="Nama Lengkap..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:6px; margin:5px 0 10px;">
        <label style="font-size:0.85rem; font-weight:700;">Alamat Lengkap</label>
        <textarea id="alamatPembeli" placeholder="Jalan, RT/RW, Kota..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:6px; margin:5px 0 10px; height:60px;"></textarea>
      </div>
    `;
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
  if (!nama || !alamat) { alert("Nama & Alamat wajib diisi ya!"); return; }

  let text = `Hi kak, saya mau order.\n\n`;
  let totalBelanja = 0;

  keranjang.forEach((item, i) => {
    const sub = item.harga_jual * item.qty;
    totalBelanja += sub;
    text += `${i+1}. *${item.nama}*\nJumlah : ${item.qty}\n${item.varian ? 'Varian : '+item.varian+'\n' : ''}Harga Total : ${formatRupiah(sub)}\n\n`;
  });

  text += `----------------------------------\nSubtotal : ${formatRupiah(totalBelanja)}\nOngkir : (Cek Admin)\n*TOTAL : ${formatRupiah(totalBelanja)}* (Belum Ongkir)\n----------------------------------\n\n`;
  text += `*Nama :*\n${nama}\n\n*Alamat :*\n${alamat}\n\n*Pembayaran :*\nTransfer BCA / DANA (Info Admin)`;

  const noWA = "6281234567890"; // GANTI NOMOR ANDRA
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
  renderProduk(k === 'all' ? semuaProduk : semuaProduk.filter(p => p.kategori === k));
}
document.getElementById('searchInput').addEventListener('input', (e) => {
  renderProduk(semuaProduk.filter(p => p.nama.toLowerCase().includes(e.target.value.toLowerCase())));
});

init();