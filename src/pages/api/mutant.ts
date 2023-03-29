import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const jsonDirectory = path.join(process.cwd(), "mutant.json");
    const fileContents = await fs.readFile(jsonDirectory, "utf8");
    const dataParse = JSON.parse(fileContents);
     res.status(200).json(dataParse);
    
  }

  
}
