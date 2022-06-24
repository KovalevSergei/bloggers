import { ObjectId, WithId } from "mongodb";

export type bloggersWithIdType = WithId<bloggersType>;

export type bloggersDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: bloggersType[];
};

export type postsWithIdType = WithId<postsType>;

export type bloggersType = {
  id: number;
  name: string;
  youtubeUrl: string;
};

export type postsType = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: number;
  bloggerName: string;
};

export type postsDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: postsType[];
};
