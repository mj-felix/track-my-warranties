const dateFormat = require("dateformat");
const sgMail = require('@sendgrid/mail');

module.exports = async (email, productName, dateExpired, entryId) => {

    console.log(email, productName, dateExpired, entryId);

    if ('SENDGRID_API_KEY' in process.env) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const url = process.env.PROD_URL || 'http://localhost:3000';
        const msg = {
            to: email,
            from: process.env.NO_RESPONSE_EMAIL,
            subject: `[Track My Warranties] ${productName} expires on ${dateFormat(dateExpired, 'dd mmm yyyy')}`,
            text: `Warranty details:\n\n${url}/entries/${entryId}`,
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
    }


}