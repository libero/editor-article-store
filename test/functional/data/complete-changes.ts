const changes = [
  //title
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"prosemirror","timestamp":1621523527175,"path":"title","transactionSteps":[{"stepType":"replace","from":1,"to":23,"slice":{"content":[{"type":"text","text":"1obscureword"}]}}]},
  //author
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"batch","changes":[{"type":"add-object","timestamp":1621523694506,"path":"authors","idField":"id","object":{"_id":"d5141074-c1b7-4b50-8419-c81a56d58c4b","firstName":"2obscureword","lastName":"2obscureword","suffix":"2obscureword","isAuthenticated":false,"orcid":"2obscureword","email":"2obscureword","bio":{"doc":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"2obscureword"}]}]},"selection":{"type":"text","anchor":2,"head":2}},"isCorrespondingAuthor":true,"affiliations":["2df6578f-e732-4722-994f-8d377012993d"],"hasCompetingInterest":false}}],"timestamp":1621523694507},
  //affiliation
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"batch","changes":[{"type":"add-object","timestamp":1621523612425,"path":"affiliations","idField":"id","object":{"_id":"2df6578f-e732-4722-994f-8d377012993d","label":"","institution":{"name":"3obscureword"},"address":{"city":"3obscureword"},"country":"3obscureword"}},{"type":"batch","changes":[{"type":"batch","changes":[{"type":"update-object","timestamp":1621523612426,"path":"affiliations","differences":[{"kind":"E","path":[2,"label"],"lhs":"","rhs":"3"}]}],"timestamp":1621523612426}],"timestamp":1621523612426}],"timestamp":1621523612427},{"type":"batch","changes":[],"timestamp":1621523612429},
  //abstract
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"prosemirror","timestamp":1621523963721,"path":"abstract","transactionSteps":[{"stepType":"replace","from":2,"to":15,"slice":{"content":[{"type":"text","text":"4obscureword"}]}}]},
  //impact statement
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"prosemirror","timestamp":1621524038219,"path":"impactStatement","transactionSteps":[{"stepType":"replace","from":2,"to":23,"slice":{"content":[{"type":"text","text":"5obscureword"}]}}]},
  //body
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"prosemirror","timestamp":1621524273476,"path":"body","transactionSteps":[{"stepType":"replace","from":1,"to":12,"slice":{"content":[{"type":"text","text":"6obscureword"}]}}]},
  //acknowledgements
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"prosemirror","timestamp":1621524359321,"path":"acknowledgements","transactionSteps":[{"stepType":"replace","from":1,"to":16,"slice":{"content":[{"type":"text","text":"7obscureword"}]}}]},
  //reference 
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"batch","changes":[{"type":"add-object","timestamp":1621524434842,"path":"references","idField":"id","object":{"_id":"39d50837-2e60-4342-8995-a3556e3d5b69","authors":[{"firstName":"8","lastName":"8"}],"referenceInfo":{"articleTitle":{"doc":{"type":"annotatedReferenceInfoDoc","content":[{"type":"text","text":"8obscureword"}]},"selection":{"type":"text","anchor":1,"head":1}},"doi":"8obscureword","elocationId":"8obscureword","firstPage":"8obscureword","inPress":true,"lastPage":"8obscureword","pmid":"8obscureword","pmcid":"","source":{"doc":{"type":"annotatedReferenceInfoDoc","content":[{"type":"text","text":"8obscureword"}]},"selection":{"type":"text","anchor":1,"head":1}},"volume":"8obscureword","year":"8obscureword"},"_type":"journal"}},{"type":"rearranging","timestamp":1621524434842,"path":"references","order":[10,0,1,2,3,4,5,6,7,8,9]}],"timestamp":1621524434842},
  //related article
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"add-object","timestamp":1621524532990,"path":"relatedArticles","idField":"id","object":{"_id":"60df283b-063f-4195-b108-bad1d389fcfb","articleType":"commentary-article","href":"9obscureword"}},
  //research orgamism keyword
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"prosemirror","timestamp":1621524608760,"path":"keywordGroups.research-organism.newKeyword.content","transactionSteps":[{"stepType":"replace","from":0,"to":0,"slice":{"content":[{"type":"text","text":"akeyword"}]}}]},
  //author keywords
  {user: 'static-for-now', applied: false, articleId: "54296", "type":"prosemirror","timestamp":1621524686147,"path":"keywordGroups.author-generated.newKeyword.content","transactionSteps":[{"stepType":"replace","from":0,"to":0,"slice":{"content":[{"type":"text","text":"anotherkeyword"}]}}]}
];

export default changes;