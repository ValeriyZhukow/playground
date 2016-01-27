angular.module( 'nccCollaborations' )
    .directive( 'paginationTooltips', paginationTooltips );

function paginationTooltips( $timeout ) {
    return {
        restrict: 'A',
        replace: true,
        link: function ( scope, element, attrs ) {

            scope.$watch('requestInProgress', function(newVal) {
                if (!newVal) {
                    $timeout(initTooltips);
                }
            });

            function initTooltips() {
                var elements = getPaginatorElements();
                _.each( elements, function ( element, title ) {
                    element.tooltip( {title: title} );
                } );
            }

            // We must run this in $timeout so DOM is ready to get paginator elements.
            function getPaginatorElements() {
                return {
                    'First page': $( element ).find( 'ul li:nth-child(1) > a' ),
                    'Previous page': $( element ).find( 'ul li:nth-child(2) > a' ),
                    'Last page': $( element ).find( 'ul li:nth-last-child(1) > a' ),
                    'Next page': $( element ).find( 'ul li:nth-last-child(2) > a' )
                };
            }
        }
    }
}