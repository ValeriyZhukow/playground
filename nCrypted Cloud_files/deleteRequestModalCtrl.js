angular.module('nccCollaborations.itemsView').
    controller('deleteRequestModalCtrl', function ($scope, $modalInstance, item) {

        $scope.item = item;

        $scope.recipients = item.collaboration.email;

        $scope.deleteRequest = function() {
            $modalInstance.close(item);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        };

    });