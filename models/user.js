// User
// - id
// - email
// - hash
// - token
// - token expiry date
// - date created
// - date last modified

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    // username(email), salt and hash populated by passport
    token: String,
    tokenExpiryDate: Date,
    dateCreated: Date,
    dateModified: Date
});

UserSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        UserExistsError: 'A user with the given email is already registered.',
        MissingUsernameError: 'No email was given'
    }
});

module.exports = mongoose.model('User', UserSchema);