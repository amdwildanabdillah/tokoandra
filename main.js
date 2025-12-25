import './style.css'
import { ambilDataProduk } from './data.js'

// --- STATE GLOBAL ---
let semuaProduk = [];
let keranjang = [];
let produkTerpilih = null; // Produk yg lagi dibuka detailnya
let pilihanWarna = null;
let pilihanSize = null;

// Helper Rupiah
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

// 1. SETUP HTML
document.querySelector('#app').innerHTML = `
  <header>
    <div class="header-main">
      <div class="header-wrapper">
        <div class="logo">🛍️ Toko Andra</div>
        <div class="search-box"><input type="text" id="searchInput" placeholder="Cari baju..."></div>
      </div>
    </div>
  </header>

  <div class="main-content">
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

  <div id="modalDetail" class="modal-overlay">
    <div class="modal-content" style="max-width: 700px;"> <span class="modal-close" onclick="tutupDetail()">&times;</span>
      <div id="kontenDetail"></div> </div>
  </div>

  <div id="modalKeranjang" class="modal-overlay">
    <div class="modal-content">
      <span class="modal-close" onclick="tutupKeranjang()">&times;</span>
      <h3>Keranjang Belanja</h3>
      <div id="listBelanjaan" class="cart-items"></div>
      
      <div class="cart-total" style="margin-top:10px;">Total: <span id="totalHarga">Rp 0</span></div>
      <button onclick="checkoutWA()" class="btn-checkout">Checkout via WA</button>
    </div>
  </div>

  <div id="tombolKeranjang" class="float-cart" onclick="bukaKeranjang()">
    <span>🛒</span><span id="jmlItem">0</span>
  </div>
`

