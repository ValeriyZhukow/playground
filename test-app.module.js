angular.module('testApp', []);

angular.module('testApp')
    .controller('testController', testController);

function testController($scope) {
    $scope.domains = ['google.com', 'apple.com', 'habrahabr.com'];
    $scope.editMode = false;

    $scope.add = function() {
        $scope.domains.push($scope.newDomain);
        $scope.newDomain = '';
    };

    $scope.remove = function(idx) {
        $scope.domains.splice(idx, 1);
    };

}