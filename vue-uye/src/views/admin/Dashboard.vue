<script setup>
import { ref, onMounted } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

const isSidebarOpen = ref(true)

onMounted(() => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false
  }
})

// Data statistik dengan SVG icon
const stats = ref([
  { title: 'Total Pendapatan', value: 'Rp 4.500.000', trend: '+12%', iconType: 'money' },
  { title: 'Pesanan Aktif', value: '12', trend: '+5%', iconType: 'cart' },
  { title: 'Total Produk', value: '45', trend: '0%', iconType: 'box' },
])
</script>

<template>
  <div class="min-h-screen bg-[#f5f5f7] flex font-sans text-[#1d1d1f] overflow-hidden">
    
    <!-- Panggil Sidebar -->
    <AdminSidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <main class="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
      
      <!-- Panggil Header -->
      <AdminHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <div class="p-6 md:p-8 pt-6">
        <!-- Grid Statistik (SVGs replacing emojis) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div v-for="stat in stats" :key="stat.title" class="bg-white p-6 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div class="flex justify-between items-start mb-6">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <!-- SVG Money -->
                <svg v-if="stat.iconType === 'money'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <!-- SVG Cart -->
                <svg v-else-if="stat.iconType === 'cart'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <!-- SVG Box -->
                <svg v-else-if="stat.iconType === 'box'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span :class="['text-xs font-bold px-3 py-1.5 rounded-full shrink-0', stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500']">
                {{ stat.trend }}
              </span>
            </div>
            <h3 class="text-slate-500 text-sm font-medium mb-1">{{ stat.title }}</h3>
            <p class="text-3xl font-bold text-slate-800 tracking-tight">{{ stat.value }}</p>
          </div>
        </div>

        <!-- Area Tabel / Konten -->
        <div class="bg-white rounded-[2rem] border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] p-6 md:p-8 overflow-hidden">
          <div class="flex justify-between items-center mb-8">
            <h3 class="font-bold text-xl text-slate-800">Pesanan Terbaru</h3>
            <router-link to="/admin/orders" class="text-sm font-semibold text-blue-600 hover:text-blue-700">Lihat Semua</router-link>
          </div>
          
          <div class="flex flex-col items-center justify-center py-12 md:py-16 text-center px-4">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 class="font-semibold text-slate-800 mb-1">Belum ada pesanan</h4>
            <p class="text-sm text-slate-500 max-w-xs mx-auto">Data pesanan dari WhatsApp atau form checkout bakal muncul di sini nantinya.</p>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>