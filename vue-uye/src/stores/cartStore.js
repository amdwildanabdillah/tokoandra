import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isOpen = ref(false) // Buat kontrol Drawer meluncur

  // Ngitung jumlah barang
  const cartCount = computed(() => items.value.length)
  
  // Ngitung total duit
  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + item.harga_jual, 0)
  })

  const addToCart = (product) => {
    // Karena produk digital, kita asumsikan 1 orang ga perlu beli 2x produk yang sama
    const exists = items.value.find(item => item.id === product.id)
    if (!exists) {
      items.value.push(product)
    }
    // Langsung buka drawer pas sukses nambah barang
    isOpen.value = true
  }

  const removeFromCart = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
  }

  const toggleDrawer = () => {
    isOpen.value = !isOpen.value
  }

  return { items, isOpen, cartCount, cartTotal, addToCart, removeFromCart, toggleDrawer }
})