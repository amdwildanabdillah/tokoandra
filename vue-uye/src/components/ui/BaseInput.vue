<script setup>
defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Ketik sesuatu...' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative group">
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder" 
      class="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/80 dark:border-slate-700/50 focus:border-blue-400/50 dark:focus:border-blue-500/50 focus:bg-white/90 dark:focus:bg-slate-800/90 outline-none transition-all duration-300 text-sm placeholder-slate-400 text-slate-700 dark:text-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.01)]"
    >
    <div class="absolute left-4 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
      <slot name="icon"></slot>
    </div>
  </div>
</template>