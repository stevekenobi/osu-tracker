<template>
  <div>
    <div class="mb-2 flex w-full justify-between">
      <div>
        Sort by
        <select v-model="unfinishedStore.selectedSort" class="px-1 rounded-md text-gray-900 ring-1 border border-slate-600 bg-slate-200 ring-inset ring-gray-300 hover:bg-gray-50">
          <option v-for="value in unfinishedStore.availableValues" :key="value" class="bg-slate-200 rounded-sm">{{ value }}</option>
        </select>
      </div>
      <div><app-text-input v-model="selectedPage" placeholder="Jump to page ..." @update:model-value="jumpToPage" /></div>
    </div>
    <div v-if="unfinishedStore.unfinished.length > 0" class="grid gap-2">
      <app-paginated-view ref="paginationComponentRef" :items="unfinishedStore.getUnfinished" gap="medium" @update:page="selectedPage = ''">
        <template #content="{ item }">
          <unfinished-details :beatmap="item" />
        </template>
      </app-paginated-view>
    </div>
    <div v-else>No unfinished beatmaps found ;)</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UnfinishedDetails from '../components/unfinished/UnfinishedDetails.vue';
import AppPaginatedView from '../components/shared/AppPaginatedView.vue';
import AppTextInput from '../components/shared/AppTextInput.vue';
import { useUnfinishedStore } from '../stores/unfinishedStore';

const unfinishedStore = useUnfinishedStore();

const selectedPage = ref('');

const paginationComponentRef = ref<InstanceType<typeof AppPaginatedView>>();

function jumpToPage() {
  const pageNumber = Number.parseInt(selectedPage.value);
  paginationComponentRef.value?.jumpToPage(isNaN(pageNumber) ? 1 : pageNumber);
}

onMounted(async () => {
  await unfinishedStore.fetchUnfinishedBeatmaps();
});
</script>
