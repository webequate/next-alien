// pages/api/basics.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

const fetchBasics = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("allensaliens");

    const data = await db.collection("basics").findOne({});

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "Basics not found." });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default fetchBasics;
