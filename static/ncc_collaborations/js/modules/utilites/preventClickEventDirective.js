angular.module('nccCollaborations.itemsView')
    .directive('preventClickEvent', function() {
        return function(scope, element) {
            element.on("click", function(event) {
                event.stopPropagation();
            });
        };
    });