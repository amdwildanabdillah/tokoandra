<script setup>
defineProps({
  item: { type: Object, required: true }
})
</script>

<template>
  <div class="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border border-white/80 dark:border-slate-700/50 rounded-3xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer flex flex-col">
    
    <div class="aspect-square mb-4 rounded-2xl bg-[#f5f5f7]/60 dark:bg-slate-800/50 flex items-center justify-center border border-white/50 dark:border-slate-700/30 overflow-hidden relative">
      <span class="text-slate-400 dark:text-slate-500 text-sm">Image</span>
    </div>
    
    <span class="text-[11px] tracking-wide text-blue-500 uppercase mb-1.5">{{ item.kategori }}</span>
    <h3 class="text-base text-slate-800 dark:text-white leading-snug mb-3 line-clamp-2">
      {{ item.nama }}
    </h3>
    
    <div class="mt-auto flex items-center justify-between">
      <span class="text-lg text-slate-800 dark:text-white tracking-tight">
        Rp {{ item.harga_jual.toLocaleString('id-ID') }}
      </span>
      <button class="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-2.5 rounded-2xl transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" /></svg>
      </button>
    </div>
  </div>
</template>