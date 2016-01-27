angular.module('nccCollaborations.itemsView')
    .factory('metadataService', function() {

        function updateCollaborationsMeta(items) {
            return _.each(items, function(item) {
                _.map(getExpiredCollaborations(item.collaborations), updateExpiredCollaborationMeta);
            });
        }

        function getExpiredCollaborations(collaborations) {
            return _.filter(collaborations, isExpiredNow)
        }

        function updateExpiredCollaborationMeta(collaboration) {
            collaboration.active = false;
            collaboration.expired = true;
            return collaboration;
        }

        function isExpiredNow(item) {
            return item.expire && (new Date(item.expire) < new Date());
        }


        var itemServiceProps = {
            isSelected: false,
            isResending: false,
            isExpanded: false,
            isPathShowed: false,
            isActionSucceed: false,
            isActionFailed: false
        };

        function hasExpiredCollaborations(item) {
            return !_.isEmpty(_.where(item.collaborations, {expired: true}));
        }

        function isAllCollaborationsOfItemExpired(item) {
            return item.collaborations.length === _.where(item.collaborations, {expired: true}).length;
        }

        function updateItemsMeta(items) {
            return _.map(items, function(item) {
                _.extend(item, itemServiceProps);
                if (item.collaborations.length === 1 && hasExpiredCollaborations(item)) {
                    item.active = false;
                    item.expired = true;
                }

                if (isAllCollaborationsOfItemExpired(item)) {
                    item.active = false;
                    item.expired = true;
                }

                return item
            });
        }

        // Somewhere in server responses (search) we have raw collaborations.
        // So we make items from them because we work with items everywhere.
        // And we use flag `isFaux` to differ it from real items in api requests.
        function convertCollaborationsToItems(collaborations) {
            return _.map(collaborations, function(collaboration) {
                return {
                    id: collaboration.secureViewId,
                    active: collaboration.active,
                    created: collaboration.created,
                    name: collaboration.name,
                    paths: collaboration.paths,
                    collaborations: [collaboration],
                    isFaux: true
                };
            });
        }

        return {
            updateItemsMeta: updateItemsMeta,
            updateCollaborationsMeta: updateCollaborationsMeta,
            convertCollaborationsToItems: convertCollaborationsToItems
        }
    });