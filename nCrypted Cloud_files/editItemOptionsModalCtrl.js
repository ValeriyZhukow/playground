angular.module('nccCollaborations.itemsView')
    .controller('editItemOptionsModalCtrl', editItemOptionsModalController);

function editItemOptionsModalController($scope, $modalInstance, item) {
    $scope.now = moment().format();
    $scope.itemName = item.name;
    $scope.item = item;

    $scope.options = {
        can_read: item.collaborations[0].can_read,
        can_download: item.collaborations[0].can_download,
        can_create: item.collaborations[0].can_create,
        watermark: item.collaborations[0].watermark,
        login_required: item.collaborations[0].login_required,
        pin_protected: item.collaborations[0].pin_protected,
        require_terms_of_use: item.collaborations[0].require_terms_of_use,
        show_terms_once: item.collaborations[0].show_terms_once
    };

    $scope.showpassword = false;

    $scope.generateNewPin = function() {
        $scope.newPinShouldBeShown = true;
    };

    $scope.$watch('options.pin_protected', function(accessCode) {
        if (!accessCode) {
            $scope.newPinShouldBeShown = false;
        }
    });

    $scope.expiration = {};
    $scope.expiration.errors = {};

    // See NCCWEB-2061 for logic here. No Expiration should be disabled when:
    // - Set a default expiration for all shares is set, Allow user to override is unchecked
    // - Set maximum expiration time for all shares is set, Allow user to override is unchecked
    if (item.policy) {
        $scope.noExpirationDisabled = ($scope.item.policy.expiration.value && !$scope.item.policy.expiration.can_override) ||
            ($scope.item.policy['max-expiration'].value && !$scope.item.policy['max-expiration'].can_override);
    } else {
        $scope.noExpirationDisabled = false;
    }

    // Set initial datepicker mode and value
    if (item.collaborations[0].expire) {
        $scope.expiration.initDate = moment(item.collaborations[0].expire);
        $scope.expiration.mode = 'expiration';
    } else {
        $scope.expiration.initDate = moment().add(1, 'day');
        $scope.expiration.mode = 'noExpiration';
    }

    $scope.saveShareOptions = function() {
        collectOptions($scope.options);
        $modalInstance.close(collectOptions($scope.options));
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('Cancel');
    };

    function collectOptions(options) {
        // Null expire will remove expiration from item
        if ($scope.expiration.mode === 'noExpiration') {
            options.expire = null;
        } else {
            options.expire = moment.unix($scope.expiration.value).toISOString();
        }
        return options;
    }
}
