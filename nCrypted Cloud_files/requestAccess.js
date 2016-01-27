angular.module('nccCollaborations').controller(
    'requestAccessCtrl',
    function($scope, $route, $timeout, $q, $log, $rootScope,
              $window, BackEndConstants, itemsPaths,
              IconResolver, Constants, collaborationRequestsApi,
              nccCollaborationsModals, collaborationApi, jgmessages,
              tableHeadersService, operationsApi, itemsService)
    {
        $scope.updateSvCounter = operationsApi.updateSvCounter;
        $scope.updateSvCounter($scope);

        $scope.itemsPerPageChoices = Constants.get('itemsPerPageChoices');
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.itemsPerPageChoices[0];
        $scope.totalItems = 1;
        $scope.search = {};

        $scope.searchPlaceholderText = 'Search by title or requestor';

        $scope.headers = tableHeadersService.requestAccessHeaders;

        $scope.states = {
            null: "Waiting for response",
            true: "Approved",
            false: "Declined"
        };

        $scope.refreshView = function () {
            $scope.requestInProgress = true;
            var params = {page: $scope.currentPage, perPage: $scope.itemsPerPage};

            $scope.searchView = $scope.search.value ? true : false;

            if ($scope.search.value) params.q = $scope.search.value;

            _.each($scope.headers, function (h) {
                if (h.order !== false) {
                    params.orderBy = h.order + h.slug;
                }
            });

            collaborationRequestsApi.get(params, function (data) {
                $scope.requestInProgress = false;
                var nowDate = moment();
                $scope.items = _.map(data.items, function (item) {
                    if (item.extension_date) {
                        item.extensionRequested = moment(item.extension_date).format('MMM D, YYYY');
                        item.extensionRequestedTooltip = moment(item.extension_date).format('MMM D, YYYY, h:mm A');
                    } else {
                        item.extensionRequested = moment(nowDate).add(item.days, 'days').format('MMM D, YYYY');
                        item.extensionRequestedTooltip = moment(nowDate).add(item.days, 'days').format('MMM D, YYYY, h:mm A');
                    }
                    return item;
                });
                $scope.totalItems = data.total;
                $scope.showPaginator = $scope.totalItems > $scope.itemsPerPage;
            });
        };

        $scope.nameToPath = function(item) {
            var promise = collaborationApi.get({id: item.collaboration.id}, function(data) {
                item.isPathShowed = !item.isPathShowed;
                item.path = item.paths[0] ? item.paths[0] : item.name;
                item.url = data.paths[0];
            }).$promise;

            promise.then(function() {
                $scope.$broadcast('sharedWithMe:pathsReady');
            })
        };

        $scope.$watch(function() {
            return $scope.currentPage;
        }, function() {
            $scope.refreshView();
        });

        $scope.openTsLink = function(item, $event) {
            $event.stopPropagation();
            collaborationApi.get(
                {id: item.collaboration.id},
                function(res) {
                    $window.open(res.paths[0], '_blank');
                }
            );
        };

        $scope.getItemsFromDropdown = function (itemsQuantityInDropdown) {
            $scope.itemsPerPage = itemsQuantityInDropdown;
            $scope.refreshView();
        };

        $scope.sortingDirectionOf = function (header) {
            if ( header.order === false ) {
                return '';
            }
            return header.order === '-' ? "desc" : "asc";
        };

        $scope.sortItems = function (header) {
            switch (header.order) {
                case '':
                    header.order = '-';
                    break;
                case false:
                    header.order = '';
                    break;
                case '-':
                    header.order = false;
                    break;
            };
            $scope.refreshView();
        };

        $scope.resetSearch = function () {
            $scope.search.value = '';
            $scope.isFilter = true;
            $scope.refreshView();
        };

        $scope.keyPress = function ($event) {
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

        $scope.deselectAll = function() {
            _.each($scope.items, function(i) {i.isSelected = false;});
        };

        $scope.getSelectedItems = function() {
            var ids = [];
            _.each($scope.items, function(i) {
                if ( i.isSelected ) {
                    ids.push( i.id );
                }
            });
            return ids;
        };

        $scope.getSelectedItemsObjects = function() {
            var ids = [];
            _.each($scope.items, function(i) {
                if ( i.isSelected ) {
                    ids.push( i );
                }
            });
            return ids;
        };


        $scope.batchApprove = function(items) {

            var selectedItems = itemsService.getSelectedItems(items);
            nccCollaborationsModals.bulkApproveRequestsModal(selectedItems)
                .then( performApproveRequests )
                .then( cleanUpAndShowMessages );


            function performApproveRequests( extensionDate ) {

                var notExpiredRequests = itemsService.getNotExpiredRequests( selectedItems );

                var promises = _.map( notExpiredRequests, function( item ) {
                    return collaborationRequestsApi.update( { id: item.id, days: 0 } );
                } );


                var wasExpiredRequestsInSelection = !!extensionDate;

                if ( wasExpiredRequestsInSelection ) {
                    var expiredRequests = itemsService.getExpiredRequests( selectedItems );
                    var expiredPromises = _.map( expiredRequests, function( item ) {
                        return collaborationRequestsApi.update(
                            {
                                id: item.id,
                                days: item.days,
                                extension_date: extensionDate
                            }
                        );
                    } );

                    promises.concat( expiredPromises );
                }

                return $q.all( promises );
            }

            function cleanUpAndShowMessages() {

                if ($scope.svAccessRequestsCount > selectedItems.length) {
                    $scope.svAccessRequestsCount = $scope.svAccessRequestsCount - selectedItems.length;
                } else {
                    $scope.svAccessRequestsCount = 0;
                }

                $timeout( removeItemsFromView, 1000 );

                function removeItemsFromView() {
                    _.each( selectedItems, function( item ) {
                        $scope.deleteItemById( item.id );
                    } );
                }

                jgmessages.showSuccessMessage( 'Access Request Approved' );
            }
        };


        $scope.deleteItemById = function(id) {
            for (var i = $scope.items.length - 1; i >= 0; i--) {
                if($scope.items[i].id === id) {
                    $scope.items.splice(i, 1);
                }
            }
        };

        $scope.batchDecline = function(items, isDelete) {
            isDelete = isDelete || '';
            var selectedItems = _.where(items, { isSelected: true });
            nccCollaborationsModals.bulkDeclineRequestsModal(selectedItems).then(
                function() {
                    collaborationRequestsApi.delete(
                        {ids: $scope.getSelectedItems().toString(), is_delete: isDelete},
                        function(data) {
                            var selected = $scope.getSelectedItemsObjects();
                            _.each(selected, function(i) {
                                i.isActionFailed = true;
                                $timeout(function() {
                                    $scope.deleteItemById(i.id);
                                }, 1000);

                                $scope.updateSvCounter($scope);
                            });

                            $scope.deselectAll();

                            if (isDelete) {
                                jgmessages.showSuccessMessage('Access Requests Deleted!');
                            } else {
                                jgmessages.showSuccessMessage('Access Requests Rejected!');
                            }
                        },
                        function(data) {});
                });
        };

        $scope.approveRequest = function (item) {
            nccCollaborationsModals.approveRequestModal(item, true).then(
                function (extensionDate) {
                    collaborationRequestsApi.update(
                        {
                            id: item.id,
                            days: item.days,
                            extension_date: extensionDate
                        },
                        function (data) {
                            item.isActionSucceed = true;
                            $timeout(function() {
                                $scope.deleteItemById(item.id);
                            }, 1000);

                            $scope.updateSvCounter($scope);

                            jgmessages.showSuccessMessage('Access Request Approved!');
                        },
                        function (data) {
                            jgmessages.showFailureMessage('Error Approving Request!');
                        });
                }
            );
        };

        $scope.rejectRequest = function(item, isDelete) {
            isDelete = isDelete || '';
            nccCollaborationsModals.declineRequestModal(item)
                .then(
                    function(item) {
                        collaborationRequestsApi.delete(
                            {id:item.id, is_delete:isDelete},
                            function(data) {
                                item.isActionFailed = true;
                                $timeout(function() {
                                    $scope.deleteItemById(item.id);
                                }, 1000);

                                $scope.updateSvCounter($scope);

                                if (isDelete) {
                                    jgmessages.showSuccessMessage('Access Request Deleted!');
                                } else {
                                    jgmessages.showSuccessMessage('Access Request Rejected!');
                                }
                            },
                            function(data) {
                                if (isDelete) {
                                    jgmessages.showFailureMessage('Error Deleting Request!');
                                } else {
                                    jgmessages.showFailureMessage('Error Rejecting Request!');
                                }
                            }
                        );
                    },
                    function(){

                    }
                );
        };

        $scope.utils = { allItemsSelected: false };
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

        $scope.activetab = $route.current.activetab;
        $scope.section = $route.current.section;
    });
