angular.module('nccCollaborations')
    .directive('expirationDateSelector', function ($log) {
    return {
        templateUrl: '/static/ncc_collaborations/js/modules/items_view/expirationDateSelectorDirective/expiration_date_selector.html',
        replace: true,
        scope: {
            outerExpirationTime: '=model'
        },
        link: function (scope, element, attrs) {

            var periods = [
                {name: 'months', value: 2628000},
                {name: 'days', value: 86400},
                {name: 'hours', value: 3600},
                {name: 'minutes', value: 60}
            ];

            // We work with inner time inside directive,
            // and save result to outer scope.
            scope.expirationTime = scope.outerExpirationTime;

            // Set default custom time
            scope.customTime = {value: 2, period: 'days'};

            scope.innerSelectShouldBeShowed = false;

            scope.showInnerSelect = function () {
                scope.innerSelectShouldBeShowed = true;
            };

            // Show inner select only when custom option
            scope.$watch('expirationTime', function (newVal, oldVal) {
                if (newVal == 'custom') {
                    scope.outerExpirationTime = convertTimeToSeconds(scope.customTime.value, scope.customTime.period);
                } else {
                    scope.innerSelectShouldBeShowed = false;
                    scope.outerExpirationTime = newVal;
                }
            });


            // When inner custom time changed with controls,
            // convert and set it to outer value
            scope.$watch('customTime', function (newVal, oldVal) {
                if( !_.isEqual(newVal, oldVal) ) {
                    scope.outerExpirationTime = convertTimeToSeconds(scope.customTime.value, scope.customTime.period);
                }
            }, true);

            var firstAccess = -1;
            var oneDay = 86400;
            var oneMonth = 604800;

            // When outer scope value changed, set it in directive controls
            scope.$watch('outerExpirationTime', function (time, oldTime) {
                if (time == firstAccess) {
                    scope.expirationTime = firstAccess
                } else if (time == oneDay) {
                    scope.expirationTime = oneDay;
                } else if (time == oneMonth) {
                    scope.expirationTime = oneMonth;
                } else {
                    scope.innerSelectShouldBeShowed = true;
                    scope.expirationTime = 'custom';
                    scope.customTime.value = getPeriodValueFromSeconds(time);
                    scope.customTime.period = getPeriodNameFromSeconds(time);
                }
            });

            function getTimePeriodFormSeconds (seconds) {
                return _.find(periods, function (period) {
                    return seconds % period.value === 0;
                });
            };

            function getPeriodNameFromSeconds(seconds) {
                return getTimePeriodFormSeconds(seconds).name;
            };

            function getPeriodValueFromSeconds (seconds) {
                var value = getTimePeriodFormSeconds(seconds).value;
                return seconds / value;
            };

            function convertTimeToSeconds (value, period) {
                var multiplier = 1;

                switch (period) {
                    case 'minutes':
                        multiplier = 60;
                        break;
                    case 'hours':
                        multiplier = 60 * 60;
                        break;
                    case 'days':
                        multiplier = 60 * 60 * 24;
                        break;
                    case 'months':
                        multiplier = 60 * 60 * 24 * 31;
                        break;
                    default:
                        multiplier = 60;
                }

                return value * multiplier;
            };


        }
    };

});