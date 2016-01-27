angular.module('nccCollaborations.itemsView')
    .factory('itemsService', itemsService);

function itemsService() {

    var SECURE_MAIL_CATEGORY = 4;

    return {
        getSelectedItems: getSelectedItems,
        getSelectedItemsWithoutSecureMails: getSelectedItemsWithoutSecureMails,
        hasSecureMails: hasSecureMails,
        getCollaborationsFromSecureViews: getCollaborationsFromSecureViews,
        hasSelectedItems: hasSelectedItems,
        setAllItemsSelected: setAllItemsSelected,
        setAllItemsDeselected: setAllItemsDeselected,
        checkIfSecureMailsOnly: checkIfSecureMailsOnly,

        getExpiredRequests: getExpiredRequests,
        hasExpiredRequests: hasExpiredRequests,
        getNotExpiredRequests: getNotExpiredRequests,
        getRequestsPolicies: getRequestsPolicies,

        getItemWithMinMaxExpiration: getItemWithMinMaxExpiration,
        hasMixedItemTypesInSelection: hasMixedItemTypesInSelection,
        hasDifferentMaxExpirations: hasDifferentMaxExpirations,

        hasExpiredSecureViews: hasExpiredSecureViews,
        getExpiredSecureViews: getExpiredSecureViews
    };


    function getSelectedItems(items) {
        return _.where(items, {isSelected: true});
    }

    function getSelectedItemsWithoutSecureMails(items) {
        return _.filter(items, function(item) {
            return item.isSelected && item.category !== SECURE_MAIL_CATEGORY;
        })
    }

    function hasSecureMails(items) {
        return !_.isEmpty(getSecureMailsItems(items));
    }

    function getCollaborationsFromSecureViews(items) {
        return _.flatten(_.pluck(items, 'collaborations'));
    }

    function getSecureMailsItems(items) {
        return _.where(items, {category: SECURE_MAIL_CATEGORY})
    }

    function hasSelectedItems(items) {
        return !_.isEmpty(getSelectedItems(items));
    }

    function setAllItemsSelected(items) {
        _.each(items, function(item) {
            item.isSelected = true;
        });
    }

    function setAllItemsDeselected(items) {
        _.each(items, function(item) {
            item.isSelected = false;
        });
    }

    function checkIfSecureMailsOnly(items) {
        return _.every(items, function(item) {
            return item.category === SECURE_MAIL_CATEGORY;
        });
    }

    function getExpiredRequests(items) {
        var now = new Date();
        return _.filter(items, function(item) {
            var expireDate = new Date(item.collaboration.expire);
            return expireDate < now;
        })
    }

    function getNotExpiredRequests(items) {
        var expiredRequests = getExpiredRequests(items);
        return _.difference(items, expiredRequests);
    }

    function hasExpiredRequests(items) {
        return !_.isEmpty(getExpiredRequests(items));
    }


    function getRequestsPolicies(items) {
        return _.map(items, function(item) {
            return item.policy || null;
        });
    }


    function hasMixedItemTypesInSelection(items) {

        // Get proper function to work with request or secure view
        var _separateItemsToPersonalAndOrg = _generateSeparateFn( items[0] );

        var itemsByType = _.reduce(items, _separateItemsToPersonalAndOrg, {
            organization: [],
            personal: []
        });

        var allItemsAreOrgItems = _.isEmpty(itemsByType.personal);
        var allItemsArePersonalItems = _.isEmpty(itemsByType.organization);
        var allOrgItemsAreTheSameOrg = _.uniq(itemsByType.organization).length === 1;

        return !(allItemsArePersonalItems || allItemsAreOrgItems && allOrgItemsAreTheSameOrg);

    }


    function _generateSeparateFn(item) {

        var separateFn;

        var isRequest = !!item.collaboration;
        var isSecureView = !!item.collaborations;

        if (isRequest) {
            separateFn = function(itemsByType, item) {
                var isOrgItem = !!item.policy;
                if (isOrgItem) {
                    itemsByType.organization.push(item.organization);
                } else {
                    itemsByType.personal.push(item.name);
                }

                return itemsByType;
            }
        }

        if (isSecureView) {
            separateFn = function(itemsByType, item) {
                var isOrgItem = !!item.policy;
                if (isOrgItem) {
                    itemsByType.organization.push(item.collaborations[0].identity.organization);
                } else {
                    itemsByType.personal.push(item.name);
                }

                return itemsByType;
            }
        }

        return separateFn;

    }


    function getItemWithMinMaxExpiration(items) {
        var item = _.min(items, _getMaxExpirationOrInfinity);
        if (item == Infinity){
            if (items.length){
                return items[0];
            }
        }
        return item;
    }


    function hasDifferentMaxExpirations(items) {
        var expirations = _.map(items, _getMaxExpirationOrInfinity);
        return _.uniq(expirations).length > 1;
    }


    function _getMaxExpirationOrInfinity(item) {
        return item.policy ? item.policy['max-expiration'].value : Infinity;
    }


    function hasExpiredSecureViews(items) {
        return !_.isEmpty( getExpiredSecureViews(items));
    }


    function getExpiredSecureViews(items) {
        return _.filter(items, function(item) {
            return item.expired;
        });
    }
}