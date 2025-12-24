import './style.css'
import { produk } from './data.js'

// 1. INJECT STRUKTUR HTML UTAMA
document.querySelector('#app').innerHTML = `
  <header>
    <div class="header-main">
      <div class="header-wrapper">
        <div class="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Toko Andra
        </div>
        <div class="search-box">
          <input type="text" id="searchInput" placeholder="Cari: Jaket, Kaos...">
        </div>
        <div class="header-icons">
          <span>🔔</span>
          <span>🛒</span>
        </div>
      </div>
    </div>
    
    <nav class="navbar">
      <div class="nav-wrapper">
        <a class="nav-link" onclick="location.reload()">Beranda</a>
        <a class="nav-link" onclick="bukaModal('cara')">Cara Pesan</a>
        <a class="nav-link" onclick="bukaModal('tentang')">Tentang Kami</a>
        <a class="nav-link" onclick="bukaModal('retur')">Garansi</a>
      </div>
    </nav>
  </header>

  <div class="main-content">
    <div class="container">
      
      <div class="banner">
        <h2>FLASH SALE ⚡</h2>
        <p>Diskon spesial pembukaan toko baru!</p>
      </div>

      <div class="kategori-menu">
        <button class="btn-kategori active" onclick="filterProduk('all', this)">Semua</button>
        <button class="btn-kategori" onclick="filterProduk('Jaket', this)">Jaket</button>
        <button class="btn-kategori" onclick="filterProduk('Kaos', this)">Kaos</button>
        <button class="btn-kategori" onclick="filterProduk('Celana', this)">Celana</button>
      </div>

      <div class="section-title" style="margin-bottom:15px; font-weight:700; font-size:1.1rem; color:#334155;">
        Produk Terbaru
      </div>

      <div id="produk-container" class="grid-produk"></div>
      
      <div id="empty-state" style="display:none; text-align:center; padding: 50px; color:#94a3b8;">
        <p>Produk tidak ditemukan 😢</p>
      </div>
    </div>
  </div>

  <footer>
    <div class="footer-grid">
      <div class="footer-col">
        <h5 style="color:#2563eb; font-weight:800; font-size:1.2rem;">Toko Andra</h5>
        <p>Platform belanja fashion pria terpercaya. Kualitas distro, harga kawan.</p>
        <p>📍 Surabaya, Jawa Timur</p>
      </div>
      <div class="footer-col">
        <h5>INFO</h5>
        <a onclick="bukaModal('tentang')">Tentang Kami</a>
        <a onclick="bukaModal('cara')">Cara Pesan</a>
        <a onclick="bukaModal('retur')">Kebijakan Retur</a>
      </div>
      <div class="footer-col">
        <h5>KONTAK</h5>
        <a href="https://wa.me/6281234567890" target="_blank">WhatsApp Admin</a>
        <a href="#">Instagram</a>
      </div>
      <div class="footer-col">
        <h5>PEMBAYARAN</h5>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
           <div style="background:white; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.7rem; color:#1e293b;">BCA</div>
           <div style="background:white; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.7rem; color:#1e293b;">DANA</div>
           <div style="background:white; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.7rem; color:#1e293b;">QRIS</div>
        </div>
      </div>
    </div>
    <div class="copyright">
      &copy; 2025 Toko Andra Commerce. All rights reserved.
    </div>
  </footer>

  <a href="https://wa.me/6281234567890" target="_blank" class="float-wa">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
    Chat Andra
  </a>
`

// 2. MODAL HTML INJECTION
const modalHTML = `
  <div id="infoModal" class="modal-overlay">
    <div class="modal-content">
      <span class="modal-close" onclick="tutupModal()">&times;</span>
      <h3 id="modalTitle" style="margin-bottom:15px; color:#2563eb;">Judul</h3>
      <div id="modalBody" style="line-height:1.6; color:#475569; font-size:0.95rem;">Isi konten...</div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

// 3. LOGIC UTAMA (Render Produk)
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

const renderProduk = (dataProduk) => {
  const container = document.getElementById('produk-container');
  const emptyState = document.getElementById('empty-state');
  
  container.innerHTML = ''; 

  if (dataProduk.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  dataProduk.forEach(item => {
    const nomorAndra = "6281234567890"; // GANTI NOMOR WA DISINI
    const pesan = `Halo gan, saya mau pesan *${item.nama}* harga ${formatRupiah(item.harga)}. Stok aman?`;
    const linkWA = `https://wa.me/${nomorAndra}?text=${encodeURIComponent(pesan)}`;

    const card = `
        <div class="card">
            <div class="card-img-wrapper">
               <img src="${item.gambar}" alt="${item.nama}" loading="lazy">
            </div>
            <div class="card-body">
                <span class="label-kategori">${item.kategori}</span>
                <h4>${item.nama}</h4>
                <div class="harga">${formatRupiah(item.harga)}</div>
                <a href="${linkWA}" target="_blank" class="btn-beli">
                  Beli Sekarang
                </a>
            </div>
        </div>
    `;
    container.innerHTML += card;
  });
}

// 4. LOGIC EVENT HANDLER (Global Scope)
window.filterProduk = (kategori, element) => {
  document.querySelectorAll('.btn-kategori').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  if (kategori === 'all') {
    renderProduk(produk);
  } else {
    const filtered = produk.filter(item => item.kategori === kategori);
    renderProduk(filtered);
  }
}

// Logic Search
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = produk.filter(item => 
    item.nama.toLowerCase().includes(keyword) || 
    item.kategori.toLowerCase().includes(keyword)
  );
  renderProduk(filtered);
});

// Logic Modal (Pop Up)
const kontenInfo = {
  tentang: {
    judul: "Tentang Toko Andra",
    isi: "Toko Andra adalah destinasi fashion pria di Surabaya. Kami menyediakan outfit berkualitas distro dengan harga bersahabat. Berdiri sejak 2025, kami siap melengkapi gayamu!"
  },
  cara: {
    judul: "Cara Pemesanan",
    isi: "1. Pilih produk.<br>2. Klik <b>Beli Sekarang</b>.<br>3. Terhubung ke WA Admin.<br>4. Kirim chat otomatis.<br>5. Bayar & Tunggu paket datang!"
  },
  retur: {
    judul: "Garansi & Retur",
    isi: "Salah ukuran? Jangan khawatir. Barang bisa ditukar maksimal 2x24 jam setelah diterima. Wajib sertakan video unboxing ya!"
  }
};

window.bukaModal = (kunci) => {
  const data = kontenInfo[kunci];
  if(data) {
    document.getElementById('modalTitle').innerText = data.judul;
    document.getElementById('modalBody').innerHTML = data.isi;
    document.getElementById('infoModal').style.display = 'flex';
  }
}

window.tutupModal = () => {
  document.getElementById('infoModal').style.display = 'none';
}

document.getElementById('infoModal').addEventListener('click', (e) => {
  if (e.target.id === 'infoModal') tutupModal();
});

// Render Awal
renderProduk(produk);