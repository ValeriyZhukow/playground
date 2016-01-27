angular.module('nccCollaborations')
    .directive('nccSpinner', function () {
        return {
            link: function (scope, element, attrs) {

                scope.isVisible = true;

                var cssClass = 'ncc-uspinner-elem';

                // Spinner options can be set in attributes where directive used.
                // Like so: <div ncc-spinner slines="10" slength="11" spostop="11px" sposleft="11px" scolor="#fff" swidth="3">

                var opts = {
                    lines: attrs['slines'] || 8, // The number of lines to draw
                    length: parseInt(attrs['slength']) ||6, // The length of each line
                    width: parseInt(attrs['swidth']) || 2, // The line thickness
                    radius: parseInt(attrs['sradius']) || 2, // The radius of the inner circle
                    corners: parseInt(attrs['scorners']) || 0.5, // Corner roundness (0..1)
                    rotate: parseInt(attrs['srotate']) || 0, // The rotation offset
                    direction: attrs['direction'] || -1, // 1: clockwise, -1: counterclockwise
                    color: attrs['scolor'] || '#006cba', // #rgb or #rrggbb or array of colors
                    speed: parseInt(attrs['sspeed']) || 2.2, // Rounds per second
                    trail: parseInt(attrs['strail']) || 80, // Afterglow percentage
                    shadow: attrs['sshadow'] || false, // Whether to render a shadow
                    hwaccel: attrs['shwaccel'] || false, // Whether to use hardware acceleration
                    className: cssClass, // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: attrs['spostop'] || '8px', // Top position relative to parent in px
                    left: attrs['sposleft'] || '-35px' // Left position relative to parent in px
                };
                scope.spinner = new Spinner(opts).spin(element[0]);

            },
            restrict: 'A',
            scope: {
                item: '='
            },
            replace: false
        }
    });