import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        '100': true,
      },
      include: ['src/client', 'src/utils'],
      reporter: ['lcov', 'text'],
    },
  },
});
