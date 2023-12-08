<template>
  <div>
    <app-dialog :show="open">
      <template #default>
        <div class="px-4 py-4 flex flex-col space-y-3">
          <h2>Create Account</h2>
          <app-text-input v-model="username" placeholder="username" />
        </div>
      </template>
      <template #footer>
        <div class="flex px-3 py-4 space-x-2">
          <app-button class="text-sm" type="primary" text="Create" @click="createAccount" />
          <app-button class="text-sm" type="negative" text="Cancel" @click="open = false" />
        </div>
      </template>
    </app-dialog>
    <div v-if="user">
      <span class="text-2xl">{{ welcomeMessage }}</span>
      <user-leaderboard-details :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/app/components/shared/AppButton.vue';
import AppDialog from '@/app/components/shared/AppDialog.vue';
import AppTextInput from '@/app/components/shared/AppTextInput.vue';

import UserLeaderboardDetails from '@/app/components/user/UserLeaderboardDetails.vue';
import { useUserStore } from '@/app/stores/userStore';
import { computed, onMounted, ref } from 'vue';
const userStore = useUserStore();

const open = ref(false);
const username = ref('');

onMounted(async () => {
  try {
    await userStore.fetchUser();
  } catch (error: unknown) {
    open.value = true;
  }
});

const user = computed(() => userStore.user);

const welcomeMessage = computed(() => `Welcome, ${user.value?.username}`);

async function createAccount() {
  await userStore.addSystemUser(username.value);
  open.value = false;
}
</script>
