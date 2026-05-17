import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

let configured = false;

function ensureConfigured(): boolean {
  if (configured) return true;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) return false;
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  configured = true;
  return true;
}

export function isCloudinaryEnabled(): boolean {
  return ensureConfigured();
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder: string; filename?: string }
): Promise<{ url: string; publicId: string }> {
  if (!ensureConfigured()) {
    throw new Error("Cloudinary non configuré (CLOUDINARY_* manquants).");
  }

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: "image",
        unique_filename: true,
        overwrite: false,
        // Optimisations automatiques côté Cloudinary
        transformation: [
          { quality: "auto:good", fetch_format: "auto" },
        ],
      },
      (error, res) => {
        if (error || !res) {
          reject(error || new Error("Upload Cloudinary sans réponse."));
          return;
        }
        resolve(res);
      }
    );
    stream.end(buffer);
  });

  return { url: result.secure_url, publicId: result.public_id };
}
