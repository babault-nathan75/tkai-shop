import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";
import { requireAdmin } from "@/lib/admin-guard";
import { isCloudinaryEnabled, uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

function pickFolder(scope: string | null): "products" | "categories" | "misc" {
  if (scope === "products") return "products";
  if (scope === "categories") return "categories";
  return "misc";
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const url = new URL(request.url);
  const folder = pickFolder(url.searchParams.get("scope"));

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Aucun fichier reçu (champ \"file\" requis)." },
      { status: 400 }
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ message: "Fichier vide." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: "Fichier trop volumineux (max 5 Mo)." },
      { status: 413 }
    );
  }

  const ext = ALLOWED_MIME[file.type];
  if (!ext) {
    return NextResponse.json(
      {
        message:
          "Type de fichier non autorisé. Formats acceptés : PNG, JPG, WEBP, GIF.",
      },
      { status: 415 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // 1. Si Cloudinary est configuré, on upload en ligne (persistant, CDN, transformations)
  if (isCloudinaryEnabled()) {
    try {
      const { url: cdnUrl, publicId } = await uploadToCloudinary(buffer, {
        folder: `tkai-shop/${folder}`,
      });
      return NextResponse.json({
        url: cdnUrl,
        provider: "cloudinary",
        publicId,
        size: file.size,
        type: file.type,
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return NextResponse.json(
        {
          message:
            "Erreur upload Cloudinary. Vérifie les credentials CLOUDINARY_* dans .env.",
        },
        { status: 502 }
      );
    }
  }

  // 2. Fallback local : /public/uploads/{folder}/{filename}
  const id = randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${id}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads", folder);

  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);
  } catch (err) {
    console.error("Local upload error:", err);
    return NextResponse.json(
      { message: "Erreur lors de la sauvegarde du fichier." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    url: `/uploads/${folder}/${filename}`,
    provider: "local",
    size: file.size,
    type: file.type,
  });
}
