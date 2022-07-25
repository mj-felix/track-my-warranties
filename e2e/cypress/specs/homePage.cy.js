it("visits main page", () => {
  cy.visit("/");
  cy.contains("TrackMyWarranties888");
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
