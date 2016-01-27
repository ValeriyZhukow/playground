/*
 * TODO We use similar directive in trusted sharing modal
 * We need to abstract it to module with corresponding styles
 * */
angular.module('nccCollaborations')
    .directive('disableIfNotFolder', function () {
        return {
            restrict: 'A',
            priority: 200,
            link: function (scope, elem, attrs) {
                var $label = $(elem).parent();

                if (!scope.item.is_folder) {
                    elem.attr("disabled", true);
                    $label.addClass('form-label-disabled');
                    $label.tooltip({
                        title: 'This option available only for folders'
                    });
                }

            }
        }
    });