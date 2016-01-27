var myApp = angular.module('requestAccess', []);

myApp.controller('exiprationDates', ['$scope', function($scope) {

    $scope.dates = [];
    $scope.current = moment();
    $scope.dates.push({days: 1, text: 'One Day - ' +  $scope.current.add(1, 'days').format('MMMM D, YYYY, h:mm A')});
    $scope.current = moment();
    $scope.dates.push({days: 7, text: 'One Week - ' +  $scope.current.add(7, 'days').format('MMMM D, YYYY, h:mm A')});
    $scope.current = moment();
    $scope.dates.push({days: 30, text: 'One Month - ' +  $scope.current.add(1, 'months').format('MMMM D, YYYY, h:mm A')});

    $scope.willExpireCurrent = function(expDate) {
        $scope.current = moment(expDate);
        return $scope.current.format('MMMM D, YYYY, h:mm A');
    };

    $scope.currentExpiration = function(expiration) {
        $scope.current_temp = moment(expiration);
        return $scope.current_temp.format('MMMM D, YYYY, h:mm A');
    };

    if("undefined" !== typeof expDate) $scope.expDate = expDate;
    if("undefined" !== typeof expiration) $scope.expiration = expiration;

}]);
