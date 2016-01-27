angular.module('nccCollaborations')
    .controller('sharedWithMeCtrl', sharedWithMeCtrl);

function sharedWithMeCtrl(
    $scope, $log, $route, $filter, $rootScope, operationsApi,
    Constants, $q, nccCollaborationsModals, jgmessages) {

    $scope.updateSwmCounter = operationsApi.updateSwmCounter;
    $scope.updateSwmCounter($scope);

    $scope.itemsPerPageChoices = Constants.get('itemsPerPageChoices');
    $scope.itemsPerPage = $scope.itemsPerPageChoices[0];
    $scope.search = {value: ''};
    $scope.emptyView = true;

    $scope.headers = [
        {title: 'Title', slug: 'name', sortable: false, filterable: false},
        {title: 'Sender', slug: 'sender', sortable: false, filterable: false},
        {title: 'Organization', slug: 'organization', sortable: false, filterable: false},
        {title: 'Date Shared', slug: 'created', sortable: false, filterable: false},
        {title: 'Expiration', slug: 'expire', sortable: false, filterable: false},
        {title: 'Last accessed', slug: 'expire', sortable: false, filterable: false},
        {title: 'Action', sortable: false, filterable: false}
    ];

    $scope.searchPlaceholderText = 'Search by title or sender';

    $scope.utils = {allItemsSelected: false};

    $scope.refreshView = function() {
        $scope.utils = {allItemsSelected: false};
        return getItems($scope.itemsPerPage, $scope.currentPage);
    };

    $scope.resetSearch = function() {
        $scope.search.value = '';
        $scope.isFilter = true;
        $scope.refreshView();
    };

    $scope.keyPress = function($event) {
        if ($event.keyCode == 13) {
            $scope.isFilter = true;
            $scope.refreshView();
        } else {
            if ($event.keyCode == 27) {
                $scope.resetSearch();
                $scope.isFilter = false;
            }
        }
    };

    $scope.getItemsFromDropdown = function(itemsQuantityInDropdown, currentPageInPaginator) {
        // We watch this value in paginator an set number of pages based on it
        $scope.itemsPerPage = itemsQuantityInDropdown;

        // TODO Need to check why we have undefined
        if (currentPageInPaginator == undefined) {
            currentPageInPaginator = 1;
        }

        if ($scope.searchView) {
            return $scope.search($scope.search.value);
        }

        return getItems(itemsQuantityInDropdown, currentPageInPaginator)
    };


    function getItems(itemsPerPage, requestedPage) {

        $scope.requestInProgress = true;

        $scope.filterItems.q = $scope.search.value;
        $scope.searchView = $scope.search.value ? true : false;

        return operationsApi
            .getSharedWithMe(itemsPerPage, requestedPage, $scope.selectedSortingOptions, $scope.filterItems)
            .then(function(data) {
                $scope.totalItems = data.total;
                $scope.emptyView = data.items.length === 0;
                _.map(data.items, function(item) {
                    return _.extend(item, {isExpanded: false, isPathShowed: false});
                });
                $scope.items = data.items;
                $scope.showPaginator = $scope.totalItems > $scope.itemsPerPage;
                $scope.requestInProgress = false;
            });
    }


    $scope.makeExpireStringForView = function(item) {
        var result = {
            short: '–',
            long: '–'
        };

        if (item.expire) {
            result = {
                short: $filter('date')(item.expire, 'MMM dd, yyyy'),
                long: $filter('date')(item.expire, 'MMM dd, yyyy, h:mm a')
            };
        }

        return result;
    };

    $scope.makeLastAccessStringForView = function(item) {
        if (!item.access_time) {
            return 'Never Accessed';
        }
        return {
            short: $filter('date')(item.access_time, 'MMM dd, yyyy'),
            long: $filter('date')(item.access_time, 'MMM dd, yyyy, h:mm a')
        };
    };

    // TODO Move this to service
    function getIdentityString(identity) {
        return identity.name + ' (' + identity.email + ')';
    }

    $scope.toggleRow = function(item) {
        // do nothing in case of the identity is deleted
        if (_.isUndefined(item.identity)) {
            return null;
        }

        item.isExpanded = !item.isExpanded;

        if (item.isPathShowed) {
            item.isPathShowed = false;
        } else {
            item.sharerIdentity = getIdentityString(item.identity);
            item.isPathShowed = true;
        }

        $rootScope.$broadcast('sharedWithMe:pathsReady');

        return null;
    };


    $scope.requestExtension = function(item) {
        nccCollaborationsModals.requestExtensionModal(item)
            .then(function(datetime) {
                var data = operationsApi.requestExtension(item.id, datetime);
                return data;
            })
            .then(function(data) {
                $scope.updateSwmCounter($scope);
                if (data.error) {
                    jgmessages.showFailureMessage(data.message);
                } else {
                    jgmessages.showSuccessMessage(data.message);
                }
            });
    };


    $scope.bulkRequestExtension = function(items) {

        var selectedItems = _.where(items, { isSelected: true });

        nccCollaborationsModals.bulkRequestExtensionModal(selectedItems)
            .then(requestExtensionForSelectedItems)
            .then(showMessages);

        function requestExtensionForSelectedItems(selectedExtensionValue) {
            var promises = _.map(selectedItems, function(item) {
                return operationsApi.requestExtension(item.id, selectedExtensionValue);
            });
            return $q.all(promises);
        }

        function showMessages(data) {
            $scope.updateSwmCounter($scope);
            // TODO Show message when all operations successful or some failed
            jgmessages.showSuccessMessage(data[0].message);
            $scope.utils = {allItemsSelected: false};
        }
    };

    $scope.bulkRequestAccess = function(items) {

        var selectedItems = _.where(items, { isSelected: true });

        nccCollaborationsModals.bulkRequestAccessModal(selectedItems)
            .then(requestAccessForSelectedItems)
            .then(showMessages);

        function requestAccessForSelectedItems(selectedExtensionValue) {
            var promises = _.map(selectedItems, function(item) {
                return operationsApi.requestAccess(item.id, selectedExtensionValue);
            });
            return $q.all(promises);
        }

        function showMessages(data) {
            $scope.updateSwmCounter($scope);
            // TODO Show message when all operations successful or some failed
            jgmessages.showSuccessMessage(data[0].message);
            $scope.utils = {allItemsSelected: false};
        }
    };

    $scope.requestAccess = function(item) {
        nccCollaborationsModals.requestAccess(item)
            .then(function(time) {
                return operationsApi.requestAccess(item.id, time);
            })
            .then(function() {
                $scope.updateSwmCounter($scope);
                jgmessages.showSuccessMessage('Access Request Successful');
            });
    };

    $scope.activetab = $route.current.activetab;
    $scope.section = $route.current.section;

    // We need this to prevent two requests on initial page load
    $scope.initialView = true;

    $scope.$watch('currentPage', updateView);
    function updateView() {
        if ($scope.initialView) {
            $scope.initialView = false;
        } else {
            $log.debug('Current page updated');
            $scope.refreshView();
        }
    }

    $scope.selectedSortingOptions = {created: '-'};

    $scope.filterItems = {};

    getFilteredItems('active', $scope.activetab === 'swm_active');

    function getFilteredItems(field, value) {
        if (_.has($scope.filterItems, field) && $scope.filterItems[field] === value) {
            $scope.filterItems = {};
        } else {
            $scope.filterItems[field] = value;
        }
        $scope.refreshView();
    }


    // Select all items checkbox
    $scope.$watch(function() {
        return $scope.utils.allItemsSelected;
    }, function(newVal) {
        if (newVal) {
            _.each($scope.items, function(element) {
                element.isSelected = true;
            });
        } else {
            _.each($scope.items, function(element) {
                element.isSelected = false;
            });
        }
    });
}
