// src/lib/appwrite.js
import { Client, Databases, ID,Storage,Permission,Role ,Account,Query as AppwriteQuery} from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // 🚀 Appwrite endpoint
  .setProject("68d7e24c0033b9d1e47b");     // ⚙️ Replace with your Project ID

 const databases = new Databases(client);
 const storage = new Storage(client);
const account = new Account(client);
export const DATABASE_ID = "68d7e4db00031ecceb59";
export const COLLECTION_ID = "blog";
export const BUCKET_ID = "68d806a40003e90025e6";
export { client, databases, storage, Permission, ID,Role,account,AppwriteQuery as Query };
