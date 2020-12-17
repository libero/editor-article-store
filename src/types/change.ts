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

type SerializedChangeType = 'steps' | 'object';

export interface SerializedChangePayload {
  path: string;
  steps?: Array<Step>;
  object?: Record<string, any> | Record<string, any>[];
  timestamp: number;
  type: SerializedChangeType;
}

export type Change = {
  _id?: string;
  articleId: string;
  // todo: this probably needs to be on a step by step basis. Like this because client generate a step for each action.
  applied: boolean; 
  user: string;
} & SerializedChangePayload;
