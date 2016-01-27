angular.module('nccCollaborations.itemsView').
    controller('requestExtensionModalCtrl', function ($scope, $modalInstance, $filter, item, datesService) {

        $scope.item = item;

        $scope.item.policy = item.policy;

        // Return date for all items type
        $scope.sourceExpireDate = + new Date( $scope.item.expire ) || + new Date();

        var getExtendDurationFromItemExpire = _.partial( datesService.getExtendDuration, $scope.sourceExpireDate );

        $scope.extendOptions = {};
        $scope.extendOptions.options = datesService.getExtendDateChoicesForView($scope.sourceExpireDate);
        $scope.extendOptions.selected = $scope.extendOptions.options[0];

        // Advanced mode off by default
        $scope.extendOptions.advancedSelector = false;

        // We use this to set default expiration date for advanced mode
        $scope.tomorrow = moment().add(1, 'day');

        $scope.$watch('extendOptions.selected.targetExpireDate', function () {
            $scope.selectedExtendDuration = $scope.extendOptions.selected.targetExpireDate;
        });


        $scope.expiration = {};
        $scope.expiration.errors = {};


        // Advanced date selector
        $scope.advancedDate = {};

        // Current time with little timeshift
        var now = moment().unix();

        $scope.$watch('advancedDate.date', validateDatepickerInput );
        function validateDatepickerInput( newDate ) {
            // Fired on modal open, but it's false alarm
            if ( newDate !== undefined && $scope.extendOptions.advancedSelector ) {
                if ( $scope.advancedDate.date < now ) {
                    $scope.expiration.errors.dateInPast = true;
                } else {
                    $scope.expiration.errors.dateInPast = false;
                    $scope.selectedExtendDuration = moment($scope.advancedDate.date, 'X');
                }
            }
        }


        // Set defaults on modes switch
        $scope.$watch('extendOptions.advancedSelector', setDefaultExtendOnSelectorSwitch );
        function setDefaultExtendOnSelectorSwitch( advancedSelector ) {
            // Fired once when modal opened, false alarm
            if ( advancedSelector !== undefined && $scope.advancedDate.date ) {

                // Reset states
                $scope.expiration.errors.invalidDate = $scope.expiration.errors.dateInPast = false;

                // Now switching modes
                if ( advancedSelector ) {
                    // Advanced mode, set duration based on advanced default value
                    $scope.selectedExtendDuration = moment($scope.advancedDate.date, 'X');
                } else {

                    // Send event to datepicker, and reset internal date there.
                    // We need this to reset errors of selected date if they were.
                    // So when we switch mode back, we have clean state.
                    $scope.$broadcast('Reset datepicker', {
                        resetTo: $scope.tomorrow
                    });

                    // Simple mode, set duration based on dropdown default value
                    $scope.selectedExtendDuration = moment($scope.extendOptions.selected.targetExpireDate, 'X');
                }
            }
        }


        $scope.hasErrors = function () {
            return $scope.expiration.errors.invalidDate || $scope.expiration.errors.dateInPast
        };

        // We need this to send duration from item expire
        var expirationCompensation = Math.abs( moment( $scope.sourceExpireDate ).diff( moment() ) ) / 1000;

        // Save date
        $scope.saveShareOptions = function() {
            $modalInstance.close( moment($scope.selectedExtendDuration).utc().format('YYYY-MM-DDTHH:mm:ss UTC'));
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        };


    });
