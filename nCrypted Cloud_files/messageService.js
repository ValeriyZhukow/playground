angular.module('nccCollaborations.itemsView')
    .factory('jgmessages', jgmessages);

function jgmessages() {

    var SUCCESS_THEME = 'ncc-success';
    var FAILURE_THEME = 'ncc-error';
    var MESSAGE_LIFE = 3000;
    var MESSAGE_CLASSNAME = '.jGrowl-message';
    var successIconElement = '<i class="fa fa-check-circle-o"></i>';
    var failureIconElement = '<i class="fa fa-ban"></i>';

    return {
        showSuccessMessage: _generateShowMessageMethod(SUCCESS_THEME, successIconElement),
        showFailureMessage: _generateShowMessageMethod(FAILURE_THEME, failureIconElement)
    };


    function _generateShowMessageMethod(theme, iconElement) {
        return function(text) {
            $.jGrowl(text, {
                theme: theme,
                life: MESSAGE_LIFE,
                beforeOpen: _generateInsertIconInMessageMethod(iconElement)
            });
        }
    }

    function _generateInsertIconInMessageMethod(iconElement) {
        return function($messageElement) {
            $messageElement.find(MESSAGE_CLASSNAME).prepend(iconElement);
        }
    }

}
