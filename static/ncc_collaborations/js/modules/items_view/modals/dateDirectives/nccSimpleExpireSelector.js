angular.module('nccCollaborations.itemsView')
    .directive('nccSimpleExpireSelector', directive);

function directive() {
    return {
        link: link,
        restrict: 'E',
        templateUrl: '/static/ncc_collaborations/js/modules/items_view/modals/dateDirectives/simpleExpireSelector.html',
        scope: {
            item: '=',
            options: '=',
            selected: '=',
            fromDate: '='
        }
    };

    function link(scope, elem, attrs) {}
}