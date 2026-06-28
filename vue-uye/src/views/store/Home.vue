<script setup>
import Navbar from '@/components/store/Navbar.vue'
import ProductCard from '@/components/store/ProductCard.vue'
import { ref } from 'vue'

const categories = ['Semua', 'Lightroom', 'PPT', 'Canva']
const activeCategory = ref('Semua')
const cartCount = ref(2)

const dummyProducts = ref([
  { id: 1, nama: 'Preset Lightroom Cinematic Dark', kategori: 'Lightroom', harga_jual: 45000 },
  { id: 2, nama: 'Template PPT Pitch Deck Premium', kategori: 'PPT', harga_jual: 75000 },
  { id: 3, nama: 'Bundle Canva Sosial Media 2024', kategori: 'Canva', harga_jual: 50000 },
  { id: 4, nama: 'Preset Wedding Natural Pack', kategori: 'Lightroom', harga_jual: 60000 },
])
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#f8f8fb] dark:bg-slate-950 font-sans transition-colors duration-300 relative overflow-hidden">
    
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-[100px]"></div>
      <div class="absolute top-[40%] right-[-10%] w-80 h-80 bg-cyan-400/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-10%] left-[10%] w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px]"></div>
    </div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      
      <main class="flex-grow max-w-6xl mx-auto w-full px-6 py-10 pb-32">
        <div class="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/80 dark:border-slate-700/50 rounded-[2rem] p-10 mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
          <h2 class="relative z-10 text-3xl md:text-5xl tracking-tight text-slate-800 dark:text-white mb-3">
            Tingkatkan Kreativitasmu.
          </h2>
          <p class="relative z-10 text-slate-500 dark:text-slate-400 text-lg max-w-lg">
            Koleksi preset, template, dan produk digital premium.
          </p>
        </div>

        <div class="flex justify-start md:justify-center gap-3 overflow-x-auto pb-4 mb-8 snap-x snap-mandatory pr-6 pl-1 -mx-2 md:mx-0">
          <button 
            v-for="cat in categories" :key="cat"
            @click="activeCategory = cat"
            :class="[
              'snap-start px-6 py-2.5 rounded-2xl text-sm whitespace-nowrap transition-all duration-300 backdrop-blur-md', 
              activeCategory === cat 
                ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-white/80 dark:border-slate-700/50 hover:bg-white/90'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in dummyProducts" 
            :key="product.id" 
            :item="product" 
          />
        </div>
      </main>

      <button class="fixed bottom-8 right-8 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border border-white/80 dark:border-slate-700/50 p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.1)] text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <span v-if="cartCount > 0" class="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-blue-500 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white dark:border-slate-900">
          {{ cartCount }}
        </span>
      </button>
    </div>
  </div>
</template>