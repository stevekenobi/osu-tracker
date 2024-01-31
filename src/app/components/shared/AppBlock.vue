<template>
  <div :class="[bgClass, pxClass, pyClass, borderClass, radiusClass, 'w-fit']">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';

const props = defineProps({
  bg: {
    type: String as PropType<'bg-0' | 'bg-1' | 'bg-2' | 'bg-3'>,
    required: false,
    default: 'bg-0',
  },
  paddingHorizontal: {
    type: String as PropType<'none' | 'small' | 'medium' | 'large'>,
    required: false,
    default: 'none',
  },
  paddingVertical: {
    type: String as PropType<'none' | 'small' | 'medium' | 'large'>,
    required: false,
    default: 'none',
  },
  border: {
    type: Boolean,
    required: false,
    default: false,
  },
  radius: {
    type: String as PropType<'none' | 'small' | 'medium' | 'large'>,
    required: false,
    default: 'none',
  },
});

const bgClass = computed(() => {
  return {
    'bg-0': 'bg-slate-100',
    'bg-1': 'bg-slate-200',
    'bg-2': 'bg-slate-300',
    'bg-3': 'bg-slate-400',
  }[props.bg];
});
const pxClass = computed(() => {
  return {
    none: 'px-0',
    small: 'px-2',
    medium: 'px-4',
    large: 'px-6',
  }[props.paddingHorizontal];
});
const pyClass = computed(() => {
  return {
    none: 'py-0',
    small: 'py-2',
    medium: 'py-4',
    large: 'py-6',
  }[props.paddingVertical];
});
const radiusClass = computed(() => {
  return {
    none: 'rounded-sm',
    small: 'rounded-md',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[props.radius];
});
const borderClass = computed(() => (props.border ? 'border border-slate-600' : ''));
</script>
