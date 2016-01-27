/* This directive tightly coupled with `optionsDisabled` one. It set `inactive` property
 * on `options`, and than `optionsDisabled` set disabled attribute on DOM element based on
 * this property.
 * */

angular.module( 'nccCollaborations.itemsView' )
    .directive( 'disableIfOptionAfter', directive );

function directive() {
    return {
        link: link,
        restrict: 'A'
    };

    function link( scope, elem, attrs ) {

        var maxExpirationAttr;
        var itemHasPolicy;

        maxExpirationAttr = itemHasPolicy = scope.$eval( attrs.disableIfOptionAfter );

        if (!itemHasPolicy) {
            return;
        }

        // Count max-expiration from setted date or from now
        var fromDate = scope.fromDate ? moment(scope.fromDate) : moment();

        var maxExpirationDate = fromDate.add( maxExpirationAttr, 'seconds' );

        _.each( scope.options, deactivateIfAfterMaxDate );

        function deactivateIfAfterMaxDate( option ) {
            option.inactive = option.targetExpireDate.isAfter( maxExpirationDate );
        }
    }
}