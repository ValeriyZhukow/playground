angular.module('nccCollaborations')
    .controller('itemsViewCtrl', itemsTableCtrl);

function itemsTableCtrl($scope, $route, $http, $log, $timeout, $filter, $q, $window, Constants,
                        operationsApi, nccCollaborationsModals, metadataService, itemsPaths,
                        jgmessages, itemsService, tableHeadersService) {

    $scope.items = [];

    $scope.utils = {allItemsSelected: false};

    $scope.searchPlaceholderText = 'Search by title or recipient';

    $scope.headers = tableHeadersService.mySharesHeaders;

    $scope.itemsPerPageChoices = Constants.get('itemsPerPageChoices');

    $scope.updateSvCounter = operationsApi.updateSvCounter;
    $scope.updateSvCounter($scope);

    $scope.currentPage = 1;
    $scope.initialView = true;
    $scope.totalItems = 1;
    $scope.itemsPerPage = $scope.itemsPerPageChoices[0];
    $scope.selectedSortingOptions = {created: '-'};
    $scope.filterItems = {};
    $scope.searchinInProgress = false;

    // Table methods

    $scope.refreshView = function() {
        $log.debug('Refreshing current view for page `' +
            $scope.currentPage + '`, items per page: `' + $scope.itemsPerPage + '`');
        $scope.utils = {allItemsSelected: false};

        if ($scope.searchView) {
            return $scope.search($scope.search.value);
        }
        return $scope.getItems($scope.itemsPerPage, $scope.currentPage);
    };

    $scope.sortItems = function(fieldToSort) {
        var order;

        if (!fieldToSort) {
            $log.debug('Empty field to sort. Skipping.');
            return null;
        }

        // Deciding direction of sorting logic
        if (_.has($scope.selectedSortingOptions, fieldToSort)) {
            if ($scope.selectedSortingOptions[fieldToSort] == '-') {
                order = null;
            } else {
                order = '-';
            }
        } else {
            order = '';
        }

        // Cleaning up sorting options, behavior can change in future with multiple sortings
        $scope.selectedSortingOptions = {};

        $log.debug('Starting sorting for field `' + fieldToSort + '` in direction `' + order + '`');
        if (!_.isNull(order)) {
            $scope.selectedSortingOptions[fieldToSort] = order;
        }

        if ($scope.searchView) {
            $scope.search($scope.search.value);
        } else {
            $scope.refreshView();
        }
    };


    $scope.getFilteredItems = function(field, value) {
        if (_.has($scope.filterItems, field) && $scope.filterItems[field] === value) {
            $scope.filterItems = {};
        } else {
            $scope.filterItems[field] = value;
        }
        $scope.refreshView();
    };

    $scope.sortingDirectionOf = function(header) {
        var direction = $scope.selectedSortingOptions[header.slug];

        if (!_.has($scope.selectedSortingOptions, header.slug)) {
            return '';
        }

        if (direction === '-') {
            return 'desc';
        } else {
            return 'asc';
        }
    };

    $scope.toggleRow = function(item) {
        if (item.collaborations.length > 1) {
            item.isExpanded = !item.isExpanded;
        }
        itemsPaths.togglePaths([item]);
    };


    // If multiple recipients, show how many else recipient email
    // TODO Add correct plural forms
    $scope.makeRecipientsStringForView = function(item, isTooltip) {

        if (item.collaborations) {
            if (item.collaborations.length > 1) {
                return item.collaborations.length + ' recipients';
            }
            return isTooltip ? item.collaborations[0].recipient[0] : item.collaborations[0].recipient[1];
        } else {
            return item.email;
        }

    };

    var checkIsEmptyExpirationDate = function(item) {
        return !item.expire;
    };

    // If multiple recipients, show dash, formatted date otherwise.
    $scope.makeExpireStringForView = function(item) {

        if (item.collaborations) {
            // Item
            var multipleRecipients = item.collaborations.length > 1;
            var noExpireDate = _.isUndefined(item.collaborations[0]) ||
                checkIsEmptyExpirationDate(item.collaborations[0]);
            if (multipleRecipients || noExpireDate) {
                return '–';
            }
            return {
                short: $filter('date')(item.collaborations[0].expire, 'MMM dd, yyyy'),
                long: $filter('date')(item.collaborations[0].expire, 'MMM dd, yyyy, h:mm a')
            };
        } else {
            // Collaboration
            if (checkIsEmptyExpirationDate(item)) {
                return '–';
            }
            return {
                short: $filter('date')(item.expire, 'MMM dd, yyyy'),
                long: $filter('date')(item.expire, 'MMM dd, yyyy, h:mm a')
            };
        }

    };

    $scope.makeLastAccessStringForView = function(item) {

        if (item.category === 4) {
            var maxDate = _.max(item.collaborations, function(c) {
                return new Date(c.access_time)
            });
            if (!maxDate.access_time) {
                return 'Never Accessed';
            }
            return {
                short: $filter('date')(maxDate.access_time, 'MMM dd, yyyy'),
                long: $filter('date')(maxDate.access_time, 'MMM dd, yyyy, h:mm a')
            };
        }

        if (item.collaborations) {
            var multipleRecipients = item.collaborations.length > 1;
            var isAccessed = item.collaborations[0].access_time !== null;
            if (multipleRecipients) {
                return '–';
            }
            if (!multipleRecipients && !isAccessed) {
                return 'Never accessed';
            }
            return {
                short: $filter('date')(item.collaborations[0].access_time, 'MMM dd, yyyy'),
                long: $filter('date')(item.collaborations[0].access_time, 'MMM dd, yyyy, h:mm a')
            };
        } else {
            // Collaboration
            if (!item.access_time) {
                return 'Never Accessed';
            }
            return {
                short: $filter('date')(item.access_time, 'MMM dd, yyyy'),
                long: $filter('date')(item.access_time, 'MMM dd, yyyy, h:mm a')
            };
        }

    };


    $scope.getIdentityString = function(item) {
        if (!_.isUndefined(item.collaborations[0])) {
            var identity = item.collaborations[0];
            return identity.name + ' (' + identity.email + ')';
        }
        return '';
    };

    $scope.getMessageText = function(item) {
        if (!_.isUndefined(item.collaborations[0])) {
            return item.collaborations[0].message;
        }
        return '';
    };

    $scope.makeOrgStringForView = function(item) {

        if (item.collaborations) {

            var multipleOrgs = item.collaborations.length > 1;
            var emptyOrgName = _.isUndefined(item.collaborations[0]) || !item.collaborations[0].organization;

            if (multipleOrgs || emptyOrgName) {
                return '–';
            }

            return item.collaborations[0].organization;
        } else {
            // collaboration
            return item.organization || '–';
        }
    };

    $scope.editItemOptions = function(item) {
        nccCollaborationsModals.editItemOptionsModal(item)
            .then(function(options) {
                var promises = [];
                if (item.isFaux) {
                    promises.push(operationsApi.editCollaboration(item.collaborations[0], options));
                } else {
                    promises.push(operationsApi.editItem(item, options));
                }
                return $q.all(promises);
            })
            .then(function(result) {

                // Update options in view
                $log.info('New options saved');
                if (item.collaborations) {
                    if (item.isFaux) {
                        item.collaborations[0] = result[0].collaborations[0];
                    } else {
                        item.collaborations[0] = result[0].items[0].collaborations[0];
                    }
                }
                item.was_forced = false;
                jgmessages.showSuccessMessage('Share options edited!');
            });
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

        return $scope.getItems(itemsQuantityInDropdown, currentPageInPaginator);
    };


    // When open dropdown, check do we have selected items or not
    $scope.checkAnySelectedItems = function(items) {
        $scope.haveSelectedItems = itemsService.hasSelectedItems(items);

        var selectedItems = itemsService.getSelectedItems(items);
        $scope.secureMailsOnly = itemsService.checkIfSecureMailsOnly(selectedItems);
    };

    $scope.logItem = function(item) {
        console.log(item);
    };


    // API methods
    $scope.getItems = function(itemsPerPage, requestedPage) {
        $scope.requestInProgress = true;
        return operationsApi.getItems(
            requestedPage,
            itemsPerPage,
            $scope.selectedSortingOptions,
            $scope.filterItems
        ).then(function(data) {
                $scope.totalItems = data.total;
                $scope.emptyView = data.items.length === 0;
                metadataService.updateCollaborationsMeta(data.items);
                metadataService.updateItemsMeta(data.items);
                $scope.items = data.items;
                $scope.showPaginator = $scope.totalItems > $scope.itemsPerPage;
                $scope.requestInProgress = false;
            },
            function(data){
                jgmessages.showFailureMessage('Can not retrieve list of shares');
                $scope.requestInProgress = false;
            }
        );
    };


    $scope.search = function(searchValue) {

        if (!searchValue) {
            return;
        }

        $scope.requestInProgress = true;

        var params = {q: searchValue};

        if ('active' in $scope.filterItems) {
            params.active = $scope.filterItems.active;
        }

        $log.info('sorting options', $scope.selectedSortingOptions);

        var isSortingSet = !_.isEmpty($scope.selectedSortingOptions);

        if (isSortingSet) {
            params.orderBy = _.map($scope.selectedSortingOptions, function(direction, sortingField) {
                return direction + sortingField;
            }).join('.');
        }

        params.itemsPerPage = $scope.itemsPerPage;
        params.currentPage = $scope.currentPage;

        $log.info(params);

        // TODO Move this to service.
        $http({
            method: 'GET',
            url: '/collaboration_management/api/v1/search/',
            params: params
        }).success(function(data) {

            var items = metadataService.convertCollaborationsToItems(data.items);

            metadataService.updateCollaborationsMeta(items);
            $scope.items = metadataService.updateItemsMeta(items);

            $scope.emptySearchResults = $scope.items.length === 0;

            itemsService.setAllItemsDeselected($scope.items);

            $scope.searchView = true;

            $scope.requestInProgress = false;

        }).error(function() {
            console.log('Can\'t get search');
        });
    };

    $scope.keyPress = function($event) {
        if ($event.keyCode == 13) {
            $scope.search($scope.search.value);
        } else {
            if ($event.keyCode == 27) {
                $scope.resetSearch();
            }
        }
    };

    $scope.resetSearch = function() {
        $scope.searchView = false;
        $scope.search.value = '';
        $scope.emptySearchResults = false;
        $scope.refreshView();
    };

    $scope.emptySearchResults = false;

    $scope.$watch('search.value', function(newVal) {
        if (newVal !== undefined && newVal !== '') {
            if (!newVal) {
                $scope.resetSearch();
            }
        }
    });

    $scope.togglePathsLabel = itemsPaths.togglePathsDropdownLabel;
    $scope.togglePaths = function() {
        itemsPaths.togglePaths($scope.items);
    };

    $scope.openTsLink = function(item, $event) {
        $event.stopPropagation();
        itemsPaths.resolveSingleItem(item).then(
            function() {
                $window.open(item.url, '_blank');
            }
        );
    };

    // Item actions
    //
    //

    // Single Item

    $scope.activateItem = function(item) {
        nccCollaborationsModals.activateItemModal(item)
            .then(function(result) {

                if (typeof result === 'number') {
                    // Got time, extending expired item.
                    var extendDuration = result;
                    if (item.isFaux) {
                        return operationsApi.activateCollaboration(item.collaborations[0])
                            .then(function() {
                                return operationsApi.extendCollaboration(item.collaborations[0], extendDuration);
                            });
                    } else {
                        return operationsApi.activateItem(item)
                            .then(function() {
                                return operationsApi.extendItem(item, extendDuration);
                            }
                        );
                    }
                } else {
                    // Got item, activating.
                    if (item.isFaux) {
                        return operationsApi.activateCollaboration(item.collaborations[0]);
                    } else {
                        return operationsApi.activateItem(item);
                    }
                }
            })
            .then(function(result) {

                var updatedExpirationDate;
                if (item.isFaux) {
                    updatedExpirationDate = result.collaborations[0].expire;
                } else {
                    updatedExpirationDate = result.items[0].collaborations[0].expire;
                }
                _.each(item.collaborations, function(collaboration) {
                    collaboration.expired = false;
                    collaboration.expire = updatedExpirationDate;

                });

                $scope.updateSvCounter($scope);

                jgmessages.showSuccessMessage('Share enabled!');
                hideItemFromView(item);
                item.active = true;
            });
    };

    $scope.deactivateItem = function(item) {
        nccCollaborationsModals.disableItemModal(item)
            .then(function(item) {
                if (item.isFaux) {
                    return operationsApi.deactivateCollaboration(item.collaborations[0]);
                } else {
                    return operationsApi.deactivateItem(item);
                }
            })

            .then(function() {

                $scope.updateSvCounter($scope);

                jgmessages.showSuccessMessage('Share disabled!');

                _.each(item.collaborations, function(collaboration) {
                    collaboration.active = false;
                });

                hideItemFromView(item);

                item.active = false;
            });
    };


    function hideItemFromView(item) {
        $timeout(function() {
            item.hide = true;
            if ($scope.items.length === 1) {
                $scope.emptyView = true;
            }
        }, 1000);
    }

    $scope.extendItem = function(item) {
        nccCollaborationsModals.editItemExpireDateModal(item).then(
            function(result) {

                var updatedExpirationDate;

                if (item.isFaux) {
                    updatedExpirationDate = result.collaborations[0].expire;
                } else {
                    updatedExpirationDate = result.items[0].collaborations[0].expire;
                }

                // and update in view
                _.each(item.collaborations, function(collaboration) {
                    collaboration.expire = updatedExpirationDate;
                });

                jgmessages.showSuccessMessage('Share Extended!');

            }, function() {
                console.log('Error extending item');
            }
        );
    };

    // Bulk Items
    $scope.activateSelectedItems = function(items) {

        var selectedItems = itemsService.getSelectedItems(items);

        nccCollaborationsModals.bulkActivateItemsModal(selectedItems)
            .then(_activateItems)
            .then(_extendExpiredItems)
            .then(_cleanup);

        function _activateItems(newExpireDate) {

            var promises = _.map(selectedItems, function(item) {
                return operationsApi.activateItem(item);
            });

            $scope.requestInProgress = true;

            $q.all(promises);

            return newExpireDate;
        }

        function _extendExpiredItems(newExpireDate) {

            var expiredItems = itemsService.getExpiredSecureViews(selectedItems);

            if (!_.isEmpty(expiredItems)) {

                var _expiredPromises = _.map(expiredItems, function(item) {
                    return operationsApi.extendItem(item, newExpireDate);
                });

                return $q.all(_expiredPromises);

            }

        }

        function _cleanup() {
            $scope.requestInProgress = false;
            $scope.updateSvCounter($scope);
            jgmessages.showSuccessMessage('Shares enabled!');
            $scope.refreshView();
        }
    };

    $scope.deactivateSelectedItems = function(items) {

        var selectedItems = itemsService.getSelectedItems(items);

        nccCollaborationsModals.bulkDisableItemsModal(selectedItems)
            .then(function(items) {
                var promises = _.map(items, function(item) {
                    return operationsApi.deactivateItem(item);
                });
                $scope.requestInProgress = true;
                return $q.all(promises);
            })
            .then(function() {
                $scope.requestInProgress = false;
                $scope.updateSvCounter($scope);
                jgmessages.showSuccessMessage('Shares disabled!');
                $scope.refreshView();
            });
    };

    // Collaboration actions
    //
    //

    // Single collaboration

    $scope.activateCollaboration = function(collaboration, item) {
        return nccCollaborationsModals.activateItemModal(collaboration)
            .then(function(collaboration) {
                return operationsApi.activateCollaboration(collaboration);
            })
            .then(function() {
                collaboration.active = true;
                if (!item.active) {
                    item.active = true;
                    $scope.updateSvCounter($scope);
                    hideItemFromView(item);
                }
                jgmessages.showSuccessMessage('Share enabled!');
            });
    };

    $scope.deactivateCollaboration = function(collaboration) {
        return nccCollaborationsModals.disableItemModal(collaboration)
            .then(function(collaboration) {
                return operationsApi.deactivateCollaboration(collaboration);
            })
            .then(function() {
                collaboration.active = false;
                jgmessages.showSuccessMessage('Share disabled!');
            });
    };

    $scope.extendCollaboration = function(collaboration, item) {
        nccCollaborationsModals.editItemExpireDateModal(collaboration, item).then(
            function(result) {
                item.expire = result.collaborations[0].expire;
                collaboration.expire = result.collaborations[0].expire;
                jgmessages.showSuccessMessage('Share Extended!');
            }, function() {
                console.log('Error extending item');
            }
        );
    };

    // Bulk actions

    $scope.activateCollaborations = function() {

        var selectedShares = itemsService.getSelectedItems(items);

        _.each(selectedShares, function(item, index) {
            operationsApi.activateCollaboration(item).then(function() {
                if (index === selectedShares.length - 1) {
                    $scope.updateSvCounter($scope);
                    $scope.refreshView();
                }
            });
        });
    };

    $scope.deactivateCollaborations = function() {

        var selectedShares = itemsService.getSelectedItems(items);

        _.each(selectedShares, function(item, index) {
            operationsApi.deactivateCollaboration(item).then(function() {
                if (index === selectedShares.length - 1) {
                    $scope.updateSvCounter($scope);
                    $scope.refreshView();
                }
            });
        });
    };

    // resend action
    $scope.resendNotifications = function(collaborations, item) {
        var data = [];

        if (collaborations) {
            data.push.apply(data, collaborations);
        } else {
            var selectedItems = itemsService.getSelectedItems(items);
            _.each(selectedItems, function(item) {
                data.push.apply(data, item.collaborations);
            });
        }

        nccCollaborationsModals.resendItemModal(item, data)
            .then(function() {
                jgmessages.showSuccessMessage('Shares Resent!');
            });
    };


    $scope.bulkResendNotifications = function(items) {

        var selectedItems = itemsService.getSelectedItemsWithoutSecureMails(items);

        nccCollaborationsModals.bulkResendItemsModal(selectedItems)
            .then(sendNotificationsToCollaborations);

        function sendNotificationsToCollaborations(items) {
            var collaborations = itemsService.getCollaborationsFromSecureViews(items);
            if (collaborations && collaborations.length > 0) {
                $scope.requestInProgress = true;
                operationsApi.resendNotifications(collaborations)
                    .then(showSuccessMessages, showErrorMessages);
            }
        }

        function showErrorMessages() {
            $log.error('Error sending notifications to server');
            $scope.requestInProgress = false;
            jgmessages.showFailureMessage('Error Resending Shares!');
        }

        function showSuccessMessages() {
            $scope.requestInProgress = false;
            jgmessages.showSuccessMessage('Shares Resent!');
        }

    };

    // Watchers
    $scope.$watch(function() {
        return $scope.currentPage;
    }, function() {
        if ($scope.initialView) {
            $scope.initialView = false;
        } else {
            $log.debug('Current page updated');
            $scope.refreshView();
        }
    });

    // Select all items checkbox
    $scope.$watch(function() {
        return $scope.utils.allItemsSelected;
    }, function(checkboxSelected) {
        if (checkboxSelected) {
            itemsService.setAllItemsSelected($scope.items);
        } else {
            itemsService.setAllItemsDeselected($scope.items);
        }
    });

    $scope.activetab = $route.current.activetab;
    $scope.section = $route.current.section;
    $scope.getFilteredItems('active', $scope.activetab == 'active');

}
