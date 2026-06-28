<script setup>
import Navbar from '@/components/store/Navbar.vue'
import ProductCard from '@/components/store/ProductCard.vue'
import { ref } from 'vue'

const categories = ['Semua', 'Lightroom', 'PPT', 'Canva']
const activeCategory = ref('Semua')
const cartCount = ref(2)
const selectedProduct = ref(null)

const dummyProducts = ref([
  { id: 1, nama: 'Preset Lightroom Cinematic Dark', kategori: 'Lightroom', harga_jual: 45000 },
  { id: 2, nama: 'Template PPT Pitch Deck Premium', kategori: 'PPT', harga_jual: 75000 },
  { id: 3, nama: 'Bundle Canva Sosial Media 2024', kategori: 'Canva', harga_jual: 50000 },
  { id: 4, nama: 'Preset Wedding Natural Pack', kategori: 'Lightroom', harga_jual: 60000 },
])
</script>

<template>
  <div class="relative min-h-screen font-sans bg-[#f5f5f7] text-[#1d1d1f]">
    
    <!-- Ornamen Liquid Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <!-- Blob Biru -->
      <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"></div>
      <!-- Blob Ungu -->
      <div class="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]"></div>
      <!-- Blob Cyan -->
      <div class="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[130px]"></div>
    </div>

    <!-- Navbar -->
    <Navbar />

    <!-- Konten Utama -->
    <main class="relative z-10 flex-grow max-w-6xl mx-auto w-full px-6 pt-32 pb-32">
      
      <!-- Main Hero Card (Lebih Glassy dengan Inner Glow) -->
      <div class="relative overflow-hidden rounded-[2.5rem] p-12 mb-12 flex flex-col items-center justify-center text-center border border-white/50 bg-white/20 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]">
        
        <!-- Aksen Cahaya (Glow Blob) di dalam card -->
        <div class="absolute -top-24 -left-24 w-72 h-72 bg-blue-400/30 rounded-full blur-[70px] pointer-events-none transition-colors duration-500"></div>
        <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-400/30 rounded-full blur-[70px] pointer-events-none transition-colors duration-500"></div>
        
        <h2 class="relative z-10 text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Tingkatkan Kreativitasmu.
        </h2>
        <p class="relative z-10 text-gray-600 text-lg md:text-xl max-w-xl">
          Koleksi preset, template, dan produk digital premium dengan kualitas terbaik.
        </p>
      </div>

      <!-- Filter Kategori -->
      <div class="flex justify-start md:justify-center gap-3 overflow-x-auto pt-3 pb-4 mb-8 scrollbar-hide pr-6 pl-1 -mx-2 md:mx-0">
        <button 
          v-for="cat in categories" :key="cat"
          @click="activeCategory = cat"
          :class="[
            'px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border backdrop-blur-md', 
            activeCategory === cat 
              ? 'bg-blue-500/15 border-blue-500/30 text-blue-700 shadow-md scale-105' 
              : 'bg-white/40 border-white/60 text-slate-600 hover:bg-white/60'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Grid Produk -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Event emit @click buat nangkep item yang dipilih -->
        <ProductCard 
          v-for="product in dummyProducts" 
          :key="product.id" 
          :item="product"
          @click="selectedProduct = product"
        />
      </div>
    </main>

    <!-- Floating Cart Button -->
    <button class="fixed bottom-8 right-8 z-50 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] !rounded-full p-4 hover:scale-110 active:scale-95 transition-all duration-300 group">
      <div class="relative">
        <span v-if="cartCount > 0" class="absolute -top-6 -right-6 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
          {{ cartCount }}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#1d1d1f] group-hover:text-blue-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      </div>
    </button>

    <!-- Modal Popup Detail Produk -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="selectedProduct" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Overlay Blur -->
        <div class="absolute inset-0 bg-white/20 backdrop-blur-md" @click="selectedProduct = null"></div>
        
        <!-- Card Detail -->
        <div class="relative w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-8 shadow-2xl">
          <button @click="selectedProduct = null" class="absolute top-4 right-4 p-2 bg-gray-200/50 rounded-full hover:bg-gray-300/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <div class="aspect-video w-full bg-gray-200 rounded-xl mb-6"></div>
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-600">{{ selectedProduct.kategori }}</span>
          <h3 class="text-2xl font-bold mt-4 mb-2">{{ selectedProduct.nama }}</h3>
          <p class="text-xl text-blue-600 font-bold mb-6">Rp {{ selectedProduct.harga_jual.toLocaleString('id-ID') }}</p>
          <button class="w-full py-3 bg-[#1d1d1f] text-white font-semibold rounded-xl hover:scale-[1.02] transition-transform shadow-md">
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>