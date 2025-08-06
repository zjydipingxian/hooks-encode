import { defineConfig } from 'vitest/config';

import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    // reporters: ['html'],
    globals: true,
    environment: 'jsdom',
    include: ['packages/hooks/src/**/__tests__/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8', // or 'istanbul'
      include: ['packages/hooks/src/**/*.{ts,tsx}'],
      exclude: ['packages/hooks/src/**/__tests__/*.{ts,tsx}', 'packages/hooks/src/**/*.d.ts', 'packages/hooks/src/*.ts'],
    },
    alias: {
      zhongjiayao_v3_hooks: resolve(__dirname, 'packages/hooks/src'),
    },
  },
});
