angular.module('nccCollaborations.itemsView').
    service('nccCollaborationsModals', function($modal, $log, operationsApi) {

        this.editItemOptionsModal = function(item) {
            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/edit_item_options_modal.html',
                controller: 'editItemOptionsModalCtrl',
                resolve: {
                    item: function() {
                        return item;
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix'
            });

            return modalInstance.result;
        };


        this.editItemExpireDateModal = function(item, helperItem) {
            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/edit_item_expire_date_modal.html',
                controller: 'editItemExpireDateModalCtrl',
                resolve: {
                    item: function() {
                        return item
                    },
                    helperItem: function() {
                        return helperItem
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            //if (is_request_access) {
            //    return modalInstance.result;
            //};

            return modalInstance.result.then(function(extendDuration) {

                // Collaboration
                if (!item.collaborations) {
                    return operationsApi.extendCollaboration(item, extendDuration);
                }

                // Items
                if (item.isFaux) {
                    return operationsApi.extendCollaboration(item.collaborations[0], extendDuration);
                } else {
                    return operationsApi.extendItem(item, extendDuration);
                }
            });
        };

        this.approveByDay = function(item, options) {
            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/templates/approve_by_day.html',
                controller: function($scope, Constants) {

                    $scope.raDays = Constants.get('request_access_days');
                    $scope.days = 1;
                    $scope.cancel = function() {
                        modalInstance.dismiss();
                    };
                    $scope.approve = function(days) {
                        modalInstance.close(days.days);
                    };
                    $scope.dates = [];
                    $scope.dates.push({
                        days: 1,
                        text: '+ One Day - ' + moment().add(1, 'days').format('MMMM Do YYYY, h:mm A')
                    });
                    $scope.dates.push({
                        days: 7,
                        text: '+ One Week - ' + moment().add(7, 'days').format('MMMM Do YYYY, h:mm A')
                    });
                    $scope.dates.push({
                        days: 30,
                        text: '+ One Month - ' + moment().add(1, 'months').format('MMMM Do YYYY, h:mm A')
                    });
                },
                resolve: {
                    item: function() {
                        return item
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix'
            });

            return modalInstance.result;
        };


        this.disableItemModal = function(item) {

            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/disable_item_modal.html',
                controller: 'disableItemModalCtrl',
                resolve: {
                    item: function() {
                        return item
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;

        };

        this.activateItemModal = function(item) {

            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/activate_item_modal.html',
                controller: 'activateItemModalCtrl',
                resolve: {
                    item: function() {
                        return item
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;

        };

        this.resendItemModal = function(item, collaborations) {

            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/resend_item_modal.html',
                controller: 'resendItemModalCtrl',
                resolve: {
                    item: function() {
                        return item;
                    },
                    collaborations: function() {
                        return collaborations;
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result.then(function(collaborations) {
                return operationsApi.resendNotifications(collaborations)
            });

        };

        this.bulkResendItemsModal = function(items) {
            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/bulk_resend_items_modal.html',
                controller: 'bulkResendItemsModalCtrl',
                resolve: {
                    items: function() {
                        return items;
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };


        this.approveRequestModal = function(item) {

            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/approve_request_modal.html',
                controller: 'approveRequestModalCtrl',
                resolve: {
                    item: function() {
                        return item
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };


        this.bulkActivateItemsModal = function(items) {
            var modalInstance = $modal.open(
                {
                    templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/bulk_activate_items_modal.html',
                    controller: 'bulkActivateItemsModalCtrl',
                    resolve: {
                        items: function() {
                            return items;
                        }
                    },
                    windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
                }
            );
            return modalInstance.result;
        };

        this.bulkDeclineRequestsModal = function(items) {
            var modalInstance = $modal.open(
                {
                    templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/bulk_decline_requests_modal.html',
                    controller: 'bulkDeclineRequestsModalCtrl',
                    resolve: {
                        items: function() {
                            return items;
                        }
                    },
                    windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
                }
            );
            return modalInstance.result;
        };

        this.bulkDeleteRequestsModal = function(items) {
            var modalInstance = $modal.open(
                {
                    templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/bulk_delete_requests_modal.html',
                    controller: 'bulkDeleteRequestsModalCtrl',
                    resolve: {
                        items: function() {
                            return items;
                        }
                    },
                    windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
                }
            );
            return modalInstance.result;
        };

        this.bulkApproveRequestsModal = function(items) {
            var modalInstance = $modal.open(
                {
                    templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/bulk_approve_requests_modal.html',
                    controller: 'bulkApproveRequestsModalCtrl',
                    resolve: {
                        items: function() {
                            return items;
                        }
                    },
                    windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
                }
            );
            return modalInstance.result;
        };

        this.bulkDisableItemsModal = function(items) {
            var modalInstance = $modal.open(
                {
                    templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/bulk_disable_items_modal.html',
                    controller: 'bulkDisableItemsModalCtrl',
                    resolve: {
                        items: function() {
                            return items;
                        }
                    },
                    windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
                }
            );
            return modalInstance.result;
        };

        this.declineRequestModal = function(item) {
            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/decline_request_modal.html',
                controller: 'declineRequestModalCtrl',
                resolve: {
                    item: function() {
                        return item
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };

        this.deleteRequestModal = function(item) {
            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/delete_request_modal.html',
                controller: 'deleteRequestModalCtrl',
                resolve: {
                    item: function() {
                        return item
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };

        this.requestExtensionModal = function(item) {

            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/sharedWithMe/request_extension_modal.html',
                controller: 'requestExtensionModalCtrl',
                resolve: {
                    item: function() {
                        return item
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };


        this.bulkRequestExtensionModal = function(items) {
            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/sharedWithMe/bulk_request_extension_modal.html',
                controller: 'bulkRequestExtensionModalCtrl',
                resolve: {
                    items: function() {
                        return items;
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };


        this.requestAccess = function(item) {

            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/sharedWithMe/request_access_modal.html',
                controller: 'requestAccessModalCtrl',
                resolve: {
                    item: function() {
                        return item;
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };

        this.bulkRequestAccessModal = function(items) {
            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/sharedWithMe/bulk_request_access_modal.html',
                controller: 'bulkRequestAccessModalCtrl',
                resolve: {
                    items: function() {
                        return items;
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };


        this.sendRequestReminderModal = function(item) {

            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/sharedWithMe/send_request_reminder_modal.html',
                controller: 'sendRequestReminderModalCtrl',
                resolve: {
                    item: function() {
                        return item;
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };


        this.bulkSendRequestReminderModal = function(items) {

            var modalInstance = $modal.open({
                templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/sharedWithMe/bulk_send_request_reminder_modal.html',
                controller: 'bulkSendRequestReminderModalCtrl',
                resolve: {
                    items: function() {
                        return items
                    }
                },
                windowClass: 'modal-header-blue modal-header-blue-fix modal-content_centered'
            });

            return modalInstance.result;
        };

    });