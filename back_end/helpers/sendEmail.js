// emailHelpers.js
const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
require('dotenv').config();

// Configure the transport options
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Configure Handlebars
const handlebarOptions = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
    extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

/**
 * Sends an email using Nodemailer
 * @param {string} from - Sender's email address
 * @param {string} to - Recipient email address
 * @param {string} subject - Subject of the email
 * @param {string} template - Handlebars template name
 * @param {Object} context - Context for the Handlebars template
 */

const sendEmail = async (to, subject, template, context) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        template,  // Template name without .hbs
        context
    };

    console.log("🚀 ~ sendEmail ~ mailOptions:", mailOptions);

    try {
        const sentEmail = await transporter.sendMail(mailOptions);
        console.log("🚀 ~ sendEmail ~ sentEmail:", sentEmail);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { sendEmail };
