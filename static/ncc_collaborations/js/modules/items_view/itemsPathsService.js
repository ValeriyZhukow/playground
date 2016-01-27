angular.module('nccCollaborations.itemsView')
    .factory('itemsPaths', itemsPaths);

function itemsPaths($q, $rootScope, collaborationApi) {

    var togglePathsDropdownLabel = {text: 'Show paths'};

    return {
        togglePathsDropdownLabel: togglePathsDropdownLabel,
        togglePaths: togglePaths,
        resolveSingleItem: resolveSingleItem
    };

    function togglePaths(items) {
        if (isPathsShowed(items)) {
            hidePaths(items);
        } else {
            var selectedItems = getSelectedItems(items) || items;
            showPaths(selectedItems);
        }
    }

    function hidePaths(items) {
        _.each(items, function(item) {
            item.isPathShowed = false;
        });
    }

    function isPathsShowed(items) {
        return !_.isEmpty(_.where(items, {isPathShowed: true}));
    }

    function showPaths(items) {
        var promises = _.reduce(items, makeUpdateItemPathRequestPromises, []);

        $q.all(promises).then(function() {
            $rootScope.$broadcast('sharedWithMe:pathsReady');
        });

        function makeUpdateItemPathRequestPromises(memo, item) {
            if (_.isUndefined(item.collaborations[0])) {
                return memo;
            }

            var promise = collaborationApi.get({id: item.collaborations[0].id}, function(data) {
                item.isPathShowed = true;
                item.path = item.paths[0] ? item.paths[0] : item.name;
                item.url = data.paths[0];
            }).$promise;

            memo.push(promise);

            return memo;
        }
    }

    function resolveSingleItem(item) {
        var deferred = $q.defer();
        collaborationApi.get({id: item.collaborations[0].id}, function(data) {
            item.path = item.paths[0] ? item.paths[0] : item.name;
            item.url = data.paths[0];
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    function getSelectedItems(items) {
        var selectedItems = _.where(items, {isSelected: true});
        if (_.isEmpty(selectedItems)) {
            selectedItems = null;
        }
        return selectedItems;
    }
}
