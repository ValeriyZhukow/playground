angular.module('nccCollaborations.itemsView').
    controller('bulkDeleteRequestsModalCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;

        if (items.length === 1) {
            $scope.recipients = items[0].collaboration.friendly_name;
        }

        $scope.deleteItem = function() {
            $modalInstance.close( items );
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        };

    });