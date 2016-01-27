angular.module('nccCollaborations.itemsView')
    .factory('operationsApi', operationsApi);

function operationsApi(shareItemApi, collaborationApi, notificationsApi, sharedWithMeApi,
                       sharedWithMeRequestedApi, svCounterApi, swmCounterApi) {
    var publicApi = {};


    var generateSortStrings = function(sortingOptions) {
        return _.map(sortingOptions, function(dir, field) {
            return dir + field;
        }).join('.');
    };


    publicApi.resendNotifications = function(data) {
        var requestParams = {
            collaborations: _.map(data, function(item) {
                return item.id;
            })
        };
        return notificationsApi.send(requestParams).$promise;
    };


    // Items api
    publicApi.getItems = function(requestedPage, itemsPerPage, sortBy, filterBy) {
        var requestParams, sort;

        requestParams = {
            page: requestedPage,
            perPage: itemsPerPage
        };

        sort = generateSortStrings(sortBy);

        if (sort) {
            requestParams.orderBy = sort;
        }

        if (!_.isEmpty(filterBy)) {
            _.extend(requestParams, filterBy);
        }

        return shareItemApi.query(requestParams).$promise;
    };


    publicApi.getSharedWithMe = function(itemsPerPage, requestedPage, sortBy, filterBy) {
        var sort = generateSortStrings(sortBy);

        var requestParams = {
            page: requestedPage,
            perPage: itemsPerPage
        };

        if (sort) {
            requestParams.orderBy = sort;
        }

        if (!_.isEmpty(filterBy)) {
            _.extend(requestParams, filterBy);
        }
        return sharedWithMeApi.get(requestParams).$promise;
    };


    publicApi.getSharedWithMeRequested = function(itemsPerPage, requestedPage, sortBy, filterBy) {
        var sort = generateSortStrings(sortBy);

        var requestParams = {
            page: requestedPage,
            perPage: itemsPerPage
        };

        if (sort) {
            requestParams.orderBy = sort;
        }

        if (!_.isEmpty(filterBy)) {
            _.extend(requestParams, filterBy);
        }
        return sharedWithMeRequestedApi.get(requestParams).$promise;
    };


    publicApi.activateItem = function(item) {
        return shareItemApi.update(
            {
                id: item.id,
                active: true
            }
        ).$promise;
    };


    publicApi.deactivateItem = function(item) {
        return shareItemApi.update(
            {
                id: item.id,
                active: false
            }
        ).$promise;
    };

    publicApi.editItem = function(item, options) {
        options.id = item.id;
        return shareItemApi.update(options).$promise;
    };


    // Collaboration api
    publicApi.activateCollaboration = function(collaboration) {
        return collaborationApi.update(
            {
                id: collaboration.id,
                active: true
            }
        ).$promise;
    };


    publicApi.deactivateCollaboration = function(collaboration) {
        return collaborationApi.update(
            {
                id: collaboration.id,
                active: false
            }
        ).$promise;
    };


    publicApi.extendCollaboration = function(collaboration, newExpirationTime) {
        return collaborationApi.update(
            {
                id: collaboration.id,
                extend_expiration: newExpirationTime
            }
        ).$promise;
    };

    publicApi.extendItem = function(item, newExpirationTime) {

        var request = {id: item.id};
        var isExactDate = _.isString(newExpirationTime);

        if (isExactDate) {
            // New format of dates handling, exact date in ISO string format
            request.expire = newExpirationTime;
        } else {
            // Legacy format - time delta, seconds
            request.extend_expiration = newExpirationTime;
        }

        return shareItemApi.update(request).$promise;
    };


    // Bulk actions
    publicApi.activateItems = function(item) {
        // In progress
        return collaborationApi.update(
            {
                id: item.id,
                active: true
            }
        ).$promise;
    };


    publicApi.deactivateItems = function(item) {
        // In progress
        return collaborationApi.update(
            {
                id: item.id,
                active: false
            }
        ).$promise;
    };


    // Shared with me actions
    publicApi.requestExtension = function(item, newExpirationTime) {
        return sharedWithMeApi.update(
            {
                id: item,
                extend_expiration: newExpirationTime
            }
        ).$promise;
    };


    publicApi.requestAccess = function(item, newExpirationTime) {
        return sharedWithMeApi.update(
            {
                id: item,
                extend_expiration: newExpirationTime
            }
        ).$promise;
    };


    publicApi.requestShareUrl = function(item) {
        return sharedWithMeApi.get({id: item}).$promise;
    };


    publicApi.sendRequestReminder = function(item) {
        return sharedWithMeRequestedApi.get({id: item}).$promise;
    };


    publicApi.deleteRequest = function(item) {
        return sharedWithMeRequestedApi.delete({id: item}).$promise;
    };


    publicApi.svCounter = function() {
        return svCounterApi.get({}).$promise;
    };


    publicApi.swmCounter = function() {
        return swmCounterApi.get({}).$promise;
    };


    publicApi.updateSvCounter = function($scope) {
        publicApi.svCounter().then(
            function(data) {
                $scope.svEnabledCount = data.enabled;
                $scope.svDisabledCount = data.disabled;
                $scope.svAccessRequestsCount = data['access-requests'];
            }
        );
    };


    publicApi.updateSwmCounter = function($scope) {
        publicApi.swmCounter().then(
            function(data) {
                $scope.swmEnabledCount = data.enabled;
                $scope.swmDisabledCount = data.disabled;
                $scope.swmAccessRequestsCount = data['access-requests'];
            }
        );
    };


    return publicApi;
}
