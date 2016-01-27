angular.module('nccCollaborations.itemsView').
    controller('sendRequestReminderModalCtrl', sendRequestReminderModalCtrl );

function sendRequestReminderModalCtrl( $scope, $modalInstance, $filter, item, datesService ) {

    $scope.shareOwner = item.collaboration.identity.name + ' (' + item.collaboration.identity.email + ')';

    // Save date
    $scope.sendRequestReminder = function() {
        $modalInstance.close(item);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('Cancel');
    };
}