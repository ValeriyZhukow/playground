angular.module('nccTruncate')
    .directive('nccTruncate', nccTruncate);

function nccTruncate($parse, $timeout, $rootScope, nccTruncateService) {
    var directive = {
        restrict: 'A',
        link: link,
        scope: true
    };

    return directive;

    function link(scope, element, attrs) {

        var needTooltip = _.has(attrs, 'nccTruncateTooltip');
        var gotCustomTooltip = attrs.nccTruncateTooltip !== '';
        var truncateOnEvent = attrs.nccTruncateOn;

        setTextAndTruncate();

        if (truncateOnEvent) {
            scope.$on(truncateOnEvent, setTextAndTruncate);
        }

        function setTextAndTruncate() {
            scope.string = scope.tooltip = $parse(attrs.nccTruncate)(scope) || attrs.nccTruncate;

            if (gotCustomTooltip) {
                scope.tooltip = $parse(attrs.nccTruncateTooltip)(scope);
            }

            // To correctly calculate overflow, we need actual text in element first
            element.text(scope.string);

            // We use `false` as a third parameter to not fire `$digest` (we don't need it here)
            // But we need `$timeout` to be sure truncate fired after DOM manipulations (like in modals)
            $timeout(truncateString, 0, false);
        }

        function truncateString() {
            if (nccTruncateService.isOverflowed(element[0])) {
                element.text(nccTruncateService.truncateStringToElement(scope.string, element[0]));

                if (needTooltip) {

                    var tooltipOptions = {
                        title: scope.string,
                        delay: 500
                    };

                    // Got options object from directive
                    if (_.isObject(scope.tooltip)) {
                        _.extend(tooltipOptions, scope.tooltip)
                    };

                    // Got tooltip text from directive
                    if (_.isString(scope.tooltip)) {
                        tooltipOptions.title = scope.tooltip
                    };

                    $(element).tooltip(tooltipOptions);
                }
            }
        }
    }

}