// src/actions/deleteBlog.js
import { databases, storage } from "./lib/appwrite";

// Your Appwrite IDs
const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "blog";
const BUCKET_ID = "68d806a40003e90025e6";

export async function deleteBlog(blogId, imageId) {
  try {
    // 1. Delete image if exists
    if (imageId) {
      await storage.deleteFile(BUCKET_ID, imageId);
      console.log("🗑️ Image deleted:", imageId);
    }

    // 2. Delete blog document
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, blogId);
    console.log("🗑️ Blog deleted:", blogId);

    return true;
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    throw error;
  }
}
