// types/post.ts
export type Post = {
  _id: string;
  id: number;
  creation_timestamp: string;
  uri: string | string[];
  title: string;
  featured?: boolean;
  order?: number;
};
