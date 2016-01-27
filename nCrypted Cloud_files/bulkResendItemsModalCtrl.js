angular.module('nccCollaborations.itemsView').
    controller('bulkResendItemsModalCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;

        if (items.length === 1) {
            $scope.recipients = _.map(items[0].collaborations, function(collaboration) {
                return collaboration.friendly_name;
            }).join(', ');
        };

        $scope.resendNotifications = function(items) {
            $modalInstance.close(items);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('Modal dismissed');
        };

    });