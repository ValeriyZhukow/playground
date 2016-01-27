/*
* We use this directive in addition to datepicker, to set error state if selected date bigger
* than max expiration date we have in policy*/
angular.module( 'nccCollaborations.itemsView' ).
    directive( 'maxExpiration', directive );

function directive() {

    // We can't use isolate scope here, `datepicker` directive
    // already declare it on this element.
    return {
        link: link,
        restrict: 'A'
    };

    function link( scope, elem, attrs ) {

        var maxExpirationAttr;
        var itemHasPolicy;

        maxExpirationAttr = itemHasPolicy = scope.$eval( attrs.maxExpiration );

        if (!itemHasPolicy) {
            return;
        }

        // We can set date from which to count max-expiration
        // If no attribute, count from now.
        var fromDateAttr = scope.$eval( attrs.fromDate ) ;
        var fromDate = fromDateAttr ? moment(fromDateAttr) : moment();

        var maxExpirationDate = fromDate
            .add( maxExpirationAttr, 'seconds' );

        // Working with errors object "global" to datepicker directive
        var errors = scope.$eval( attrs.validationErrors );

        errors.biggerThanMax = false;

        // We use this in validation error message in template
        errors.biggerThanMaxLabel = moment
            .duration( maxExpirationAttr, 'seconds' )
            .humanize();

        scope.$watch( attrs.binddata, checkDateValidness );

        function checkDateValidness( newDate, oldDate ) {
            // invalidDate set in datepicker directive,
            // and if date is already invalid - don't validate it here
            if ( oldDate && !errors.invalidDate ) {
                var selectedExpirationDate = moment.unix( newDate );
                errors.biggerThanMax = !!selectedExpirationDate.isAfter( maxExpirationDate );
            }
        }

    }
}