// 2. RENDER GRID DEPAN (Cuma Tombol Lihat)
const renderProduk = (data) => {
  const container = document.getElementById('produk-container');
  container.innerHTML = '';
  
  if (data.length === 0) {
    document.getElementById('empty-state').style.display = 'block'; return;
  } else { document.getElementById('empty-state').style.display = 'none'; }

  data.forEach(item => {
    // Logic Harga Coret
    let hargaHTML = `<div class="harga-jual">${formatRupiah(item.harga_jual)}</div>`;
    if (item.harga_asli > item.harga_jual) {
      hargaHTML = `<div class="harga-coret">${formatRupiah(item.harga_asli)}</div>` + hargaHTML;
    }

    const card = `
      <div class="card" onclick="bukaDetailProduk(${item.id})" style="cursor:pointer;">
        <div class="card-img-wrapper">
          <img src="${convertLink(item.gambar)}" loading="lazy">
        </div>
        <div class="card-body">
          <span class="label-kategori">${item.kategori}</span>
          <h4>${item.nama}</h4>
          <div class="card-harga-wrapper">${hargaHTML}</div>
          <button class="btn-keranjang" style="background:#f1f5f9; border:none; color:#334155;">
            Lihat Produk
          </button>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// 3. LOGIC DETAIL PRODUK (Pilih Size/Warna)
window.bukaDetailProduk = (id) => {
  const item = semuaProduk.find(p => p.id == id);
  produkTerpilih = item;
  pilihanWarna = null; // Reset pilihan
  pilihanSize = null;

  // Parsing varian dari CSV (Dipisah koma)
  const warnas = item.warna ? item.warna.split(',').map(s => s.trim()) : [];
  const sizes = item.size ? item.size.split(',').map(s => s.trim()) : [];

  // Generate HTML Tombol Warna
  let warnaHTML = warnas.length > 0 ? `<div class="varian-title">Pilih Warna:</div><div class="varian-wrapper">` : '';
  warnas.forEach(w => {
    warnaHTML += `<button class="btn-varian" onclick="pilihVarian('warna', '${w}', this)">${w}</button>`;
  });
  if(warnas.length > 0) warnaHTML += `</div>`;

  // Generate HTML Tombol Size
  let sizeHTML = sizes.length > 0 ? `<div class="varian-title">Pilih Ukuran:</div><div class="varian-wrapper">` : '';
  sizes.forEach(s => {
    sizeHTML += `<button class="btn-varian" onclick="pilihVarian('size', '${s}', this)">${s}</button>`;
  });
  if(sizes.length > 0) sizeHTML += `</div>`;

  // Render Modal
  const konten = document.getElementById('kontenDetail');
  konten.innerHTML = `
    <div class="modal-body-grid">
      <div>
        <img src="${convertLink(item.gambar)}" class="detail-img">
      </div>
      <div class="detail-info">
        <h3>${item.nama}</h3>
        <div class="detail-price">${formatRupiah(item.harga_jual)}</div>
        <div class="detail-desc">${item.deskripsi || 'Tidak ada deskripsi.'}</div>
        
        ${warnaHTML}
        ${sizeHTML}

        <div class="detail-actions">
          <button id="btnAction" class="btn-add-cart" onclick="masukinKeranjang()">
            + Masukkan Keranjang
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('modalDetail').style.display = 'flex';
}

window.pilihVarian = (tipe, nilai, el) => {
  // Logic styling tombol (active state)
  const parent = el.parentElement;
  parent.querySelectorAll('.btn-varian').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');

  if (tipe === 'warna') pilihanWarna = nilai;
  if (tipe === 'size') pilihanSize = nilai;
}

window.tutupDetail = () => document.getElementById('modalDetail').style.display = 'none';

// 4. MASUK KERANJANG (Validasi Wajib Pilih)
window.masukinKeranjang = () => {
  // Cek apakah produk punya varian? Kalau punya, wajib dipilih.
  const punyaWarna = produkTerpilih.warna && produkTerpilih.warna.trim() !== '';
  const punyaSize = produkTerpilih.size && produkTerpilih.size.trim() !== '';

  if (punyaWarna && !pilihanWarna) { alert('Tolong pilih warna dulu bosku!'); return; }
  if (punyaSize && !pilihanSize) { alert('Tolong pilih ukuran dulu bosku!'); return; }

  // Buat ID unik berdasarkan varian (biar Kaos Hitam & Kaos Putih beda item)
  const varianLabel = `${pilihanWarna || ''} ${pilihanSize || ''}`.trim();
  const cartId = `${produkTerpilih.id}-${varianLabel}`;

  const existing = keranjang.find(i => i.cartId === cartId);
  if (existing) {
    existing.qty++;
  } else {
    keranjang.push({
      ...produkTerpilih,
      cartId: cartId, // ID unik keranjang
      varian: varianLabel,
      qty: 1
    });
  }

  updateTampilanKeranjang();
  tutupDetail();
  
  // Animasi Floating Button
  const btn = document.getElementById('tombolKeranjang');
  btn.style.transform = "scale(1.2)";
  setTimeout(() => btn.style.transform = "scale(1)", 200);
}

// 5. UPDATE KERANJANG (TAMPILKAN FORM NAMA/ALAMAT)
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
        <div>
          <strong>${item.nama}</strong> ${varianInfo}<br>
          <small>${item.qty} x ${formatRupiah(item.harga_jual)}</small>
        </div>
        <div>
          <b>${formatRupiah(sub)}</b>
          <button onclick="hapusItem(${idx})" style="border:none; background:none; color:red; margin-left:5px; cursor:pointer;">✕</button>
        </div>
      </div>
    `;
  });

  // --- INJECT FORM NAMA & ALAMAT DISINI ---
  // Kita cek dulu apa formnya udah ada biar gak dobel
  const modalContent = document.querySelector('#modalKeranjang .modal-content');
  if (!document.getElementById('formCheckout')) {
    const formHTML = `
      <div id="formCheckout" style="margin-top:15px; border-top:1px dashed #e2e8f0; padding-top:15px;">
        <div style="margin-bottom:10px;">
          <label style="font-size:0.85rem; font-weight:700; color:#475569;">Nama Penerima</label>
          <input type="text" id="namaPembeli" placeholder="Contoh: Wildan" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; margin-top:5px;">
        </div>
        <div style="margin-bottom:10px;">
          <label style="font-size:0.85rem; font-weight:700; color:#475569;">Alamat Lengkap</label>
          <textarea id="alamatPembeli" placeholder="Jalan, No Rumah, Kecamatan, Kota..." style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; margin-top:5px; height:60px;"></textarea>
        </div>
      </div>
    `;
    // Sisipkan Form SEBELUM Cart Total (biar di atas total harga)
    const cartTotal = document.querySelector('.cart-total');
    cartTotal.insertAdjacentHTML('beforebegin', formHTML);
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

// 6. CHECKOUT WA (FORMAT STRUK LENGKAP)
window.checkoutWA = () => {
  if (keranjang.length === 0) return;

  // Validasi Form
  const nama = document.getElementById('namaPembeli').value;
  const alamat = document.getElementById('alamatPembeli').value;

  if (!nama || !alamat) {
    alert("Waduh, Nama sama Alamat wajib diisi ya bosku! 🙏");
    return;
  }

  let text = `Hi kak, saya mau order.\n\n`;
  let totalBelanja = 0;

  keranjang.forEach((item, i) => {
    const sub = item.harga_jual * item.qty;
    totalBelanja += sub;
    
    // Format Barang:
    // 1. Nama Barang
    // Jumlah : 1
    // Varian : Hitam XL
    // Harga Total : Rp 100.000
    
    text += `${i+1}. *${item.nama}*\n`;
    text += `Jumlah : ${item.qty}\n`;
    if(item.varian) text += `Varian : ${item.varian}\n`;
    text += `Harga Satuan : ${formatRupiah(item.harga_jual)}\n`;
    text += `Harga Total : ${formatRupiah(sub)}\n\n`;
  });

  // Footer Struk
  text += `----------------------------------\n`;
  text += `Subtotal : ${formatRupiah(totalBelanja)}\n`;
  text += `Ongkir : (Cek Admin)\n`;
  text += `*TOTAL : ${formatRupiah(totalBelanja)}* (Belum Ongkir)\n`;
  text += `----------------------------------\n\n`;
  
  // Data Pembeli
  text += `*Nama :*\n${nama}\n\n`;
  text += `*Alamat :*\n${alamat}\n\n`;
  text += `*Pembayaran :*\nTransfer BCA / DANA (Info Admin)`;

  // GANTI NOMOR WA DISINI
  const noWA = "6285830527310"; 
  window.open(`https://wa.me/${noWA}?text=${encodeURIComponent(text)}`);
}

// UTILS
const convertLink = (link) => {
  if (link.includes('drive.google.com')) {
    const id = link.match(/\/d\/(.+?)\//);
    return id ? `https://drive.google.com/uc?export=view&id=${id[1]}` : link;
  }
  return link;
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
  const k = e.target.value.toLowerCase();
  renderProduk(semuaProduk.filter(p => p.nama.toLowerCase().includes(k)));
});

init();