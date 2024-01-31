<template>
  <div v-if="unfinishedStore.unfinished.length > 0" class="grid gap-2">
    <unfinished-details v-for="beatmap in unfinishedStore.getUnfinished" :key="beatmap.beatmap_id" :beatmap="beatmap" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import UnfinishedDetails from '../components/unfinished/UnfinishedDetails.vue';
import { useUnfinishedStore } from '../stores/unfinishedStore';

const unfinishedStore = useUnfinishedStore();

onMounted(async () => {
  await unfinishedStore.fetchUnfinishedBeatmaps();
});
</script>
