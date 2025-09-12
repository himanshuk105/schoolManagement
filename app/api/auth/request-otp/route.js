// import connection from "@/lib/db";
// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request) {
//   try {
//     const { email } = await request.json();

//     if (!email) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Email Required",
//         },
//         { status: 400 }
//       );
//     }

//     const code = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

//     await connection.query(
//       "INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)",
//       [email, code, expiresAt]
//     );

//     const transport = nodemailer

//     await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: [email],
//       subject: "Your OTP Code",
//       html: `<p>Your OTP is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error in DB: ", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to send Otp",
//       },
//       { status: 500 }
//     );
//   }
// }

import connection from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email Required" },
        { status: 400 }
      );
    }

    // Generate OTP and expiry
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in DB
    await connection.query(
      "INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)",
      [email, code, expiresAt]
    );

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // your SMTP username
        pass: process.env.SMTP_PASS, // your SMTP password
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: `"Onboarding" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending OTP: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
