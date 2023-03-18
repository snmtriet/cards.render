import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { name } = req.query;
    const jsonDirectory = path.join(process.cwd(), "collection.json");
    const fileContents = await fs.readFile(jsonDirectory, "utf8");
    const dataParse = JSON.parse(fileContents);
    if (dataParse[name as string])
      res.status(200).json(dataParse[name as string]);
    else res.status(200).json({ message: "Not found collection bro !" });
  }

  if (req.method === "POST") {
    const newCollection = req.body;
    const collectionsDirectory = path.join(process.cwd(), "collection.json");
    const collectionsData = await fs.readFile(collectionsDirectory, "utf8");
    const collectionsDataParsed = JSON.parse(collectionsData);
    if (collectionsDataParsed[newCollection.collectionSlug]) {
      console.log("Collection already exist !");
      res.status(200).json({ message: "Collection already exist !" });
      return;
    } else {
      await fs.writeFile(
        collectionsDirectory,
        JSON.stringify({
          ...collectionsDataParsed,
          [newCollection.collectionSlug]: newCollection,
        })
      );
      res.status(200).json({
        ...collectionsDataParsed,
        [newCollection.collectionSlug]: newCollection,
      });
    }
  }
}
