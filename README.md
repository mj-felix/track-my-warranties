# TrackMyWarranties by MJ Felix

## Live Website

[trackmywarranties.mjfelix.dev](https://trackmywarranties.mjfelix.dev)


## Technologies/Components

 - Bootstrap 5
 - Node.js
 - Express.js
 - Embedded JavaScript (EJS)
 - MongoDB (Atlas)
 - Aamazon Web Services (AWS) S3
 - SendGrid
 - Others ([see package.json](https://github.com/mj-felix/track-my-warranties/blob/main/package.json))

 Web application deployed on Heroku.

## Installation Notes

Below components are required to run the application locally (accessible via [localhost:3000](http://localhost:3000/)):

### Node.js

Download installer from [the Node.js website](https://nodejs.org/en/download/) and follow the instructions.

Node Package Manager (NPM) command tool will be installed along with Node.js - run `npm install` in the main directory of the downloaded project to install all required packages/dependencies.

### MongoDB

To install MongoDB Community Edition follow the instructions for your platform on [the offcial MongoDB website](https://docs.mongodb.com/manual/administration/install-community/).

### Environement Variables

#### Minimum setup
```
ADMIN_EMAIL=your email
```
This will allow to set the user as Admin when this email is used during registration.

#### Extended setup

- **AWS S3 cloud storage** for uploaded files:
```
S3_ACCESS_KEY=key obtained from AWS S3
S3_ACCESS_SECRET=secret obtained from AWS S3
S3_BUCKET=track-my-warranties-dev
```
For AWS S3 setup, go to [aws.amazon.com/s3](https://aws.amazon.com/s3/) and create an account. Once the account has been set up, navigate to the S3 services dashboard to create a new bucket with the name as above. Allow all public access while creating a bucket. Once the bucket has been created, go to Permissions tab and set Bucket policy to be:

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicRead",
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                    "s3:GetObject",
                    "s3:GetObjectVersion"
                ],
                "Resource": "arn:aws:s3:::track-my-warranties-dev/*"
            }
        ]
    }

To obtain access key and secret, open account dropdown and select “My Security Credentials”. Within the security credentials dashboard, open the “Access Keys” section and select “Create New Access Key.” This will generate the access key and secret for the application.

- **SendGrid service** to send reset password and transactional emails:
```
SENDGRID_API_KEY=key obtained from SendGrid
NO_RESPONSE_EMAIL=From email configured with SendGrid
```
Transactional emails inlude: email sent to Admin's email on new user registration and notification emails about expiring warranty.

For more information about SendGrid setup with Node.js see [the official SendGrid docs](https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/).

- **Google reCAPTCHA** on new user registration form:
```
RECAPTCHA_SITE_KEY=key from Google reCaptcha
RECAPTCHA_SECRET_KEY=secret from Google reCaptcha
```
For more information about Google reCAPTCHA see [the official Google reCAPTCHA developer's guide](https://developers.google.com/recaptcha/intro) or [create new reCAPTCHA](https://www.google.com/recaptcha/admin/create) - choose reCAPTCHA v2: "I'm not a robot" Checkbox and add `localhost` to Domains.

## Scheduled Email Notifications

Application sends automatic email notifications 1 week, 4 weeks and 12 weeks before the expiry date of the warranty.

To trigger these notifications locally run `node sendNotificationsSchedule.js` in the main directory of the application. 

In production environment, application uses [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler).
 
## Contact

MJ Felix<br>
mjfelixdev@gmail.com<br>
[LinkedIn Profile](https://www.linkedin.com/in/mjfelix/) ![Linkedin Profile](https://i.stack.imgur.com/gVE0j.png)

## Backlog

 1. Accessibility improvements
 2. Password strength