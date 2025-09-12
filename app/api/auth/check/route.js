import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const to = process.env.JWT_SECRET;

    const token = await cookies();

    const final = token.get("refreshToken")?.value;

    if (!final) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = jwt.verify(final, to);

    return NextResponse.json({
      authenticated: true,
      email: decoded.email,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
