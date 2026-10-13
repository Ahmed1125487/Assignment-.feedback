// send_email.js
// بيبعت الإيميل كـ Body متنسق (مش كملف مرفق)
// محتاج: npm install nodemailer

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// اقرأ الـ HTML بعد ما تولّده من generate_email.js
const htmlContent = fs.readFileSync(path.join(__dirname, 'feedback_email.html'), 'utf8');

// إعداد بيانات الإرسال (لو بتستخدم Gmail، محتاج "App Password" مش الباسورد العادي)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ahmed0atef.fro@gmail.com',     // ايميلك
    pass: 'nalv higl tafl dfqu'         
  }
});

const mailOptions = {
  from: 'ahmed0atef.fro@gmail.com',
  to: 'atofy3682@gmail.com',       // إيميل المستلم
  subject: 'Assignment Feedback - MongoDB',
  html: htmlContent                    // <-- المهم: html مش attachments
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
