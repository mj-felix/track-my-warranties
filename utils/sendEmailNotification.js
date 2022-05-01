const dateFormat = require("dateformat");
const sgMail = require("@sendgrid/mail");

module.exports = async (email, productName, dateExpired, entryId) => {
  if ("SENDGRID_API_KEY" in process.env) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const url = process.env.PROD_URL || "http://localhost:3000";
    const msg = {
      to: email,
      from: process.env.NO_RESPONSE_EMAIL,
      subject: `[TrackMyWarranties] ${productName} expires ${dateFormat(
        dateExpired,
        "dd mmm yyyy"
      )}`,
      text: `Warranty details:\n\n${url}/entries/${entryId}`,
    };

    try {
      await sgMail.send(msg);
      console.log(
        `Email sent to ${email}: ${productName} (${entryId}) expires ${dateExpired}`
      );
      return true;
    } catch (e) {
      console.log(
        `Email NOT sent to ${email}: ${productName} (${entryId}) expires ${dateExpired}`
      );
      console.error(e);
    }
  }

  return false;
};
