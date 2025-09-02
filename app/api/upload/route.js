import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error("Directory Exist");
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `school-${uniqueSuffix}${path.extname(file.name)}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    return NextResponse.json({
      success: true,
      filename,
    });
  } catch (error) {
    console.error("Error in DB: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Upload File",
      },
      { status: 500 }
    );
  }
}
