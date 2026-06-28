<script setup>
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl border-b border-white/60 dark:border-slate-700/50 shadow-sm transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      
      <router-link to="/" class="text-2xl tracking-tight text-slate-800 dark:text-white transition-colors">
        AndraStore.
      </router-link>
      
      <div class="hidden md:block flex-grow max-w-md mx-6">
        <BaseInput v-model="searchQuery" placeholder="Cari produk digital...">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </BaseInput>
      </div>

      <div class="flex items-center gap-3">
        <!-- Panggil komponen ThemeToggle yang udah bener tadi -->
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>