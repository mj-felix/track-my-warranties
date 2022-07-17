it("visits main page", () => {
  cy.visit("/");
  cy.contains("TrackMyWarranties");
});