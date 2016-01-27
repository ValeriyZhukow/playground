angular.module('nccCollaborations.itemsView').
    controller('resendItemModalCtrl', function ($scope, $modalInstance, item, collaborations) {

        // We take have last when resend collaboration only.
        $scope.item = item || collaborations[0];

        $scope.resendRequestAccess = function() {
            $modalInstance.close( collaborations );
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Cancel');
        };

    });
