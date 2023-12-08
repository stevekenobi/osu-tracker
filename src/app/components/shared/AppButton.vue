<template>
  <button :class="buttonClass">
    {{ text }}
  </button>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: 'primary',
    validator(value: string) {
      return ['primary', 'secondary', 'negative'].includes(value);
    },
  },
});

const { type } = toRefs(props);

const buttonClass = computed(() => {
  return { [type.value]: true };
});
</script>

<style scoped lang="scss">
button {
  @apply border-0 rounded px-3 py-1;
}

.primary {
  @apply bg-blue-600 text-white hover:bg-blue-500;
}

.secondary {
  @apply bg-transparent hover:bg-brand-blue-2 hover:text-white;
}

.negative {
  @apply bg-red-600 text-white hover:bg-red-500;
}
</style>
