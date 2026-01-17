// const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME!;
// const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET!;
const CLOUD_NAME = 'duej7j4zr';
const UPLOAD_PRESET = 'CHATAPP';
export interface UploadResult {
    url: string;
    publicId: string;
    originalName: string;
    size: number;
    mimeType: string;
}
if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Missing Cloudinary env config");
}
export async function uploadToCloudinary(
    file: File,
    folder: "chat-images" | "chat-files"
): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!res.ok) {
        throw new Error("Upload Cloudinary failed");
    }

    const data = await res.json();

    return {
        url: data.secure_url,
        publicId: data.public_id,
        originalName: data.original_filename,
        size: data.bytes,
        mimeType: data.resource_type
    };
}
