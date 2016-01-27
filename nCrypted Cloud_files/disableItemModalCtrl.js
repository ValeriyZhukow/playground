angular.module('nccCollaborations.itemsView').
    controller('disableItemModalCtrl', function ($scope, $modalInstance, item) {

        $scope.item = item;

        $scope.disableItem = function() {
            $modalInstance.close( item );
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        };

    });