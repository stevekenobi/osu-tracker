<template>
  <app-block :border="true" radius="small" padding-horizontal="medium" padding-vertical="small" class="w-full" bg="bg-1" :hoverable="true">
    <div class="flex justify-between">
      <div class="flex gap-2">
        <span>{{ beatmap.Beatmap.artist }}</span>
        <span>{{ beatmap.Beatmap.title }}</span>
        <span>by {{ beatmap.Beatmap.creator }}</span>
        <span>{{ beatmap.Beatmap.version }}</span>
      </div>
      <div class="justify-end">
        <span>{{ playcountText }}</span>
      </div>
    </div>
  </app-block>
</template>

<script setup lang="ts">
import AppBlock from '../shared/AppBlock.vue';
import { AppUnfinishedBeatmap } from '@/types';
import { PropType, computed } from 'vue';

const props = defineProps({
  beatmap: {
    type: Object as PropType<AppUnfinishedBeatmap>,
    required: true,
  },
});

const playcountText = computed(() => `played ${props.beatmap.play_count} time${props.beatmap.play_count > 1 ? 's' : ''}`);
</script>
