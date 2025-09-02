import { NextResponse } from "next/server";

import db from "@/lib/db.js";

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, address, city, state, contact, image, email } = body;

    const query = `INSERT INTO schools (name, address, city, state, contact, image, email) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.execute(query, [
      name,
      address,
      city,
      state,
      contact,
      image || "",
      email,
    ]);

    return NextResponse.json(
      {
        success: true,
        id: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database Error: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Create School",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = parseInt(searchParams.get("offset")) || 0;

    const query = `SELECT * FROM schools LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await db.execute(query);

    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    console.error("Error in DB Connection:", error);
    return NextResponse.json(
      { success: false, error: "Fetching Failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id"));
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const query = `DELETE FROM schools WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);

    if (rows.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "School not found" },
        { status: 404 }
      );
    }

    console.log(rows);
    return NextResponse.json({ success: true, rows: rows }, { status: 200 });
  } catch (error) {
    console.error("Error in DB Connection:", error);
    return NextResponse.json(
      { success: false, error: "Fetching Failed" },
      { status: 500 }
    );
  }
}
