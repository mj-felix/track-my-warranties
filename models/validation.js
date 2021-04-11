const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.entryValidationSchema = Joi.object({
    entry: Joi.object({
        productName: Joi.string().required().escapeHTML(),
        datePurchased: Joi.date().required(),
        dateExpired: Joi.date().required(),
        storeName: Joi.string().required().escapeHTML(),
        additionalComment: Joi.string().allow('').escapeHTML()
    }).required()
});

module.exports.userValidationSchema = Joi.object({
    email: Joi.string().required().allow('').email()
});

// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required().min(1).max(5),
//         body: Joi.string().required().escapeHTML()
//     }).required()
// })