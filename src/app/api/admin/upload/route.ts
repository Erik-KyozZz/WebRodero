import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear carpeta uploads en public si no existe
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generar nombre de archivo único
    const fileExt = path.extname(file.name);
    const uniqueFileName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName: file.name,
    });
  } catch (error: any) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json(
      { error: "Error al guardar el archivo", details: error.message },
      { status: 500 }
    );
  }
}
