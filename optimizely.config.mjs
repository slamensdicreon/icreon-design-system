/** @type {import('@optimizely/cms-sdk').OptimizelyConfig} */
export default {
  components: [
    "src/components/blocks/**/*.tsx",
    "src/components/elements/**/*.tsx",
    "!src/components/**/*.stories.tsx",
    "!src/components/**/*.test.tsx",
  ],
};
