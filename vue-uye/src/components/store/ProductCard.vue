<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: Object
})

// Bikin warna tint kaca sesuai kategori
const categoryColor = computed(() => {
  switch(props.item.kategori) {
    case 'Lightroom': return 'bg-blue-500/5 border-blue-500/20 dark:bg-blue-500/10 dark:border-blue-500/30'
    case 'PPT': return 'bg-orange-500/5 border-orange-500/20 dark:bg-orange-500/10 dark:border-orange-500/30'
    case 'Canva': return 'bg-purple-500/5 border-purple-500/20 dark:bg-purple-500/10 dark:border-purple-500/30'
    default: return 'glass-panel'
  }
})
</script>

<template>
  <div 
    :class="[
      'rounded-[1.5rem] p-4 cursor-pointer hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-xl border shadow-sm', 
      categoryColor
    ]"
  >
    <div class="aspect-[4/3] w-full bg-white/50 dark:bg-black/30 rounded-xl mb-4"></div>
    <div class="px-1">
      <h3 class="font-semibold text-base leading-snug mb-2 line-clamp-2">{{ item.nama }}</h3>
      <p class="text-sm font-bold opacity-80">Rp {{ item.harga_jual.toLocaleString('id-ID') }}</p>
    </div>
  </div>
</template>