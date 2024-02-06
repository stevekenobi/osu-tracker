<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8 border-neutral-500">
        <div class="overflow-hidden">
          <table class="min-w-full text-left text-sm font-light">
            <thead class="border-b font-medium border-neutral-500">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Ranked Score</th>
                <th scope="col">Total Score</th>
                <th scope="col">Accuracy</th>
                <th scope="col">Playcount</th>
                <th scope="col">SSH</th>
                <th scope="col">SS</th>
                <th scope="col">SH</th>
                <th scope="col">S</th>
                <th scope="col">A</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in store.getLeaderboard" :key="user.Link" class="border-b hover:bg-brand-bg-1 cursor-default">
                <td class="font-medium">{{ index + 1 }}</td>
                <td>{{ user.Username }}</td>
                <td>{{ user['Ranked Score'] }}</td>
                <td>{{ user['Total Score'] }}</td>
                <td>{{ user.Accuracy }} %</td>
                <td>{{ user.Playcount }}</td>
                <td>{{ user.SSH }}</td>
                <td>{{ user.SS }}</td>
                <td>{{ user.SH }}</td>
                <td>{{ user.S }}</td>
                <td>{{ user.A }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { userLeaderboardStore } from '../stores/leaderboardStore';

const store = userLeaderboardStore();

onMounted(async () => store.fetchLeaderboard());
</script>

<style lang="scss" scoped>
th {
  @apply px-6 py-4;
}
td {
  @apply whitespace-nowrap px-6 py-4;
}
</style>
