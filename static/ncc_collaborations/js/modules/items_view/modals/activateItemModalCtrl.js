angular.module( 'nccCollaborations.itemsView' ).
    controller( 'activateItemModalCtrl', function( $scope, $modalInstance, item, datesService ) {

        $scope.item = datesService.getNormalizedItem( item );
        var expirationCompensation = 0;

        $scope.item.policy = item.policy;

        if (_.isUndefined($scope.item.expire) || _.isNull($scope.item.expire)) {
            $scope.sourceExpireDate = new Date();
        } else {
            $scope.sourceExpireDate = +new Date( $scope.item.expire );
        }

        // When activating, if expired, extend from now
        var now = +new Date();

        $scope.expired = $scope.sourceExpireDate < moment() ;

        if ( $scope.expired ) {
            expirationCompensation = Math.abs(
                moment($scope.sourceExpireDate).diff(moment())
            ) / 1000;
            $scope.sourceExpireDate = now;
        }

        var getExtendDurationFromItemExpire = _.partial(
            datesService.getExtendDuration, $scope.sourceExpireDate);

        $scope.extendOptions = {};
        $scope.extendOptions.options = datesService.getExtendDateChoicesForView(
            $scope.sourceExpireDate
        );
        $scope.extendOptions.selected = $scope.extendOptions.options[0];

        // Advanced mode off by default
        $scope.extendOptions.advancedSelector = false;

        // We use this to set default expiration date for advanced mode
        $scope.tomorrow = moment().add( 1, 'day' );

        $scope.$watch('extendOptions.selected.targetExpireDate', function() {
            $scope.selectedExtendDuration = getExtendDurationFromItemExpire(
                $scope.extendOptions.selected.targetExpireDate
            );
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
                    $scope.selectedExtendDuration = getExtendDurationFromItemExpire(
                        $scope.advancedDate.date);
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
                    $scope.selectedExtendDuration = getExtendDurationFromItemExpire(
                        $scope.advancedDate.date
                    );
                } else {

                    // Send event to datepicker, and reset internal date there.
                    // We need this to reset errors of selected date if they were.
                    // So when we switch mode back, we have clean state.
                    $scope.$broadcast('Reset datepicker', {
                        resetTo: $scope.tomorrow
                    });

                    // Simple mode, set duration based on dropdown default value
                    $scope.selectedExtendDuration = getExtendDurationFromItemExpire(
                        $scope.extendOptions.selected.targetExpireDate
                    );
                }
            }
        }


        $scope.hasErrors = function() {
            return $scope.dateInPastError || $scope.biggerThanMaxError;
        };

        // Save date
        $scope.saveShareOptions = function() {
            $modalInstance.close(
                $scope.selectedExtendDuration + expirationCompensation
            );
        };

        $scope.cancel = function() {
            $modalInstance.dismiss( 'Cancel' );
        };


        $scope.activateItem = function() {
            $modalInstance.close( item );
        };

        $scope.cancel = function() {
            $modalInstance.dismiss( 'Cancel' );
        };
    } );
