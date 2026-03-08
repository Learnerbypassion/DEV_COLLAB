import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const sendEmail = async ({ to, subject, html }) => {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const messageParts = [
    `From: "DevCollab" <${process.env.EMAIL_USER}>`,
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    html,
  ];

  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
};





// 📩 OTP EMAIL
async function sendOtpEmail(userEmail, userName, otp) {
  const subject = "Your DevCollab Verification Code";

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;padding:30px;background:#f4f6f8;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;text-align:center;">
      <h2>Hello ${userName}, 👋</h2>
      <p>Use the following OTP to verify your account:</p>
      <h1 style="letter-spacing:4px;color:#4f46e5;">${otp}</h1>
      <p>This code will expire in <strong>5 minutes</strong>.</p>
      <p style="font-size:12px;color:#777;">
        If you didn’t request this, please ignore this email.
      </p>
    </div>
  </div>
  `;

  await sendEmail({ to: userEmail, subject, html });
}





// 📩 REGISTRATION SUCCESS EMAIL
async function sendRegistrationEmail(userEmail, userName) {
  const subject = "Welcome to DevCollab 🚀";

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;padding:30px;background:#f4f6f8;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;">
      
      <h1 style="color:#111827;">Welcome to DevCollab, ${userName}! 🎉</h1>

      <p style="color:#374151;line-height:1.6;">
        Your account has been successfully created.
      </p>

      <p style="color:#374151;line-height:1.6;">
        DevCollab is your space to connect with developers,
        build projects together, and grow your skills.
      </p>

      <div style="margin:25px 0;padding:20px;background:#eef2ff;border-radius:10px;">
        <p style="margin:0;color:#4338ca;font-weight:600;">
          Start exploring projects and collaborating today 🚀
        </p>
      </div>

      <p style="color:#6b7280;font-size:14px;">
        Happy building,<br/>
        <strong>Team DevCollab</strong>
      </p>

    </div>
  </div>
  `;

  await sendEmail({ to: userEmail, subject, html });
}





// 📩 LOGIN ALERT EMAIL
async function sendLoginEmail(userEmail, userName) {
  const loginTime = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = "New Login to Your DevCollab Account";

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;padding:30px;background:#f4f6f8;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;">
      
      <h2>Hello ${userName}, 👋</h2>

      <p style="color:#374151;">
        We detected a new login to your DevCollab account.
      </p>

      <div style="margin:20px 0;padding:15px;background:#f3f4f6;border-radius:8px;">
        <strong>Login Time:</strong> ${loginTime}
      </div>

      <p style="color:#6b7280;font-size:14px;">
        If this was you, you can safely ignore this email.
      </p>

      <p style="color:#dc2626;font-size:14px;">
        If this wasn’t you, please reset your password immediately.
      </p>

      <p style="margin-top:20px;color:#6b7280;font-size:14px;">
        Stay secure,<br/>
        <strong>Team DevCollab</strong>
      </p>

    </div>
  </div>
  `;

  await sendEmail({ to: userEmail, subject, html });
}



export default {
  sendRegistrationEmail,
  sendLoginEmail,
  sendOtpEmail,
};