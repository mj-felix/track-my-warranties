const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    supportFile: false,
    specPattern: "cypress/specs/**/*.cy.js",
    video: false,
  },
});
