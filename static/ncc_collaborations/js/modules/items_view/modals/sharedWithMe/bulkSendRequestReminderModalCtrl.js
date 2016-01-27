angular.module('nccCollaborations.itemsView').
    controller('bulkSendRequestReminderModalCtrl', bulkSendRequestReminderModalCtrl );

function bulkSendRequestReminderModalCtrl( $scope, $modalInstance, $filter, items, datesService ) {

    //$scope.shareOwner = item.collaboration.identity.name + ' (' + item.collaboration.identity.email + ')';

    // Save date
    $scope.sendRequestReminder = function() {
        $modalInstance.close(items);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('Cancel');
    };
}