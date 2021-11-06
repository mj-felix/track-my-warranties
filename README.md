# TrackMyWarranties by MJ Felix

![TrackMyWarranties by MJ Felix](./public/images/screenshot.jpg)

## Table of Contents

  - [Description](#description)
  - [Scope of Functionalities](#scope-of-functionalities)
    - [Pre-login](#pre-login)
    - [Post-login](#post-login)
  - [Technologies/Components](#technologiescomponents)
  - [Installation Notes](#installation-notes)
    - [Node.js](#nodejs)
    - [MongoDB](#mongodb)
    - [Environement Variables](#environement-variables)
      - [Minimum setup](#minimum-setup)
      - [Extended setup](#extended-setup)
  - [Run Application](#run-application)
  - [Scheduled Email Notifications](#scheduled-email-notifications)
  - [Contact](#contact)

## Description

Add your warranties, upload your receipts and warranty cards, and receive automatic email notifications before the expiry date of the warranty.

Application is fully functional in production environment: [trackmywarranties.mjfelix.dev](https://trackmywarranties.mjfelix.dev)

## Scope of Functionalities

### Pre-login

- Login
- Registration
- Reset password

### Post-login

- See all warranties
- See warranty details
- Add warranty
- Update warranty
- Delete warranty
- Upload attachment to warranty
- Download attachment
- Delete attachment
- See profile + warranties/files stats
- Update email
- Automatic email notifications before warranty due date

## Technologies/Components

![MEN stack](./public/images/men-stack.png)

 - Bootstrap 5
 - Node.js
 - Express.js
 - Embedded JavaScript (EJS)
 - MongoDB (Atlas)
 - Amazon Web Services (AWS) S3
 - SendGrid
 - reCAPTCHA v2
 - Others ([see package.json](https://github.com/mj-felix/track-my-warranties/blob/main/package.json))

Application is deployed on Heroku.

Selection of components was dictated by the Udemy course [The Web Developer Bootcamp 2001](https://www.udemy.com/course/the-web-developer-bootcamp/) from [Colt Steele](https://www.youtube.com/channel/UCrqAGUPPMOdo0jfQ6grikZw). The main difference is the replacement of Cloudinary by AWS S3 as a file storage component as well as the addition of SendGrid to send emails. Application uses free-for-hobbyist technologies.

## Installation Notes

Below components are required to run the application locally (accessible via [localhost:3000](http://localhost:3000/)):

### Node.js

Download installer from [the Node.js website](https://nodejs.org/en/download/) and follow the instructions.

Node Package Manager (NPM) command tool will be installed along with Node.js - run `npm i` in the main directory of the downloaded project to install all required packages/dependencies.

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
NO_RESPONSE_EMAIL=From email configured in SendGrid
```
Transactional emails inlude:
1. email sent to Admin's email on new user registration
2. notification emails about expiring warranty

For more information about SendGrid setup with Node.js see [the official SendGrid docs](https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/).

- **Google reCAPTCHA** on new user registration form:
```
RECAPTCHA_SITE_KEY=site key from Google reCaptcha
RECAPTCHA_SECRET_KEY=secret key from Google reCaptcha
```
For more information about Google reCAPTCHA see [the official Google reCAPTCHA developer's guide](https://developers.google.com/recaptcha/intro) or [create new reCAPTCHA](https://www.google.com/recaptcha/admin/create) - choose reCAPTCHA v2: "I'm not a robot" Checkbox and add `localhost` to Domains.

## Run Application

Before you run the application, make sure the [MongoDB](#mongodb) has been started.

To start the application locally run `npm start` and open `http://localhost:3000` in the browser.
## Scheduled Email Notifications

Application sends automatic email notifications 1 week, 4 weeks and 12 weeks before the expiry date of the warranty.

To trigger these notifications locally run `npm run email`. 

In production environment, the application uses free [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler) plugin, which proved to be sufficient in terms of offered functionality.
 
## Contact

MJ Felix<br>
[mjfelix.dev](https://mjfelix.dev)<br>
mjfelixdev@gmail.com<br>
[linkedin.com/in/mszonline](https://www.linkedin.com/in/mjfelix/) ![Linkedin Profile](https://i.stack.imgur.com/gVE0j.png)
