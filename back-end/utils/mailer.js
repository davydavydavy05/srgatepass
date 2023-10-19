/**
 ** This function sends the mail to the email address of the user
**/

import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const mailer = ({ receiver, subject, body }) => {
  let transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  })

  let mailOptions = {
    from: process.env.USER,
    to: receiver,
    subject,
    html: body
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(`Error occured: ${error}`)
      } else {
        resolve(`Mail sent: ${info}`)
      }
    })
  })
}

export default mailer