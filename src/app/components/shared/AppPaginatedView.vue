<template>
  <div :class="[gapClass, 'grid']">
    <div v-for="(item, index) in paginatedItems" :key="index">
      <slot name="content" :item="item" :index="index">{{ index }}</slot>
    </div>

    <div class="flex items-center justify-between py-3">
      <div class="flex flex-1 justify-between sm:hidden">
        <div
          class="cursor-pointer relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="currentPage = previousPage ?? 1"
        >
          Previous
        </div>
        <div
          class="relative ml-3 cursor-pointer inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="currentPage = nextPage ?? maxPage"
        >
          Next
        </div>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (currentPage - 1) * size + 1 }}</span>
            to
            <span class="font-medium">{{ currentPage * size }}</span>
            of
            <span class="font-medium">{{ items.length }}</span>
            results
          </p>
        </div>
        <div>
          <div class="isolate inline-flex rounded-md">
            <div
              class="relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              @click="currentPage = previousPage ?? 1"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </div>

            <div
              v-for="page in closePages"
              :key="page"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
              :class="{ 'bg-brand-blue-1 text-white hover:bg-blue-800': page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </div>

            <div
              class="relative inline-flex items-center rounded-r-md cursor-pointer px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              @click="currentPage = nextPage ?? maxPage"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref, computed, ref } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  size: {
    type: Number,
    required: false,
    default: 20,
  },
  gap: {
    type: String as PropType<'none' | 'small' | 'medium' | 'large'>,
    required: false,
    default: 'none',
  },
});

const gapClass = computed(() => {
  return {
    none: 'gap-0',
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-4',
  }[props.gap];
});

const maxPage = computed(() => Math.ceil(props.items.length / props.size));
const currentPage = ref(1);

const { previousPage, nextPage } = usePreviousAndNextPages(currentPage, maxPage);

const paginatedItems = computed(() => {
  const page = currentPage.value;
  const firstIndex = (page - 1) * props.size;
  const lastIndex = page * props.size;
  return props.items.slice(firstIndex, lastIndex);
});

const closePages = computed(() => {
  if (currentPage.value <= 2) return [1, 2, 3, 4, 5];
  if (currentPage.value >= maxPage.value - 2) return [maxPage.value - 4, maxPage.value - 3, maxPage.value - 2, maxPage.value - 1, maxPage.value];
  return [currentPage.value - 2, currentPage.value - 1, currentPage.value, currentPage.value + 1, currentPage.value + 2];
});

function usePreviousAndNextPages(currentPage: Ref<number>, maxPage: Ref<number>) {
  const previousPage = computed(() => {
    const previousPage = currentPage.value - 1;
    return previousPage >= 1 ? previousPage : undefined;
  });

  const nextPage = computed(() => {
    const nextPage = currentPage.value + 1;
    return nextPage <= maxPage.value ? nextPage : undefined;
  });

  return { nextPage, previousPage };
}
</script>
