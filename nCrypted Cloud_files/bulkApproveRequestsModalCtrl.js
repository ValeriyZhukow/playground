angular.module('nccCollaborations.itemsView').
    controller('bulkApproveRequestsModalCtrl', function ($scope, $modalInstance, $filter, items, itemsService, datesService) {

        $scope.hasExpiredItems = itemsService.hasExpiredRequests(items);

        if ( $scope.hasExpiredItems ) {

            $scope.sourceExpireDate = + new Date();

            // To use policy in max-expiration directive attribute.
            $scope.item = itemsService.getItemWithMinMaxExpiration(items);

            // Check if we have personal and org shares in selection,
            // because it affects extend on activating (org shares can have max-expiration)
            $scope.hasMixedItemTypesInSelection = itemsService.hasMixedItemTypesInSelection(items);
            $scope.organizationNameLabel = $scope.item.organization;

            $scope.differentMaxExpirations = itemsService.hasDifferentMaxExpirations(items);

            $scope.expiredItemsCountLabel = itemsService.getExpiredRequests( items ).length;

            $scope.extendOptions = {};
            $scope.extendOptions.options = datesService.getExtendDateChoicesForView($scope.sourceExpireDate);
            $scope.extendOptions.selected = $scope.extendOptions.options[0];

            // Advanced mode off by default
            $scope.extendOptions.advancedSelector = false;

            // We use this to set default expiration date for advanced mode
            $scope.tomorrow = moment().add( 1, 'day' );

            $scope.$watch('extendOptions.selected.targetExpireDate', function() {
                $scope.selectedExtendDuration = $scope.extendOptions.selected.targetExpireDate;
            });

            $scope.expiration = {};
            $scope.expiration.errors = {};

            // Advanced date selector
            $scope.advancedDate = {};

            var nowMoment = moment().unix();

            $scope.$watch('advancedDate.date', validateDatepickerInput );
            function validateDatepickerInput( newDate ) {
                // Fired on modal open, but it's false alarm
                if ( newDate !== undefined && $scope.extendOptions.advancedSelector ) {
                    if ( $scope.advancedDate.date < nowMoment ) {
                        $scope.expiration.errors.dateInPast = true;
                    } else {
                        $scope.expiration.errors.dateInPast = false;
                        $scope.selectedExtendDuration = moment( $scope.advancedDate.date, 'X' );
                    }
                }
            }

            // Set defaults on modes switch
            $scope.$watch('extendOptions.advancedSelector', setDefaultExtendOnSelectorSwitch );
            function setDefaultExtendOnSelectorSwitch( advancedSelector ) {
                // Fired once when modal opened, false alarm
                if ( advancedSelector !== undefined && $scope.advancedDate.date ) {

                    // Reset states
                    $scope.expiration.errors.invalidDate = false;
                    $scope.expiration.dateInPast = false;

                    // Now switching modes
                    if ( advancedSelector ) {
                        // Advanced mode, set duration based on advanced default value
                        $scope.selectedExtendDuration = moment( $scope.advancedDate.date, 'X' );
                    } else {

                        // Send event to datepicker, and reset internal date there.
                        // We need this to reset errors of selected date if they were.
                        // So when we switch mode back, we have clean state.
                        $scope.$broadcast('Reset datepicker', {
                            resetTo: $scope.tomorrow
                        });

                        // Simple mode, set duration based on dropdown default value
                        $scope.selectedExtendDuration = moment( $scope.advancedDate.date, 'X' );
                    }
                }
            }

            $scope.hasErrors = function () {
                return $scope.expiration.errors.invalidDate ||
                    $scope.expiration.errors.dateInPast ||
                    $scope.expiration.errors.biggerThanMax;
            };

            $scope.approveRequestsWithExpireDuration = function() {
                $modalInstance.close( moment($scope.selectedExtendDuration ).utc().format('YYYY-MM-DDTHH:mm:ss UTC') );
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('Cancel');
            };

        } else {

            $scope.items = items;

            $scope.approveRequests = function() {
                $modalInstance.close( items );
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('Cancel');
            };

        }

    });