angular.module('nccCollaborations')
    .directive('uiDatetimepicker', function ($timeout) {

        return {
            require: '?ngModel',
            restrict: 'EA',
            templateUrl: '/static/ncc_collaborations/js/modules/utilites/datetimepicker/datetimepicker.html',
            replace: true,
            scope: {
                binddata: '=',
                errors: '=validationErrors',
                initDate: '&datetimepickerInitDate'
            },
            link: function(scope, element, attrs, ngModel) {

                if ( scope.initDate() ) {
                    scope.date = scope.initDate().format('MM/DD/YYYY h:mm A');
                    scope.binddata = scope.initDate().unix();
                }

                scope.errors.invalidDate = false;

                ngModel.$render = function(){
                    element.find('input').val( ngModel.$viewValue || '' );
                };

                element.datetimepicker();
                element.datetimepicker().data("DateTimePicker").setMinDate(new Date());

                element.on('dp.change', function(e){

                    var date = e.date;

                    scope.date =  date.format('MM/DD/YYYY h:mm A');

                    if ( date.isValid() ) {
                        scope.binddata = date.unix();
                        scope.errors.invalidDate = false;
                    } else {
                        scope.errors.invalidDate = true;
                    }

                    scope.$apply(read);
                });


                scope.$on('Reset datepicker', function (event, data) {
                    // Wait till $digest ends
                    $timeout(function() {
                        element.data("DateTimePicker").setDate( data.resetTo.format('MM/DD/YYYY HH:mm'))
                    });
                });


                element.find('input').on('blur', function () {
                    var date = moment(scope.date);
                    if ( date.isValid() ) {
                        element.data("DateTimePicker").setDate( date.format('MM/DD/YYYY HH:mm') );
                        scope.errors.invalidDate = false;
                        scope.binddata = date.unix();
                    } else {
                        scope.errors.invalidDate = true;
                    }
                });

                read();

                function read() {
                    var value = element.find('input').val();
                    ngModel.$setViewValue(value);
                }

            }
        }

    });



