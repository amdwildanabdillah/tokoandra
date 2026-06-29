<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])
const searchQuery = ref('')
const isSearchOpen = ref(false)

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  // (Opsional) Kalau ditutup, kolom pencarian dikosongin lagi:
  if (!isSearchOpen.value) {
    searchQuery.value = ''
    handleSearch()
  }
}
</script>

<template>
  <div class="fixed w-full top-0 z-50 flex flex-col items-center">
    
    <nav class="w-full glass-panel !border-x-0 !border-t-0 !rounded-none px-6 py-4 relative z-50">
      <div class="max-w-6xl mx-auto flex justify-between items-center gap-4">
        
        <div class="flex items-center gap-3 shrink-0 cursor-pointer">
          <div class="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/20 backdrop-blur-md flex items-center justify-center text-blue-600 shadow-sm transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
          </div>
          <h1 class="font-bold text-xl tracking-tight text-slate-800">Andra Store</h1>
        </div>

        <button 
          @click="toggleSearch"
          class="w-10 h-10 rounded-full bg-white/40 border border-white/60 backdrop-blur-md flex items-center justify-center text-slate-600 hover:bg-white/70 hover:text-blue-600 transition-all duration-300 shadow-[0_2px_10px_rgb(0,0,0,0.02)] active:scale-95"
        >
          <svg v-if="!isSearchOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
      </div>
    </nav>

    <transition 
      enter-active-class="transition duration-300 ease-out" 
      enter-from-class="-translate-y-4 opacity-0" 
      enter-to-class="translate-y-0 opacity-100" 
      leave-active-class="transition duration-200 ease-in" 
      leave-from-class="translate-y-0 opacity-100" 
      leave-to-class="-translate-y-4 opacity-0"
    >
      <div v-if="isSearchOpen" class="absolute top-[84px] w-full max-w-2xl px-6 z-40">
        <div class="relative w-full">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="handleSearch"
            placeholder="Cari preset, template..." 
            class="w-full bg-white/70 border border-white/80 rounded-full pl-12 pr-4 py-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-2xl transition-all placeholder-slate-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </transition>
    
  </div>
</template>