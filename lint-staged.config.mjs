// plugins: ['@typescript-eslint'],
/**  @type {import('lint-staged').Config} */

export default {
  '*.{js,ts}': ['eslint --fix'],
  '*.{js,ts,vue}': ['prettier --write'],
};
