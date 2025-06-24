const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "j.chukwuony@alustudent.com",
    pass: "lief okuh isgm biyi",
  },
});

exports.sendOtp = functions.https.onCall(async (data, context) => {
  const email = data.email;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  await admin.firestore().collection("otp_verification").doc(email).set({
    code: otp,
    expiresAt,
  });

  const mailOptions = {
    from: "MediCare <j.chukwuony@alustudent.com>",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {success: true};
  } catch (error) {
    console.error("Email error:", error);
    return {success: false, error: error.message};
  }
});
