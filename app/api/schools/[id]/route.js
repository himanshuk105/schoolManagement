import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const para = await params;
    const id = para.id;

    const [rows] = await connection.execute(
      `SELECT * FROM schools WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error in DB:", error);
    return NextResponse.json(
      { success: false, error: "Fetching Failed" },
      { status: 500 }
    );
  }
}

// export async function DELETE(request, { params }) {
//   try {
//     const para = await params;
//     const id = para.id;
//     const [rows] = await db.execute(`DELETE FROM schools WHERE id = ?`, [id]);

//     if (rows.affectedRows === 0) {
//       return NextResponse.json(
//         { success: false, error: "School not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, rows }, { status: 200 });
//   } catch (error) {
//     console.error("Error in DB:", error);
//     return NextResponse.json(
//       { success: false, error: "Deleting Failed" },
//       { status: 500 }
//     );
//   }
// }
