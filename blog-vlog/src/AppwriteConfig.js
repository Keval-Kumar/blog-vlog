// // AppwriteConfig.js
// import { Client, Databases } from "appwrite";

// // Create Appwrite client

// const client = new Client();

// client
//   .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Appwrite endpoint
//   .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Appwrite project ID

//  const databases = new Databases(client);
// export { client, databases };

// src/lib/appwrite.js
// src/lib/appwrite.js
import { Client, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Cloud endpoint
  .setProject("<YOUR_PROJECT_ID>"); // 🔹 Project ID from Appwrite console

// Create database service instance
export const databases = new Databases(client);
export { ID };

