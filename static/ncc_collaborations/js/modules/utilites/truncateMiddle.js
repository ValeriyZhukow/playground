angular.module( 'nccCollaborations' )
    .directive( 'truncateMiddle', truncateMiddle );

function truncateMiddle( $timeout, $window ) {
    return {
        restrict: 'A',
        link: function( scope, element ) {

            var DIVIDER = '...';

            var sourceString;
            var $textElement;
            var container;


            // We need timeout so we have Angular expression interpolations done.
            $timeout( function() {
                initElement( element );
                setTrimmedStringInElement( container, $textElement, sourceString );
            } );

            // After resize we need to recalculate all to new container sizes
            $( $window ).bind( 'resize', debounce( function() {
                setTrimmedStringInElement( container, $textElement, sourceString );
            } ) );


            function initElement( element ) {
                // FIXME Its bad to rely on known DOM structure
                $textElement = $( element ).find( 'span' ).eq( 0 );
                sourceString = $textElement.text().trim();
                container = element[0];
            }


            function setTrimmedStringInElement( container, $textElement, sourceString ) {

                if ( !isStringOverflowContainer( container ) ) {
                    return true;
                }

                $textElement.text( truncateStringToContainer( container, sourceString ) );

                setTrimmedStringInElement = function( container, $textElement, sourceString ) {

                    // Now on subsequent calls reset text first
                    $textElement.text( sourceString );
                    if ( !isStringOverflowContainer( container ) ) {
                        return true;
                    }
                    $textElement.text( truncateStringToContainer( container, sourceString ) );
                }

            }


            function truncateStringToContainer( container, string ) {
                var containerLengthInChars = getContainerLengthInChars( container, string.length );
                return truncateStringWithDivider( string, containerLengthInChars, DIVIDER );
            }


            function truncateStringWithDivider( string, containerLengthInChars, divider ) {
                var containerHalfLength = Math.floor( containerLengthInChars / 2 ) - Math.floor( divider.length / 2 );
                var stringHead = string.slice( 0, containerHalfLength );
                var stringTail = string.slice( containerHalfLength );
                return stringHead.slice( 0, containerHalfLength ).trim() + divider + stringTail.slice( -containerHalfLength ).trim();
            }


            function getContainerLengthInChars( container, stringLength ) {
                var stringWidthInPixels = container.scrollWidth;
                var containerWidthInPixels = container.clientWidth;
                var proportion = (containerWidthInPixels / stringWidthInPixels).toFixed( 2 );
                return Math.floor( stringLength * proportion );
            }


            function isStringOverflowContainer( container ) {
                return container.scrollWidth > container.clientWidth;
            }


            function debounce( fn ) {
                var timeoutID;
                var delay = 300;
                return function() {
                    var args = Array.prototype.slice.call( arguments );
                    $timeout.cancel( timeoutID );
                    timeoutID = $timeout( _.bind( function() {
                        fn.apply( this, args );
                    }, this ), delay );
                }
            }

        }
    }
}