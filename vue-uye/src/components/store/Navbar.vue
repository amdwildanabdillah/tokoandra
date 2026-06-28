<script setup>
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>

<template>
  <nav class="fixed w-full top-0 z-50 glass-panel !border-x-0 !border-t-0 !rounded-none px-6 py-4">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      
      <!-- Brand Logo + Icon Glass -->
      <div class="flex items-center gap-3">
        <!-- Icon Store sekarang pake Tinted Glass Biru -->
        <div class="w-10 h-10 rounded-full bg-blue-500/15 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/20 backdrop-blur-md flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
        </div>
        <h1 class="font-bold text-xl tracking-tight">Toko Andra</h1>
      </div>

      <div class="flex items-center gap-4">
        <ThemeToggle />
      </div>
      
    </div>
  </nav>
</template>