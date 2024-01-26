<template>
  <div class="flex w-full gap-2">
    <app-block padding-horizontal="small" radius="small" :border="true" class="w-1/2">
      Statistics
      <div class="flex w-full">
        <div class="w-1/2">
          <div>Performance</div>
          <div>Ranked Score</div>
          <div>Total Score</div>
          <div>Play Count</div>
          <div>Hit Accuracy</div>
        </div>
        <div class="w-1/2">
          <div>{{ numeral(user.pp).format('0,0.0') }}</div>
          <div>{{ numeral(user.ranked_score).format('0,0') }}</div>
          <div>{{ numeral(user.total_score).format('0,0') }}</div>
          <div>{{ numeral(user.play_count).format('0,0') }}</div>
          <div>{{ numeral(user.hit_accuracy).format('00.00') }} %</div>
        </div>
      </div>
    </app-block>
    <app-block padding-horizontal="small" :border="true" radius="small" class="w-1/2">
      Ranks
      <div class="flex w-full">
        <div class="w-1/2">
          <div>SSH</div>
          <div>SS</div>
          <div>SH</div>
          <div>S</div>
          <div>A</div>
        </div>
        <div class="w-1/2">
          <div>{{ numeral(user.ssh).format('0,0') }}</div>
          <div>{{ numeral(user.ss).format('0,0') }}</div>
          <div>{{ numeral(user.sh).format('0,0') }}</div>
          <div>{{ numeral(user.s).format('0,0') }}</div>
          <div>{{ numeral(user.a).format('0,0') }}</div>
        </div>
      </div>
    </app-block>
  </div>
</template>

<script setup lang="ts">
import numeral from 'numeral';
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
