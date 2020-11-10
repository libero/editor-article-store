type Content = {
  type: string;
  text: string;
};

type Slice = {
  content: Array<Content>;
};

type Step = {
  stepType: string;
  from: number;
  to: number;
  slice: Slice;
};
export type Change = {
  _id?: string;
  articleId: string;
  steps: Array<Step>;
  applied: boolean,
  user: string,
};
