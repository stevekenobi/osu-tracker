<template>
  <input type="text" :value="modelValue" class="w-full px-2 border border-slate-600 font-normal focus:outline-none" @input="handleInput" />
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const handleInput = ($event: Event) => {
  const target = $event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>
