const AWS = require("aws-sdk");

const s3Config = {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET
}

if (s3Config.accessKeyId === "minioadmin"){ 
    s3Config.endpoint = `http://s3mock:${process.env.S3MOCK_PORT}`;
    s3Config.s3ForcePathStyle = true;
}

const s3 = new AWS.S3(s3Config);

module.exports = s3;