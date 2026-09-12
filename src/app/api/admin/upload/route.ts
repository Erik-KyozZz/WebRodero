import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = "";
    let isBase64Fallback = false;

    try {
      // Intentar guardar en disco local (funciona en servidor propio / localhost)
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const fileExt = path.extname(file.name) || ".bin";
      const uniqueFileName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${fileExt}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${uniqueFileName}`;
    } catch (fsError: any) {
      console.warn("Error guardando en sistema de archivos (ej. Vercel read-only). Usando fallback Data URI Base64:", fsError);
      // Fallback para entornos sin disco escribible (ej. Vercel Serverless)
      const mimeType = file.type || "application/octet-stream";
      const base64 = buffer.toString("base64");
      publicUrl = `data:${mimeType};base64,${base64}`;
      isBase64Fallback = true;
    }

    return NextResponse.json({
      url: publicUrl,
      fileName: file.name,
      isBase64: isBase64Fallback,
    });
  } catch (error: any) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json(
      { 
        error: "Error al guardar el archivo", 
        details: error?.message || String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { readdir, stat } = await import("fs/promises");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const fileNames = await readdir(uploadDir);

    const files = await Promise.all(
      fileNames.map(async (name) => {
        try {
          const filePath = path.join(uploadDir, name);
          const stats = await stat(filePath);
          return {
            fileName: name,
            url: `/uploads/${name}`,
            size: stats.size,
            createdAt: stats.birthtime,
          };
        } catch {
          return null;
        }
      })
    );

    const validFiles = files
      .filter((f): f is NonNullable<typeof f> => f !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ files: validFiles });
  } catch (error: any) {
    return NextResponse.json({ files: [] });
  }
}
