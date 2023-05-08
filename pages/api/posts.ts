// pages/api/posts.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

const fetchPosts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("allensaliens");

    const data = await db
      .collection("posts")
      .find({})
      .sort({ creation_timestamp: 1 })
      .limit(40)
      .toArray();

    res.json(data);
  } catch (e) {
    console.error(e);
  }
};

export default fetchPosts;
