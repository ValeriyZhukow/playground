angular.module('nccCollaborations.itemsView').
    controller('editItemExpireDateModalCtrl', function($scope, $modalInstance, $filter, item,
                                                       helperItem, datesService) {

        $scope.now = moment().format();

        if (helperItem) {
            $scope.item = item;

            // Collaboration have no policy, so we use policy of parent secure view.
            $scope.item.policy = helperItem.policy;
        } else {
            $scope.item = datesService.getNormalizedItem(item);
            $scope.item.policy = item.policy;
        }

        // Return date for all items type
        $scope.sourceExpireDate = +new Date($scope.item.expire);
        $scope.maxExpireDate = null;
        if (item.policy && item.policy['max-expiration'] && item.policy['max-expiration'].value) {
            $scope.maxExpireDate = new Date(new Date().getTime() +
                                            item.policy['max-expiration'].value * 1000);
        }

        var getExtendDurationFromItemExpire = _.partial(datesService.getExtendDuration, $scope.sourceExpireDate);

        $scope.extendOptions = {};
        $scope.extendOptions.options = datesService.getExtendDateChoicesForView($scope.sourceExpireDate);
        $scope.extendOptions.selected = $scope.extendOptions.options[0];

        // Advanced mode off by default
        $scope.extendOptions.advancedSelector = false;

        // We use this to set default expiration date for advanced mode
        $scope.tomorrow = moment().add(1, 'day');

        $scope.$watch('extendOptions.selected.targetExpireDate', function() {
            $scope.selectedExtendDuration = getExtendDurationFromItemExpire($scope.extendOptions.selected.targetExpireDate);
        });


        $scope.expiration = {};
        $scope.expiration.errors = {};

        if ($scope.maxExpireDate && $scope.sourceExpireDate > $scope.maxExpireDate) {
            $scope.expiration.errors.currentExpirationExceedsPolicy = true;
        }

        // Advanced date selector
        $scope.advancedDate = {};

        // Current time with little timeshift
        var now = moment().unix();

        $scope.$watch('advancedDate.date', validateDatepickerInput);
        function validateDatepickerInput(newDate) {
            // Fired on modal open, but it's false alarm
            if (newDate !== undefined && $scope.extendOptions.advancedSelector) {
                if ($scope.advancedDate.date < now) {
                    $scope.expiration.errors.dateInPast = true;
                } else {
                    $scope.expiration.errors.dateInPast = false;
                    $scope.selectedExtendDuration = getExtendDurationFromItemExpire($scope.advancedDate.date);
                }
            }
        }


        // Set defaults on modes switch
        $scope.$watch('extendOptions.advancedSelector', setDefaultExtendOnSelectorSwitch);
        function setDefaultExtendOnSelectorSwitch(advancedSelector) {
            // Fired once when modal opened, false alarm
            if (advancedSelector !== undefined && $scope.advancedDate.date) {

                // Reset states
                $scope.expiration.errors.invalidDate = $scope.expiration.errors.dateInPast = false;

                // Now switching modes
                if (advancedSelector) {
                    // Advanced mode, set duration based on advanced default value
                    $scope.selectedExtendDuration = getExtendDurationFromItemExpire($scope.advancedDate.date);
                } else {

                    // Send event to datepicker, and reset internal date there.
                    // We need this to reset errors of selected date if they were.
                    // So when we switch mode back, we have clean state.
                    $scope.$broadcast('Reset datepicker', {
                        resetTo: $scope.tomorrow
                    });

                    // Simple mode, set duration based on dropdown default value
                    $scope.selectedExtendDuration = getExtendDurationFromItemExpire($scope.extendOptions.selected.targetExpireDate);
                }
            }
        }


        $scope.hasErrors = function() {
            return $scope.expiration.errors.invalidDate ||
                   $scope.expiration.errors.dateInPast ||
                   $scope.expiration.errors.biggerThanMax ||
                   $scope.expiration.errors.currentExpirationExceedsPolicy;
        };

        // Save date
        $scope.saveShareOptions = function() {
            $modalInstance.close($scope.selectedExtendDuration);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        };


    });
