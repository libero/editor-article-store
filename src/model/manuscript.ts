import {EditorState} from 'prosemirror-state';
import { Affiliation } from './affiliation';
import { Person } from './person';
import {RelatedArticle} from './related-article';
import { KeywordGroups } from './keyword';
import {ArticleInformation} from "./article-information";
import {Reference} from "./reference";

interface JournalMeta {
  publisherName: string;
  issn: string;
}

export type Manuscript = {
  journalMeta: JournalMeta;
  title: EditorState;
  articleInfo: ArticleInformation;
  authors: Person[];
  affiliations: Affiliation[];
  abstract: EditorState;
  impactStatement: EditorState;
  body: EditorState;
  acknowledgements: EditorState;
  keywordGroups: KeywordGroups;
  references: Reference[];
  relatedArticles: RelatedArticle[];
};
