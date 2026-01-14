"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function uploadFile(formData: FormData, candidateId: number, type: "cv" | "documents") {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "candidates", candidateId.toString());
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `${type}_${timestamp}.${extension}`;
    const filepath = join(uploadDir, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return public URL
    const publicPath = `/uploads/candidates/${candidateId}/${filename}`;
    return { success: true, path: publicPath };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

export async function uploadMultipleFiles(formData: FormData, candidateId: number) {
  try {
    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return { success: false, error: "No files provided" };
    }

    const uploadDir = join(process.cwd(), "public", "uploads", "candidates", candidateId.toString());
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedPaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const extension = file.name.split(".").pop();
      const filename = `doc_${timestamp}_${Math.random().toString(36).substring(7)}.${extension}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      uploadedPaths.push(`/uploads/candidates/${candidateId}/${filename}`);
    }

    return { success: true, paths: uploadedPaths };
  } catch (error) {
    console.error("Error uploading files:", error);
    return { success: false, error: "Failed to upload files" };
  }
}
