export type ReferenceType =
  | 'journal'
  | 'periodical'
  | 'book'
  | 'report'
  | 'data'
  | 'web'
  | 'preprint'
  | 'software'
  | 'confproc'
  | 'thesis'
  | 'patent';

export type ReferenceContributor =
  | {
  firstName?: string;
  lastName?: string;
}
  | {
  groupName?: string;
};