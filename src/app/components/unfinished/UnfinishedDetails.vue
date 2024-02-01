<template>
  <app-block :border="true" radius="small" padding-horizontal="medium" padding-vertical="small" class="w-full" bg="bg-1" :hoverable="true">
    <div class="flex justify-between gap-10">
      <div class="w-5/6">
        <div class="flex justify-between">
          <div class="flex gap-2">
            <span>{{ beatmap.Beatmap.artist }}</span>
            <span>{{ beatmap.Beatmap.title }}</span>
            <span>by {{ beatmap.Beatmap.creator }}</span>
          </div>
          <span>{{ playcountText }}</span>
        </div>
        <div class="flex justify-between">
          <div class="flex gap-2">
            <span>{{ beatmap.Beatmap.version }}</span>
            <span>{{ beatmap.Beatmap.difficulty_rating }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-4">
              <path
                d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
              />
            </svg>
          </div>
          <div class="flex gap-2 justify-end items-center">
            <span>AR: {{ beatmap.Beatmap.ar }}</span>
            <span>CS: {{ beatmap.Beatmap.cs }}</span>
            <span>HP: {{ beatmap.Beatmap.hp }}</span>
            <span>OD: {{ beatmap.Beatmap.od }}</span>
            <span>BPM: {{ beatmap.Beatmap.bpm }}</span>
          </div>
        </div>
      </div>
      <div class="justify-end flex items-center">
        <a :href="`https://osu.ppy.sh/b/${beatmap.beatmap_id}`" target="_blank"> Go to map</a>
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
