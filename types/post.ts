// types/post.ts
export type Post = {
  id: number;
  creation_timestamp: number;
  uri: string | string[];
  title: string;
  featured?: boolean;
  order?: number;
};
