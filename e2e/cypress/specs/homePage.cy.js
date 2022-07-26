const crypto = require("crypto");

it("visits main page", () => {
  cy.visit("/");
  cy.contains("TrackMyWarranties");
});

it("registers, adds warranty and uploads a file", () => {
  const randomEmail = crypto.randomBytes(10).toString("hex") + "@email.com";

  cy.visit("/register");
  cy.get("input[type=email]").type(randomEmail);
  cy.get("input#password").type("password");
  cy.get("input#password2").type("password");
  cy.get("button").contains("Register").click();

  cy.get("input#productName").type("Product Name");
  cy.get("input#datePurchased").type("2021-12-15");
  cy.get("input#dateExpired").type("2023-12-15");
  cy.get("input#storeName").type("Store Name");
  cy.get("button").contains("Save").click();

  cy.get("input#file").selectFile("./cypress/specs/upload_me.png");
  cy.get("table#files").contains("upload_me.png");
});

/*
homePage:
- goes to home page and checks content and links
- goes to register
- goes to login
- goes to forgot password

forgotPassword:
- shows message once

register:
- it registers and redirects to new warranty
- it registers as admin and checks profile
- it regsiters as non admin and checks profile

login:
- it logins and redirects to new warranty
- it logins and redirects to all warranties

allWarranties:
- it checks content and links when no warranty
- once warranty created it checks it is there

createWarraty:
- it creates warranty
- it deletes warranty

uploadAttachment:
- it uploads after creation
- it deletes
- it deletes when whole warranty deleted

editWarranty:
- updates warranty without attachment
- updates warranty with attachment

profile:
- update email

*/
