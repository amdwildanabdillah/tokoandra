<script setup>
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

const checkoutWA = () => {
  if (cartStore.items.length === 0) return
  
  let text = "Halo Admin TokoAndra, saya mau pesan produk digital ini:\n\n"
  cartStore.items.forEach((item, index) => {
    text += `${index + 1}. ${item.nama} - ${formatRupiah(item.harga_jual)}\n`
  })
  text += `\n*Total: ${formatRupiah(cartStore.cartTotal)}*\n\nMohon info detail pembayarannya ya.`
  
  const encodedText = encodeURIComponent(text)
  // Ganti nomor di bawah sama nomor HP admin (pakai awalan 62)
  window.open(`https://wa.me/6281234567890?text=${encodedText}`, '_blank')
}
</script>

<template>
  <!-- Overlay Hitam Blur di Belakang -->
  <transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="cartStore.isOpen" class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]" @click="cartStore.toggleDrawer"></div>
  </transition>

  <!-- Panel Keranjang (Sliding dari kanan) -->
  <transition enter-active-class="transform transition ease-in-out duration-300" enter-from-class="translate-x-full" enter-to-class="translate-x-0" leave-active-class="transform transition ease-in-out duration-300" leave-from-class="translate-x-0" leave-to-class="translate-x-full">
    <div v-if="cartStore.isOpen" class="fixed inset-y-0 right-0 w-full max-w-md bg-white/80 backdrop-blur-2xl border-l border-white/60 shadow-2xl z-[101] flex flex-col">
      
      <!-- Header Drawer -->
      <div class="px-6 py-6 border-b border-white/50 flex justify-between items-center bg-white/30">
        <h2 class="text-xl font-bold text-slate-800">Keranjang Belanja</h2>
        <button @click="cartStore.toggleDrawer" class="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- List Produk di Keranjang -->
      <div class="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p class="font-medium">Keranjang kamu masih kosong nih.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 items-center bg-white/50 p-3 rounded-2xl border border-white/60 shadow-sm">
            <div class="w-16 h-16 bg-slate-200 rounded-xl shrink-0"></div>
            <div class="flex-1">
              <h4 class="font-semibold text-sm text-slate-800 line-clamp-1">{{ item.nama }}</h4>
              <p class="text-blue-600 font-bold text-sm mt-1">{{ formatRupiah(item.harga_jual) }}</p>
            </div>
            <button @click="cartStore.removeFromCart(item.id)" class="p-2 text-red-500 hover:bg-white rounded-full transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Checkout -->
      <div class="p-6 border-t border-white/50 bg-white/60 backdrop-blur-md">
        <div class="flex justify-between items-center mb-6">
          <span class="text-slate-600 font-medium">Total Pembayaran</span>
          <span class="text-2xl font-bold text-slate-800">{{ formatRupiah(cartStore.cartTotal) }}</span>
        </div>
        <button @click="checkoutWA" :disabled="cartStore.items.length === 0" :class="['w-full py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md flex justify-center items-center gap-2', cartStore.items.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white hover:scale-[1.02] active:scale-95']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.18 1.83 5.82L3 22l4.31-.83A9.956 9.956 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1.07 14.95c-.34.09-.85.12-1.39-.14-.54-.25-1.42-.85-2.52-1.95-1.1-1.1-1.7-1.98-1.95-2.52-.25-.54-.22-1.05-.14-1.39.08-.34.34-.69.57-.96.22-.26.31-.43.43-.69.11-.26.06-.48-.03-.69-.08-.22-.37-.89-.51-1.22-.14-.32-.28-.27-.39-.28h-.33c-.11 0-.31.04-.48.22-.17.17-.65.64-.65 1.55 0 .91.66 1.79.75 1.91.09.11 1.3 1.99 3.15 2.79.44.19.78.3 1.05.39.44.14.84.12 1.15.07.35-.05 1.07-.44 1.22-.86.15-.42.15-.78.11-.86-.04-.09-.14-.14-.37-.25z" clip-rule="evenodd" />
          </svg>
          Checkout via WhatsApp
        </button>
      </div>
      
    </div>
  </transition>
</template>