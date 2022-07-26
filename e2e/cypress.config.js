const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    viewportHeight: 1080,
    viewportHWidth: 1920,
    supportFile: false,
    specPattern: "cypress/specs/**/*.cy.js",
    video: false,
  },
});
