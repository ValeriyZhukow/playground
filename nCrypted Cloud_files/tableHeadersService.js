var sharedWithMeHeaders = {
    active: [
        {title: 'Title', slug: 'name', sortable: false, filterable: false},
        {title: 'Sender', slug: 'sender', sortable: false, filterable: false},
        {title: 'Organization', slug: 'organization', sortable: false, filterable: false},
        {title: 'Date Shared', slug: 'created', sortable: false, filterable: false},
        {title: 'Expiration', slug: 'expire', sortable: false, filterable: false},
        {title: 'Last accessed', slug: 'expire', sortable: false, filterable: false},
        {title: 'Action', sortable: false, filterable: false}
    ],
    disabled: [
        {title: 'Title', slug: 'name', sortable: false, filterable: false},
        {title: 'Sender', slug: 'recipient', sortable: false, filterable: false},
        {title: 'Organization', slug: 'organization', sortable: false, filterable: false},
        {title: 'Date Shared', slug: 'created', sortable: false, filterable: false},
        {title: 'Expiration', slug: 'expire', sortable: false, filterable: false},
        {title: 'Last accessed', slug: 'expire', sortable: false, filterable: false},
        {title: 'Action', sortable: false, filterable: false}
    ],
    requested: [
        {title: 'Title', slug: 'name', sortable: false, filterable: false},
        {title: 'Owner', slug: 'recipient', sortable: false, filterable: false},
        {title: 'Organization', slug: 'organization', sortable: false, filterable: false},
        {title: 'Date Requested', slug: 'created', sortable: false, filterable: false},
        {title: 'Extension Requested', slug: 'expire', sortable: false, filterable: false},
        {title: 'Last accessed', slug: 'expire', sortable: false, filterable: false},
        {title: 'Action', sortable: false, filterable: false}
    ]
};


var requestAccessHeaders = [
    {title: 'Title', slug: 'name', sortable: false, filterable: false, order: false},
    {title: 'Requestor', slug: 'email', sortable: false, filterable: false, order: false},
    {title: 'Organization', slug: 'organization', sortable: false, filterable: false, order: false},
    {title: 'Date Requested', slug: 'created', sortable: true, filterable: false, order: '-'},
    {title: 'Extension Requested', slug: 'requested', sortable: false, filterable: false, order: false},
    {title: 'Last Accessed', slug: 'accesses', sortable: false, filterable: false, order: false, wrap: true},
    {title: 'Action', sortable: false, filterable: false, order: false}
];


var mySharesHeaders = [
    {title: 'Title', slug: 'name', sortable: false, filterable: false},
    {title: 'Recipient', slug: 'recipient', sortable: false, filterable: false},
    {title: 'Organization', slug: 'organization', sortable: false, filterable: false},
    {title: 'Date Shared', slug: 'created', sortable: true, filterable: false},
    {title: 'Expiration', slug: 'expire', sortable: false, filterable: false},
    {title: 'Last accessed', slug: 'expire', sortable: false, filterable: false},
    {title: 'Action', sortable: false, filterable: false}
];

var tableHeaders = {
    sharedWithMeHeaders: sharedWithMeHeaders,
    requestAccessHeaders: requestAccessHeaders,
    mySharesHeaders: mySharesHeaders
};


angular.module('nccCollaborations')
    .value('tableHeadersService', tableHeaders);