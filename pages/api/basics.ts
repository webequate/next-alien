// pages/api/basics.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

const fetchBasics = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("allensaliens");

    const data = await db.collection("basics").find({}).toArray();

    res.json(data);
  } catch (e) {
    console.error(e);
  }
};

export default fetchBasics;
