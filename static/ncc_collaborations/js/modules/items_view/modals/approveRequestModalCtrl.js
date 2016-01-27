angular.module('nccCollaborations.itemsView')
    .controller('approveRequestModalCtrl', approveRequestModalCtrl);

function approveRequestModalCtrl($scope, $modalInstance, $log, item, datesService) {
    $scope.item = datesService.getNormalizedItem(item);

    $scope.sourceExpireDate = +new Date();
    $scope.showExpirationDate = false;

    if (item.extension_date) {
        $scope.itemRequestedExpiration = item.extension_date;
    } else {
        $scope.itemRequestedExpiration = moment().add(item.days, 'days').format();
    }

    $scope.limitedDueToPolicy = false;
    if (item.policy && item.policy['max-expiration'] && item.policy['max-expiration'].value) {
        var maxExpirationDate = moment().add(item.policy['max-expiration'].value, 'seconds').format();
        if (!moment(maxExpirationDate).isAfter(moment($scope.itemRequestedExpiration))) {
            $scope.itemRequestedExpiration = maxExpirationDate;
            $scope.limitedDueToPolicy = true;
        }
    }

    $scope.extendOptions = {};
    $scope.extendOptions.options = datesService.getExtendDateChoicesForView($scope.sourceExpireDate);
    $scope.extendOptions.selected = $scope.extendOptions.options[0];

    // Set default extend from item, no date selectors used
    $scope.selectedExtendDuration = $scope.itemRequestedExpiration;

    // We use this to set default expiration date for advanced
    $scope.tomorrow = moment().add(1, 'day');

    // Predefined extend time dropdown
    $scope.$watch('extendOptions.selected.targetExpireDate', updateSelectedExtendDuration);
    function updateSelectedExtendDuration(newVal, oldVal) {
        if (!_.isEqual(newVal, oldVal)) {
            $scope.selectedExtendDuration = $scope.extendOptions.selected.targetExpireDate;
        }
    }

    $scope.expiration = {};
    $scope.expiration.errors = {};

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
                $scope.selectedExtendDuration = moment($scope.advancedDate.date, 'X');
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

    $scope.hasErrors = function() {
        return $scope.expiration.errors.invalidDate ||
               $scope.expiration.errors.dateInPast ||
               $scope.expiration.errors.biggerThanMax;
    };

    $scope.approveRequest = function() {
        var dateFormat = 'YYYY-MM-DDTHH:mm:ss UTC';
        $modalInstance.close(moment($scope.selectedExtendDuration).utc().format(dateFormat));
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('Cancel');
    };
}
