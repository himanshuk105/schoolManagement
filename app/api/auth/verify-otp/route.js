import connection from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [rows] = await connection.query(
      "SELECT * FROM otps WHERE email = ? AND code = ? ORDER BY created_at DESC LIMIT 1",
      [email, code]
    );

    const otp = Array.isArray(rows) ? rows[0] : null;

    if (!otp)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    if (new Date(otp.expires_at) < new Date()) {
      return NextResponse.json({ error: "Expired OTP" }, { status: 400 });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d", // 7 days instead of 1 hour
    });

    const cookiestore = await cookies();

    cookiestore.set({
      name: "refreshToken",
      value: token,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    const response = NextResponse.json({ success: true });

    // Clear any existing OTP after successful login
    await connection.query("DELETE FROM otps WHERE email = ?", [email]);

    return response;
  } catch (error) {
    console.error("Error in DB: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify OTP",
      },
      { status: 500 }
    );
  }
}
