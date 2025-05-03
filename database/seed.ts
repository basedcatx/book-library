import { sampleBooks } from "@/app/constants";
import ImageKit from "imagekit";
import { books } from "@/database/schema";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

config({
  path: `../.env.local`,
});

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql });

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imageKit.upload({
      file: url,
      fileName,
      folder,
    });

    return response.filePath;
  } catch (error) {
    console.error("Error uploading image file", error);
  }
};

const seed = async () => {
  console.log("Seeding database...");

  try {
    for (const book of sampleBooks) {
      const coverUrl = (await uploadToImageKit(
        book.coverUrl,
        `${book.title}.jpg`,
        "/books/covers",
      )) as string;

      await db.insert(books).values({
        ...book,
        coverUrl,
      });

      console.log("Seeding successfully!");
    }
  } catch (err) {
    console.error("Error: Seeding database...", err);
  }
};

seed();
