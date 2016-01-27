angular.module('nccCollaborations')
    .directive('disableTextSelection', function ($log) {

        return {
            link: function (scope, element, attrs) {
                // Old IE use `selectstart` event, other browsers - `mousedown`
                var supportSelectstartEvent = "onselectstart" in document.createElement( "div" );

                $(element).on(supportSelectstartEvent ? 'selectstart' : 'mousedown', function(e) {
                    e.preventDefault();
                });
            }
        };

    });