import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import {
  bloggersWithIdType,
  postsWithIdType,
  UsersDBTypeWithId,
  commentsDBTypeWithId,
  ipDBTypeWithId,
  refreshToken,
  bloggersType,
  UsersDBType,
  postsType,
  commentsDBType,
  likeCommentsWithId,
  likePostWithId,
} from "./types";

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
let dbName = process.env.mongodbName || "mongoose-example";

const bloggersSchema = new mongoose.Schema<bloggersType>({
  id: String,
  name: String,
  youtubeUrl: String,
});

const postsSchema = new mongoose.Schema<postsType>({
  id: String,
  title: String,
  shortDescription: String,
  content: String,
  bloggerId: String,
  bloggerName: String,
});

const usersSchema = new mongoose.Schema<UsersDBType>({
  id: String,
  accountData: {
    login: String,
    email: String,
    passwordHash: String,
    passwordSalt: String,
    createdAt: Date,
  },
  emailConfirmation: {
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean,
  },
});

const commentsSchema = new mongoose.Schema<commentsDBType>({
  id: String,
  content: String,
  userId: String,
  userLogin: String,
  addedAt: String,
});

const tokenSchema = new mongoose.Schema({
  token: String,
});
const ipSchema = new mongoose.Schema({
  point: String,
  ip: String,
  data: Date,
});
const likeComments = new mongoose.Schema<likeCommentsWithId>({
  commentsId: String,
  userId: String,
  login: String,
  myStatus: String,
  addedAt: Date,
});

const likePosts = new mongoose.Schema<likePostWithId>({
  postsId: String,
  userId: String,
  login: String,
  myStatus: String,
  addedAt: Date,
});

export const bloggersModel = mongoose.model("bloggers", bloggersSchema);
export const postsModel = mongoose.model("posts", postsSchema);
export const usersModel = mongoose.model("users", usersSchema);
export const commentsModel = mongoose.model("comments", commentsSchema);
export const tokenModel = mongoose.model("token", tokenSchema);
export const ipModel = mongoose.model("ip", ipSchema);
export const likeCommentsModel = mongoose.model("likeComments", likeComments);
export const likePostsModel = mongoose.model("likePost", likePosts);
//export const client = new MongoClient(mongoUri);

//let db = client.db("mongoose-example");

//export const bloggersCollection = db.collection<bloggersWithIdType>("bloggers");
//export const postsCollection = db.collection<postsWithIdType>("posts");
//export const userscollection = db.collection<UsersDBTypeWithId>("users");
//export const commentsCollection =
// db.collection<commentsDBTypeWithId>("comments");
//export const refreshTokencollection = db.collection<refreshToken>("token");
//export const ipCollection = db.collection<ipDBTypeWithId>("ip");

export async function runDb() {
  try {
    // Connect the client to the server
    //await client.connect();
    await mongoose.connect(mongoUri, { dbName });
    console.log("Connected successfully to mongo server");
  } catch {
    console.log("Can't connect to db");
    // Ensures that the client will close when you finish/error
    //await client.close();
    await mongoose.disconnect();
  }
}
