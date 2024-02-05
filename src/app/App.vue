<template>
  <ul class="flex">
    <li v-for="link in links" :key="link.id" class="mr-6">
      <router-link class="text-blue-500 hover:text-blue-800" :to="{ name: link.name }">{{ link.label }}</router-link>
    </li>
  </ul>
  <main>
    <router-view />
  </main>
</template>

<script setup lang="ts">
const links = [
  { id: 'leaderboard', label: 'Leaderboard', name: 'LeaderboardView' },
  { id: 'unfinished', label: 'Unfinished', name: 'UnfinishedView' },
];
</script>
