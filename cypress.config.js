const { defineConfig } = require('cypress');

module.exports = defineConfig({
  env: {
    delay: 200,
    logId: '01H2JXJESBT1A5CDX9VM4RZBXN',
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:9000',
  },
  component: {
    specPattern: 'src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
});
