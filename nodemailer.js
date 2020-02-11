"use strict";
const nodemailer = require("nodemailer");

const sendEmail = (email, token) => {
    return new Promise(async (resolve, reject) => {
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            service: 'gmail',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
                from: 'asad.khalid@salsoft.net', // sender address
                to: email, // list of receivers
                subject: "Forget Password - Verification Code", // Subject line
                html: `<h1>Verification code</h1>
                <p>${token}</p><br>`
            })
            .then(info => resolve(info))
            .catch(err => reject(err))
    })
}

module.exports = sendEmail