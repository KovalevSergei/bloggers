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
  id: string;
  name: string;
  youtubeUrl: string;
};

export type postsType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
};

export type postsDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: postsType[];
};

export type UsersDBType = {
  id: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
};
export type UsersDBTypeWithId = WithId<{
  id: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
}>;

export type usersGetDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersDBType[];
};

export type UsersDBTypeReturn = {
  id: string;
  login: string;
};

export type commentsDBTypeWithId = WithId<{
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: string;
}>;

export type commentsDBType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: string;
};

export type commentDBTypePagination = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: commentsDBType[];
};

export type commentsDBPostIdType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: string;
  postId: string;
};
