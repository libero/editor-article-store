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
  // todo: this probably needs to be on a step by step basis. Like this because client generate a step for each action.
  applied: boolean; 
  user: string;
  // path in document e.g. abstract or body.p1
  path: string;
  timestamp: number; 
};
