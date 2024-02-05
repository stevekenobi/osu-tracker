<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8 border-neutral-500">
        <div class="overflow-hidden">
          <table class="min-w-full text-left text-sm font-light">
            <thead class="border-b font-medium border-neutral-500">
              <tr>
                <th scope="col" class="px-6 py-4">#</th>
                <th scope="col" class="px-6 py-4">Username</th>
                <th scope="col" class="px-6 py-4">Ranked Score</th>
                <th scope="col" class="px-6 py-4">Total Score</th>
                <th scope="col" class="px-6 py-4">Accuracy</th>
                <th scope="col" class="px-6 py-4">Playcount</th>
                <th scope="col" class="px-6 py-4">SSH</th>
                <th scope="col" class="px-6 py-4">SS</th>
                <th scope="col" class="px-6 py-4">SH</th>
                <th scope="col" class="px-6 py-4">S</th>
                <th scope="col" class="px-6 py-4">A</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in store.getLeaderboard" :key="user.id" class="border-b hover:bg-brand-bg-1 cursor-default">
                <td class="whitespace-nowrap px-6 py-4 font-medium">{{ index + 1 }}</td>
                <td class="whitespace-nowrap px-6 py-4">{{ user.username }}</td>
                <td class="whitespace-nowrap px-6 py-4">{{ numeral(user.ranked_score).format('0,0') }}</td>
                <td class="whitespace-nowrap px-6 py-4">{{ numeral(user.total_score).format('0,0') }}</td>
                <td class="whitespace-nowrap px-6 py-4">{{ numeral(user.hit_accuracy).format('0.00') }} %</td>
                <td class="whitespace-nowrap px-6 py-4">{{ numeral(user.play_count).format('0,0') }}</td>
                <td class="whitespace-nowrap px-6 py-4">{{ numeral(user.ssh).format('0,0') }}</td>
                <td class="whitespace-nowrap px-6 py-4">{{ numeral(user.ss).format('0,0') }}</td>
                <td class="whitespace-nowrap px-6 py-4">{{ numeral(user.sh).format('0,0') }}</td>
                <td class="whitespace-nowrap px-6 py-4">{{ numeral(user.s).format('0,0') }}</td>
                <td class="whitespace-nowrap px-6 py-4">{{ numeral(user.a).format('0,0') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import numeral from 'numeral';
import { onMounted } from 'vue';
import { userLeaderboardStore } from '../stores/leaderboardStore';

const store = userLeaderboardStore();

onMounted(async () => store.fetchLeaderboard());
</script>
