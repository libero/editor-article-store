const changes = [
    //title
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'prosemirror',
        timestamp: 1621523527175,
        path: 'title',
        transactionSteps: [
            { stepType: 'replace', from: 1, to: 23, slice: { content: [{ type: 'text', text: '1obscureword' }] } },
        ],
    },
    //affiliation
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'batch',
        changes: [
            {
                type: 'add-object',
                timestamp: 1621589021737,
                path: 'affiliations',
                idField: 'id',
                object: {
                    _id: '781a64dc-9202-458f-ba44-e27a77c40e87',
                    label: '',
                    institution: { name: '3obscureword' },
                    address: { city: '3obscureword' },
                    country: '3obscureword',
                },
            },
            {
                type: 'batch',
                changes: [
                    {
                        type: 'batch',
                        changes: [
                            {
                                type: 'update-object',
                                timestamp: 1621589021738,
                                path: 'affiliations',
                                differences: [{ kind: 'E', path: [0, 'label'], lhs: '', rhs: '1' }],
                            },
                        ],
                        timestamp: 1621589021738,
                    },
                ],
                timestamp: 1621589021739,
            },
        ],
        timestamp: 1621589021739,
    },
    { type: 'batch', changes: [], timestamp: 1621589021740 },
    //author
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'batch',
        changes: [
            {
                type: 'add-object',
                timestamp: 1621589028388,
                path: 'authors',
                idField: 'id',
                object: {
                    _id: '79685d69-a71f-4571-a925-38366feb8110',
                    firstName: '2obscureword',
                    lastName: '2obscureword',
                    suffix: '2obscureword',
                    isAuthenticated: false,
                    orcid: '2obscureword',
                    email: '2obscureword',
                    bio: {
                        doc: {
                            type: 'doc',
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: '2obscureword' }] }],
                        },
                        selection: { type: 'text', anchor: 13, head: 13 },
                    },
                    isCorrespondingAuthor: true,
                    affiliations: ['781a64dc-9202-458f-ba44-e27a77c40e87'],
                    hasCompetingInterest: false,
                },
            },
        ],
        timestamp: 1621589028389,
    },
    //abstract
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'prosemirror',
        timestamp: 1621523963721,
        path: 'abstract',
        transactionSteps: [
            { stepType: 'replace', from: 2, to: 15, slice: { content: [{ type: 'text', text: '4obscureword' }] } },
        ],
    },
    //impact statement
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'prosemirror',
        timestamp: 1621524038219,
        path: 'impactStatement',
        transactionSteps: [
            { stepType: 'replace', from: 2, to: 23, slice: { content: [{ type: 'text', text: '5obscureword' }] } },
        ],
    },
    //body
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'prosemirror',
        timestamp: 1621524273476,
        path: 'body',
        transactionSteps: [
            { stepType: 'replace', from: 1, to: 12, slice: { content: [{ type: 'text', text: '6obscureword' }] } },
        ],
    },
    //acknowledgements
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'prosemirror',
        timestamp: 1621524359321,
        path: 'acknowledgements',
        transactionSteps: [
            { stepType: 'replace', from: 1, to: 16, slice: { content: [{ type: 'text', text: '7obscureword' }] } },
        ],
    },
    //reference
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'batch',
        changes: [
            {
                type: 'add-object',
                timestamp: 1621524434842,
                path: 'references',
                idField: 'id',
                object: {
                    _id: '39d50837-2e60-4342-8995-a3556e3d5b69',
                    authors: [{ firstName: '8', lastName: '8' }],
                    referenceInfo: {
                        articleTitle: {
                            doc: {
                                type: 'annotatedReferenceInfoDoc',
                                content: [{ type: 'text', text: '8obscureword' }],
                            },
                            selection: { type: 'text', anchor: 1, head: 1 },
                        },
                        doi: '8obscureword',
                        elocationId: '8obscureword',
                        firstPage: '8obscureword',
                        inPress: true,
                        lastPage: '8obscureword',
                        pmid: '8obscureword',
                        pmcid: '',
                        source: {
                            doc: {
                                type: 'annotatedReferenceInfoDoc',
                                content: [{ type: 'text', text: '8obscureword' }],
                            },
                            selection: { type: 'text', anchor: 1, head: 1 },
                        },
                        volume: '8obscureword',
                        year: '8obscureword',
                    },
                    _type: 'journal',
                },
            },
            {
                type: 'rearranging',
                timestamp: 1621524434842,
                path: 'references',
                order: [10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            },
        ],
        timestamp: 1621524434842,
    },
    //related article
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'add-object',
        timestamp: 1621524532990,
        path: 'relatedArticles',
        idField: 'id',
        object: {
            _id: '60df283b-063f-4195-b108-bad1d389fcfb',
            articleType: 'commentary-article',
            href: '9obscureword',
        },
    },
    //research orgamism keyword
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'prosemirror',
        timestamp: 1621589348531,
        path: 'keywordGroups.author-generated.newKeyword.content',
        transactionSteps: [
            { stepType: 'replace', from: 0, to: 0, slice: { content: [{ type: 'text', text: 'somekeyword' }] } },
        ],
    },
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'batch',
        changes: [
            {
                type: 'add-object',
                timestamp: 1621589349165,
                path: 'keywordGroups.author-generated.keywords',
                idField: 'id',
                object: {
                    _id: '0eb44f75-cd76-4104-9d26-6d1a94709788',
                    content: {
                        doc: { type: 'keyword', content: [{ type: 'text', text: 'somekeyword' }] },
                        selection: { type: 'text', anchor: 11, head: 11 },
                    },
                },
            },
            {
                type: 'batch',
                changes: [
                    {
                        type: 'update-object',
                        timestamp: 1621589349165,
                        path: 'keywordGroups.author-generated.newKeyword',
                        differences: [
                            {
                                kind: 'E',
                                path: ['_id'],
                                lhs: '0eb44f75-cd76-4104-9d26-6d1a94709788',
                                rhs: '349e0ee1-b623-4696-9361-c17a298bc70b',
                            },
                        ],
                    },
                    {
                        type: 'prosemirror',
                        timestamp: 1621589349165,
                        path: 'keywordGroups.author-generated.newKeyword.content',
                        transactionSteps: [{ stepType: 'replace', from: 0, to: 11 }],
                    },
                ],
                timestamp: 1621589349165,
            },
        ],
        timestamp: 1621589349165,
    },
    //author keywords
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'prosemirror',
        timestamp: 1621589483688,
        path: 'keywordGroups.research-organism.newKeyword.content',
        transactionSteps: [
            { stepType: 'replace', from: 0, to: 0, slice: { content: [{ type: 'text', text: 'anotherkeyword' }] } },
        ],
    },
    {
        user: 'static-for-now',
        applied: false,
        articleId: '54296',
        type: 'batch',
        changes: [
            {
                type: 'add-object',
                timestamp: 1621589483942,
                path: 'keywordGroups.research-organism.keywords',
                idField: 'id',
                object: {
                    _id: '3e4531a7-c36e-454f-8c7d-3a17aafec20f',
                    content: {
                        doc: { type: 'keyword', content: [{ type: 'text', text: 'anotherkeyword' }] },
                        selection: { type: 'text', anchor: 14, head: 14 },
                    },
                },
            },
            {
                type: 'batch',
                changes: [
                    {
                        type: 'update-object',
                        timestamp: 1621589483942,
                        path: 'keywordGroups.research-organism.newKeyword',
                        differences: [
                            {
                                kind: 'E',
                                path: ['_id'],
                                lhs: '3e4531a7-c36e-454f-8c7d-3a17aafec20f',
                                rhs: 'be85c3ed-c8fb-4e20-b718-1f9a550c64c8',
                            },
                        ],
                    },
                    {
                        type: 'prosemirror',
                        timestamp: 1621589483942,
                        path: 'keywordGroups.research-organism.newKeyword.content',
                        transactionSteps: [{ stepType: 'replace', from: 0, to: 14 }],
                    },
                ],
                timestamp: 1621589483942,
            },
        ],
        timestamp: 1621589483942,
    },
];

export default changes;
