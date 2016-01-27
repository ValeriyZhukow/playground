angular.module('nccCollaborations')
    .controller('sharedWithMeRequestedCtrl', sharedWithMeRequestedCtrl);

function sharedWithMeRequestedCtrl(
    $scope, $log, $route, $filter, $rootScope, operationsApi,
    Constants, jgmessages, nccCollaborationsModals, $q) {
    $scope.sharesState = Constants.get('statistics');

    $scope.updateSwmCounter = operationsApi.updateSwmCounter;
    $scope.updateSwmCounter($scope);

    $scope.itemsPerPageChoices = Constants.get('itemsPerPageChoices');
    $scope.itemsPerPage = $scope.itemsPerPageChoices[0];
    $scope.utils = {allItemsSelected: false};
    $scope.search = {'value': ''};

    $scope.searchPlaceholderText = 'Search by title or sender';

    $scope.headers = [
        {"title": "Title", 'slug': 'name', 'sortable': false, 'filterable': false},
        {"title": "Owner", 'slug': 'recipient', 'sortable': false, 'filterable': false},
        {"title": "Organization", 'slug': 'organization', 'sortable': false, 'filterable': false},
        {"title": "Date Requested", 'slug': 'created', 'sortable': false, 'filterable': false},
        {"title": "Extension Requested", 'slug': 'expire', 'sortable': false, 'filterable': false},
        {"title": "Last accessed", 'slug': 'expire', 'sortable': false, 'filterable': false},
        {"title": "Action", 'sortable': false, 'filterable': false}
    ];

    $scope.searchPlaceholderText = 'Search by title or sender';

    $scope.emptyView = true;

    $scope.refreshView = function() {
        return getItems($scope.itemsPerPage, $scope.currentPage)
            .then(updateItemsList);

        function updateItemsList(data) {
            $log.debug(data);

            $scope.utils = {allItemsSelected: false};

            _.map(data.items, function(item) {
                return _.extend(item, {isExpanded: false, isPathShowed: false})
            });

            var nowDate = moment();

            _.map(data.items, function(item) {
                if (item.extension_date) {
                    item.extensionRequested = moment(item.extension_date).format('MMM D, YYYY');
                    item.extensionRequestedTooltip = moment(item.extension_date).format('MMM D, YYYY, h:mm A');
                } else {
                    item.extensionRequested = moment(nowDate).add(item.days, 'days').format('MMM D, YYYY');
                    item.extensionRequestedTooltip = moment(nowDate).add(item.days, 'days').format('MMM D, YYYY, h:mm A');
                }
                return item;
            });

            $scope.items = data.items;
            $scope.totalItems = data.total;

        }
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

    $scope.sendRequestReminder = function(item) {

        nccCollaborationsModals.sendRequestReminderModal(item)
            .then(sendRequestReminder)
            .then(showMessages);


        function sendRequestReminder(item) {
            return operationsApi.sendRequestReminder(item.id);
        }

        function showMessages(data) {
            jgmessages.showSuccessMessage(data.message);
        }
    };

    $scope.deleteRequest = function(item) {

        nccCollaborationsModals.deleteRequestModal(item)
            .then(deleteRequest)
            .then(showMessages)
            .then($scope.refreshView);

        function deleteRequest(item) {
            return operationsApi.deleteRequest(item.id);
        }

        function showMessages(data) {
            jgmessages.showSuccessMessage(data.message);
        }
    };

    $scope.bulkSendRequestReminder = function(items) {

        var selectedItems = _.where(items, { isSelected: true });

        nccCollaborationsModals.bulkSendRequestReminderModal(selectedItems)
            .then(sendRequestReminderForSelectedItems)
            .then(showMessages);


        function sendRequestReminderForSelectedItems(items) {
            var promises = _.map(items, function(item) {
                return operationsApi.sendRequestReminder(item.id);
            });

            return $q.all(promises);
        }

        function showMessages(data) {
            jgmessages.showSuccessMessage(_.first(data).message);
        }
    };

    $scope.bulkDeleteRequest = function(items) {

        var selectedItems = _.where(items, { isSelected: true });

        nccCollaborationsModals.bulkDeleteRequestsModal(selectedItems)
            .then(deleteRequests)
            .then(showMessages)
            .then($scope.refreshView);


        function deleteRequests(items) {
            var promises = _.map(items, function(item) {
                return operationsApi.deleteRequest(item.id);
            });

            return $q.all(promises);
        }

        function showMessages(data) {
            jgmessages.showSuccessMessage(_.first(data).message);
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

        return getItems(itemsQuantityInDropdown, currentPageInPaginator);
    };



    function getItems(itemsPerPage, requestedPage) {
        $scope.requestInProgress = true;

        $scope.filterItems['q'] = $scope.search.value;

        $scope.searchView = $scope.search.value ? true : false;

        return operationsApi.getSharedWithMeRequested(itemsPerPage, requestedPage, $scope.selectedSortingOptions,
            $scope.filterItems)
            .then(function(data) {
                $scope.emptyView = data.items.length === 0;
                $scope.totalItems = data.total;
                $scope.requestInProgress = false;
                $scope.showPaginator = $scope.totalItems > $scope.itemsPerPage;
                return data;
            });
    }


    $scope.makeExpireStringForView = function(item) {
        return {
            short: $filter('date')(item.expire, 'MMM dd, yyyy'),
            long: $filter('date')(item.expire, 'MMM dd, yyyy, h:mm a')
        }
    };


    $scope.makeLastAccessStringForView = function(item) {
        if (!item.access_time) {
            return 'Never Accessed'
        }
        return {
            short: $filter('date')(item.access_time, 'MMM dd, yyyy'),
            long: $filter('date')(item.access_time, 'MMM dd, yyyy, h:mm a')
        }
    };

    // TODO Move this to service
    function getIdentityString(identity) {
        return identity.name + ' (' + identity.email + ')';
    }

    $scope.toggleRow = function(item) {
        item.isExpanded = !item.isExpanded;

        if (item.isPathShowed) {
            item.isPathShowed = false;
        } else {
            item.sharerIdentity = getIdentityString(item.collaboration.identity);
            item.isPathShowed = true;
        }

        $rootScope.$broadcast('sharedWithMe:pathsReady')

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
            $log.debug("Current page updated");
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
        $scope.refreshView()
    }


    // Select all items checkbox
    $scope.$watch(function() {
        return $scope.utils.allItemsSelected;
    }, function(newVal) {
        if (newVal) {
            _.each($scope.items, function(element) {
                element['isSelected'] = true;
            });
        } else {
            _.each($scope.items, function(element) {
                element['isSelected'] = false;
            });
        }
    });
}
