const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      volumeDiscountThreshold: 5,
      discountType: 'volume',
      mockEnvironment: true,
      testMode: 'local',
    },

    setupNodeEvents(on, config) {
      return config
    },
  },
})
