import { MongoClient } from "mongodb";

import {
  bloggersWithIdType,
  postsWithIdType,
  UsersDBTypeWithId,
  commentsDBTypeWithId,
  ipDBTypeWithId,
  refreshToken,
} from "./types";

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);

let db = client.db("lesson03");

export const bloggersCollection = db.collection<bloggersWithIdType>("bloggers");
export const postsCollection = db.collection<postsWithIdType>("posts");
export const userscollection = db.collection<UsersDBTypeWithId>("users");
export const commentsCollection =
  db.collection<commentsDBTypeWithId>("comments");
export const refreshTokencollection = db.collection<refreshToken>("token");
export const ipCollection = db.collection<ipDBTypeWithId>("ip");

export async function runDb() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to mongo server");
  } catch {
    console.log("Can't connect to db");
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
