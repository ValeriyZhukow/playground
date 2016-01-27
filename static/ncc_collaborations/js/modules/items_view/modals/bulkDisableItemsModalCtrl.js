angular.module('nccCollaborations.itemsView').
    controller('bulkDisableItemsModalCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;

        if (items.length === 1) {
            $scope.recipients = _.map(items[0].collaborations, function(collaboration) {
                return collaboration.friendly_name;
            }).join(', ');
        };

        $scope.activateItem = function() {
            $modalInstance.close( items );
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        };

    });