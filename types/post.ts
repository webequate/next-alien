// types/post.ts
export type Post = {
  _id: string;
  creation_timestamp: string;
  uri: string | string[];
  title: string;
  featured?: boolean;
  order?: number;
};
