/*
 * This directive disable select options, setting disabled attribute based on value of property
 * Use in like that `options-disabled="option.inactive for option in options">`, where `option.inactive'
 * in this example is property that define should select item be disabled or not.
 * */

angular.module( 'nccCollaborations.itemsView' )
    .directive( 'optionsDisabled', directive );

function directive( $parse, $timeout ) {
    return {
        priority: 0,
        link: link
    };

    function disableOptions( scope, attr, element, data, fnDisableIfTrue ) {

        $( "option[value!='?']", element ).each( disableFn );

        function disableFn( i, e ) {
            var locals = {};
            locals[attr] = data[i];
            $( this ).attr( "disabled", fnDisableIfTrue( scope, locals ) );
        }
    }

    function link( scope, iElement, iAttrs, ctrl ) {
        // parse expression and build array of disabled options
        var expElements = iAttrs.optionsDisabled.match( /^\s*(.+)\s+for\s+(.+)\s+in\s+(.+)?\s*/ );
        var fnDisableIfTrue = $parse( expElements[1] );

        var options = scope.$eval( 'options' );

        $timeout( function() {
            disableOptions( scope, expElements[2], iElement, options, fnDisableIfTrue );
        } );

    }
}