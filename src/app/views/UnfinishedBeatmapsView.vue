<template>
  <div v-if="unfinishedStore.unfinished.length > 0" class="grid gap-2">
    <app-paginated-view :items="unfinishedStore.getUnfinished" gap="medium">
      <template #content="{ item }">
        <unfinished-details :beatmap="item" />
      </template>
    </app-paginated-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import UnfinishedDetails from '../components/unfinished/UnfinishedDetails.vue';
import AppPaginatedView from '../components/shared/AppPaginatedView.vue';
import { useUnfinishedStore } from '../stores/unfinishedStore';

const unfinishedStore = useUnfinishedStore();

onMounted(async () => {
  await unfinishedStore.fetchUnfinishedBeatmaps();
});
</script>
