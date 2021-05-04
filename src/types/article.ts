export type Article = {
  _id?: string;
  root?: string;
  xml: string;
  articleId: string;
  version: string;
  datatype: string;
  fileName: string;
  created?: string;
};

export type ArticleManifest = {
  articleId: string;
  type: string;
  path: string;
  assets: Array<{
    id: string;
    type: string;
    path: string;
  }>;
}
