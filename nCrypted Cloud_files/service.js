angular.module('nccCollaborations.api').config([
    // do not remove! this decorator will make sure that our POST requests will be made with slash at the end
    '$provide', '$httpProvider',
    function($provide, $httpProvider) {
        $provide.decorator('$resource', function($delegate) {
            return function() {
                if (arguments.length > 0) {  // URL
                    arguments[0] = arguments[0].replace(/\/$/, '\\/');
                }

                if (arguments.length > 2) {  // Actions
                    angular.forEach(arguments[2], function(action) {
                        if (action && action.url) {
                            action.url = action.url.replace(/\/$/, '\\/');
                        }
                    });
                }

                return $delegate.apply($delegate, arguments);
            };
        });
        $provide.factory('enforceSlashInterceptor', function() {
            return {
                request: function(config) {
                    config.url = config.url.replace(/[\/\\]+$/, '/');
                    return config;
                }
            };
        });

        $httpProvider.interceptors.push('enforceSlashInterceptor');
    }
]);

angular.module('nccCollaborations.api')
    .factory('shareItemApi', function($resource) {
        return $resource(
            '/collaboration_management/api/v1/secure_views/:id/',
            {id: '@id'},
            {
                query: {
                    method: 'GET',
                    isArray: false,
                    transformResponse: function(data) {
                        var parsedData = angular.fromJson(data);

                        return {
                            items: parsedData.items,
                            total: parsedData.total
                        };
                    }
                },
                update: {
                    method: 'PUT'
                }
            });
    })


    .factory('svCounterApi', function($resource) {
        return $resource(
            '/collaboration_management/api/v1/counter/sv/', {},
            {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
    })


    .factory('swmCounterApi', function($resource) {
        return $resource(
            '/collaboration_management/api/v1/counter/swm/', {},
            {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
    })


    .factory('sharedWithMeApi', function($resource) {
        return $resource('/shared_with_me/api/v1/:id/', {id: '@id'},
            {
                update: {
                    method: 'PUT'
                }
            }
        );
    })


    .factory('sharedWithMeRequestedApi', function($resource) {
        return $resource('/shared_with_me/api/v1/requests/:id/', {id: '@id'},
            {
                update: {
                    method: 'PUT'
                }
            }
        );
    })


    .factory('collaborationApi', function($resource) {
        return $resource(
            '/collaboration_management/api/v1/collaborations/:id/',
            {id: '@id'},
            {
                update: {
                    method: 'PUT'
                }
            });
    })


    .factory('notificationsApi', function($resource) {
        return $resource(
            '/collaboration_management/api/v1/notifications/:id/',
            {id: '@id'},
            {
                send: {
                    method: 'POST'
                }
            });
    })


    .factory('collaborationRequestsApi', function($resource) {
        return $resource(
            '/collaboration_management/api/v1/collaboration_requests/:id/',
            {id: '@id', is_delete: '@is_delete'},
            {
                update: {
                    method: 'PUT'
                }
            });
    });
