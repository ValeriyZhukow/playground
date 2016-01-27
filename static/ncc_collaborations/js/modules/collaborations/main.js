angular.module('nccCollaborations', ['ngRoute', 'nccCollaborations.itemsView',
        'nccCollaborations.api', 'nccCollaborations.iconResolver', 'ui.bootstrap.modal', 'nccTruncate'])
    .config(function ($httpProvider, $locationProvider, $routeProvider) {
        /* Generic configuration of the app */
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/active', {
                templateUrl: '/static/ncc_collaborations/templates/my_shares/items_table.html',
                controller: 'itemsViewCtrl',
                activetab: 'active',
                section: 'myShares'
            }).
            when('/disabled', {
                templateUrl: '/static/ncc_collaborations/templates/my_shares/items_table.html',
                controller: 'itemsViewCtrl',
                activetab: 'disabled',
                section: 'myShares'
            }).
            when('/request_access', {
                templateUrl: '/static/ncc_collaborations/templates/my_shares/request_access_table.html',
                controller: 'requestAccessCtrl',
                activetab: 'request_access',
                section: 'myShares'
            }).
            when('/swm/active', {
                templateUrl: '/static/ncc_collaborations/templates/shared_with_me/shared_with_me_table_active.html',
                controller: 'sharedWithMeCtrl',
                activetab: 'swm_active',
                section: 'sharedWithMe'
            }).
            when('/swm/disabled', {
                templateUrl: '/static/ncc_collaborations/templates/shared_with_me/shared_with_me_table_disabled.html',
                controller: 'sharedWithMeCtrl',
                activetab: 'swm_disabled',
                section: 'sharedWithMe'
            }).
            when('/swm/requested', {
                templateUrl: '/static/ncc_collaborations/templates/shared_with_me/shared_with_me_table_requested.html',
                controller: 'sharedWithMeRequestedCtrl',
                activetab: 'swm_requested',
                section: 'sharedWithMe'
            }).
            otherwise({
                redirectTo: '/swm/active'
            });
    });
