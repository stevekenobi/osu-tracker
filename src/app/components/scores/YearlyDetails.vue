<template>
  <app-block>{{ beatmapsets.length }}</app-block>
</template>

<script setup lang="ts">
import AppBlock from '../shared/AppBlock.vue';
import type { AppBeatmapset } from '../../../types/app/beatmaps';

defineProps({
  beatmapsets: { type: Array<AppBeatmapset>, required: true },
});
</script>
