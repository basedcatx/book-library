import { sampleBooks } from "@/app/constants";
import ImageKit from "imagekit";
import { books } from "@/database/schema";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import dummyBooks from "@/public/dummybooks.json";

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

  for (const book of dummyBooks) {
    try {
      console.log(`Seeding book: ${book.title}`);
      const coverUrl = (await uploadToImageKit(
        book.coverUrl,
        `${book.title}.jpg`,
        "/xbooks/books/covers",
      )) as string;

      const videoUrl = (await uploadToImageKit(
        book.videoUrl,
        `${book.title}.mp4`,
        "/xbooks/books/videos",
      )) as string;

      await db.insert(books).values({
        ...book,
        coverUrl,
        videoUrl,
      });

      console.log("Seeding successfully!");
    } catch (err) {
      console.error(`Error while seeding book ${book.title}`);
      console.error("Error: Seeding database...", err);
    }
  }
};
