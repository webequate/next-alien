// types/post.ts
export type Post = {
  id: number;
  creation_timestamp: number;
  title: string;
  uri: string | string[];
  featured?: boolean;
  order?: number | undefined;
};
