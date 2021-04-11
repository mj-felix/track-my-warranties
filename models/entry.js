// Entry
// - id
// - product name
// - date purchased
// - warranty expiry date
// - store name
// - additional comment
// - date created
// - date last modified
// - user id

// Document
// - id
// - original file name
// - stored file name
// - mimeType
// - size
// - location/href/url
// - date created
// - entry id

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    originalFileName: String,
    storedFileName: String,
    mimeType: String,
    size: Number,
    url: String,
    bucket: String,
    dateCreated: Date
});

const EntrySchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    datePurchased: {
        type: Date,
        required: true
    },
    dateExpired: {
        type: Date,
        required: true
    },
    storeName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active'],
        required: true
    },
    additionalComment: String,
    dateCreated: Date,
    dateModified: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    files: [FileSchema]
});

module.exports = mongoose.model('Entry', EntrySchema);