<template>
  <app-block padding-horizontal="small" radius="small">
    <div>Performance: {{ user.pp }} pp</div>
  </app-block>
</template>

<script setup lang="ts">
import AppBlock from '@/app/components/shared/AppBlock.vue';
import type { PropType } from 'vue';
import type { AppUser } from '@/types';

defineProps({
  user: {
    type: Object as PropType<AppUser>,
    required: true,
  },
});
</script>
