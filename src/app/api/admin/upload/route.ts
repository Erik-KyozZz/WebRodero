import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { sanitizeFilename } from "@/lib/security";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Allowed extensions for audio presets, samples, archives, and images
const ALLOWED_EXTENSIONS = new Set([
  ".zip", ".rar", ".7z", ".preset", ".fst", ".fxp", ".wav", ".mp3", ".flac",
  ".png", ".jpg", ".jpeg", ".webp", ".pdf"
]);

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "El archivo excede el tamaño máximo permitido (50 MB)" },
        { status: 400 }
      );
    }

    const fileExt = path.extname(file.name).toLowerCase() || ".bin";
    if (!ALLOWED_EXTENSIONS.has(fileExt)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido (${fileExt}). Extensiones válidas: .zip, .rar, .preset, .fst, .png, .jpg, .wav, etc.` },
        { status: 400 }
      );
    }

    const safeOriginalName = sanitizeFilename(file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = "";
    let isBase64Fallback = false;

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${safeOriginalName}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${uniqueFileName}`;
    } catch (fsError: any) {
      console.warn("Error guardando en sistema de archivos local. Usando fallback Base64 Data URI:", fsError);
      const mimeType = file.type || "application/octet-stream";
      const base64 = buffer.toString("base64");
      publicUrl = `data:${mimeType};base64,${base64}`;
      isBase64Fallback = true;
    }

    return NextResponse.json({
      url: publicUrl,
      fileName: safeOriginalName,
      isBase64: isBase64Fallback,
    });
  } catch (error: any) {
    console.error("Error en subida segura de archivo:", error);
    return NextResponse.json(
      { 
        error: "Error al procesar la subida del archivo", 
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
            fileName: sanitizeFilename(name),
            url: `/uploads/${encodeURIComponent(name)}`,
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
