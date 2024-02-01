<template>
  <div :class="[gapClass, 'grid']">
    <div v-for="(item, index) in paginatedItems" :key="index">
      <slot name="content" :item="item" :index="index">{{ index }}</slot>
    </div>

    <div class="mx-auto mt-8">
      <div class="flex flex-row flex-nowrap">
        <div class="flex items-center justify-center cursor-pointer">
          <span v-if="previousPage" class="mx-3 text-sm font-semibold text-brand-blue-1" @click="currentPage = previousPage">Previous</span>
        </div>

        <div v-for="page in closePages" :key="page" class="flex items-center justify-center cursor-pointer w-full">
          <div
            :class="[
              'mx-3',
              'text-sm',
              'rounded-md',
              'flex',
              'justify-center',
              'self-center',
              'font-semibold',
              'w-8',
              'h-7',
              currentPage === page ? ['text-black', 'bg-blue-400'] : 'text-brand-blue-1',
            ]"
            @click="currentPage = page"
          >
            {{ page }}
          </div>
        </div>

        <div class="flex items-center justify-center cursor-pointer">
          <span v-if="nextPage" class="mx-3 text-sm font-semibold text-brand-blue-1" @click="currentPage = nextPage">Next</span>
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
