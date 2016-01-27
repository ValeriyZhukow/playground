// TODO Add check for Moment objects

angular.module( 'nccCollaborations.itemsView' )
    .factory( 'datesService', datesService );

function datesService() {

    var timeChoices = [
        { label: 'One Day', count: 1, dimension: 'days' },
        { label: 'One Week', count: 7, dimension: 'days' },
        { label: 'One Month', count: 1, dimension: 'months' }
    ];

    return {
        getExtendDateChoicesForView: getExtendDateChoicesForView,
        getNormalizedItem: getNormalizedItem,
        getExtendDuration: getExtendDuration
    };


    //region getExtendDateChoicesForView
    function getExtendDateChoicesForView( itemExpireDate ) {
        var getExtendedDateItemWithDatePrefilled = _.partial( getExtendedDateItem, itemExpireDate );
        return _.map( timeChoices, getExtendedDateItemWithDatePrefilled );
    }

    function getExtendedDateItem( sourceDate, timeChoice ) {
        var targetDate = getTargetExpireDate( sourceDate, timeChoice.count, timeChoice.dimension );
        return {
            label: buildDateLabelForView( timeChoice.label, targetDate ),
            targetExpireDate: targetDate
        }
    }

    function buildDateLabelForView( label, momentDate ) {
        return '+ ' + label + ' - ' + momentDate.format( 'MMM DD, YYYY, h:mm A' );
    }

    function getTargetExpireDate( sourceDate, count, dimension ) {
        return moment( sourceDate ).add( count, dimension );
    }
    //endregion


    function getNormalizedItem( item ) {

        if ( item.collaborations ) {
            // Item
            return item.collaborations[0];
        } else if ( item.collaboration ) {
            // Request
            return item;
        } else {
            // Collaboration
            return item;
        }

    }


    function getExtendDuration( sourceExpireDate, targetExpireDate ) {
        var _sourceExpireDate = moment( sourceExpireDate );
        var _targetExpireDate = moment.isMoment(targetExpireDate) ?
                                targetExpireDate : moment.unix(targetExpireDate);
        return _targetExpireDate.diff( _sourceExpireDate ) / 1000;
    }
}