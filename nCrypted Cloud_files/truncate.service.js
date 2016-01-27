angular.module('nccTruncate')
    .factory('nccTruncateService', nccTruncateService);

function nccTruncateService(DIVIDER) {

    function truncateStringWithDivider(string, containerLengthInChars, divider) {
        var containerHalfLength = Math.floor(containerLengthInChars / 2) - Math.floor(divider.length / 2);
        var stringHead = string.slice(0, containerHalfLength);
        var stringTail = string.slice(containerHalfLength);
        return stringHead.slice(0, containerHalfLength).trim() + divider + stringTail.slice(-containerHalfLength).trim();
    }

    function getContainerLengthInChars(container, stringLength) {
        var proportion = (container.clientWidth / container.scrollWidth).toFixed(2);
        // Magic number here - some little shift so string don't get clipped a little.
        return Math.floor(stringLength * proportion) - 1;
    }

    function truncateStringToElement(string, element) {
        return truncateStringWithDivider(string, getContainerLengthInChars(element, string.length), DIVIDER);
    }

    function isOverflowed(element) {
        return element.scrollWidth > element.clientWidth;
    }

    return {
        truncateStringToElement: truncateStringToElement,
        isOverflowed: isOverflowed
    }
}

