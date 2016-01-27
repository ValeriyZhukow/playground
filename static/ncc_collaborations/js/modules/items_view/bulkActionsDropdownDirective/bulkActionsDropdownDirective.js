angular.module( 'nccCollaborations' )
    .directive( 'bulkActionsDropdown', bulkActionsDirective );

function bulkActionsDirective() {
    return {
        templateUrl: '/static/ncc_collaborations/js/modules/items_view/bulkActionsDropdownDirective/bulk_actions_dropdown_directive.html',
        restrict   : 'E',
        scope      : {
            checkIfItemsSelected: '&onDropdownOpen',
            activateAction: '&',
            disableAction: '&',
            resendAction: '&',
            togglePathsAction: '&',
            togglePathsLabel: '=',
            approveAction: '&',
            declineAction: '&',
            deleteAction: '&',
            requestExtensionAction: '&',
            sendRequestReminderAction: '&',
            deleteRequestAction: '&',
            requestAccessAction: '&',
            items: '=',
            view: '=conditionalActionsFlag',
            actionsFor: '@',
            secureMailsOnly: '='
        },
        replace: true,
        link: function ( scope, element, attrs ) {

            scope.getSelectedItems = function ( items, actionsFor ) {
                return _.chain( items )
                    .filter( function ( item ) {
                        if (actionsFor === 'swmActive') {
                            return item.isSelected && item.expire;
                        }

                        return item.isSelected;
                    } )
                    .pluck( 'id' )
                    .value();
            };

            if ( scope.view === 'active' ) {
                scope.activeView = true;
            } else {
                scope.disabledView = true;
            }
        }
    }
}


