angular.module('nccCollaborations.itemsView')
    .filter('recipientsFilter', function ($sce) {
        return function (item) {

            var recipients = '';

            // For request access
            if (item.collaboration) {
                return $sce.trustAsHtml(item.collaboration.friendly_name);
            }

            // For single collaboration
            if (!item.collaborations) {
                return $sce.trustAsHtml(item.friendly_name);
            }

            // For items
            if (item.collaborations.length > 1) {
                _.map(item.collaborations, function (collaboration, i) {

                    if (i < item.collaborations.length - 1) {
                        recipients += collaboration.friendly_name;

                        if (i != item.collaborations.length - 2) {
                            recipients += ', ';
                        }
                    }
                });
                recipients += ', <span style="font-weight: normal">&</span>&nbsp;' +
                    item.collaborations[item.collaborations.length - 1].friendly_name;
            } else {
                recipients = item.collaborations[0].friendly_name;
            }
            return  $sce.trustAsHtml(recipients);
        };
    });