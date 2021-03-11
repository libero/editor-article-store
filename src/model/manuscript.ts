import {EditorState} from 'prosemirror-state';
import { Affiliation } from './affiliation';
import { Person } from './person';
// import { Reference } from 'app/models/reference';
import {RelatedArticle} from './related-article';
// import { ArticleInformation } from 'app/models/article-information';
import { KeywordGroups } from './keyword';

interface JournalMeta {
  publisherName: string;
  issn: string;
}

export type Manuscript = {
  journalMeta: JournalMeta;
  title: EditorState;
  // articleInfo: ArticleInformation;
  authors: Person[];
  affiliations: Affiliation[];
  abstract: EditorState;
  impactStatement: EditorState;
  body: EditorState;
  acknowledgements: EditorState;
  keywordGroups: KeywordGroups;
  // references: Reference[];
  relatedArticles: RelatedArticle[];
};
