angular.module('nccCollaborations.itemsView').
    controller('declineRequestModalCtrl', function ($scope, $modalInstance, item) {

        $scope.item = item;

        $scope.recipients = item.collaboration.email;

        $scope.declineRequest = function() {
            $modalInstance.close(item);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        };

    });