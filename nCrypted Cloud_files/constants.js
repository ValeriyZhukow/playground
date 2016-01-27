angular.module('nccCollaborations')
    .factory('Constants', function (BackEndConstants) {
        var constants = {
            'itemsPerPageChoices': [25, 50, 100],
            'wants_alpha': BackEndConstants.wants_alpha,
            'request_access_days': BackEndConstants.request_access_days
        };

        return {
            set: function(key, value) {
                return constants[key] = value;
            },
            get: function (key) {
                return constants[key];
            },
            // this is a handy way to make all constants available in your HTML
            // e.g. $scope.c = Constants.all()
            all: function () {
                return constants;
            }
        };
    });
