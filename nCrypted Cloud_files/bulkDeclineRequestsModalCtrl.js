angular.module('nccCollaborations.itemsView').
    controller('bulkDeclineRequestsModalCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;

        if (items.length === 1) {
            $scope.recipients = items[0].collaboration.friendly_name;
        }

        $scope.activateItem = function() {
            $modalInstance.close( items );
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        };

    });