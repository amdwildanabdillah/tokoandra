<script setup>
defineEmits(['toggle-sidebar'])
</script>

<template>
  <header class="p-6 md:p-8 md:pb-0 flex justify-between items-center bg-[#f5f5f7] sticky top-0 z-30">
    <div class="flex items-center gap-4">
      <button @click="$emit('toggle-sidebar')" class="p-2.5 bg-white border border-gray-200 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-50 shadow-sm transition-colors active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div>
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
        <p class="text-slate-500 text-sm hidden sm:block">Pantau performa tokomu hari ini.</p>
      </div>
    </div>
    
    <div class="flex items-center gap-3 md:gap-4">
      <button class="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 shadow-sm transition-colors relative">
        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      </button>
      <div class="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Andra&backgroundColor=e2e8f0" alt="Avatar" class="w-full h-full object-cover" />
      </div>
    </div>
  </header>
</template>