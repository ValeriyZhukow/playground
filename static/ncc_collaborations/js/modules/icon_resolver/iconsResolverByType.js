angular.module('nccCollaborations.iconResolver', [])
    .factory('IconResolver', function () {
        var basicFolderClass = 'ncc-file-type-folder',
            basicFileClass = 'ncc-file-type-file';

        var icons = {
            'application/msword': 'ncc-file-type-word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'ncc-file-type-word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'ncc-file-type-word',

            'text/plain': 'ncc-file-type-txt',

            'application/postscript': 'ncc-file-type-ai',

            'application/vnd.ms-excel': 'ncc-file-type-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'ncc-file-type-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'ncc-file-type-excel',

            'application/vnd.ms-powerpoint': 'ncc-file-type-ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ncc-file-type-ppt',

            'image/vnd.adobe.photoshop': 'ncc-file-type-photoshop',
            'image/photoshop': 'ncc-file-type-photoshop',
            'image/x-photoshop': 'ncc-file-type-photoshop',

            'application/pdf': 'ncc-file-type-pdf',

            'video/avi': 'ncc-file-type-video',
            'video/quicktime': 'ncc-file-type-video',
            'video/wmv': 'ncc-file-type-video',
            'video/mpeg': 'ncc-file-type-video',
            'video/mp4': 'ncc-file-type-video',

            'image/jpeg': 'ncc-file-type-image',
            'image/jpg': 'ncc-file-type-image',
            'image/png': 'ncc-file-type-image',
            'image/tiff': 'ncc-file-type-image',
            'image/gif': 'ncc-file-type-image',

            'image/x-ms-bmp': 'ncc-file-type-image',
            'image/bmp': 'ncc-file-type-image',
            'image/x-bmp': 'ncc-file-type-image',
            'image/x-bitmap': 'ncc-file-type-image',
            'image/x-xbitmap': 'ncc-file-type-image',
            'image/x-win-bitmap': 'ncc-file-type-image',
            'image/x-windows-bmp': 'ncc-file-type-image',
            'image/ms-bmp': 'ncc-file-type-image',
            'image/x-ms-bmp': 'ncc-file-type-image',
            'application/bmp': 'ncc-file-type-image',
            'application/x-bmp': 'ncc-file-type-image',
            'application/x-win-bitmap': 'ncc-file-type-image',

            'application/exe': 'ncc-file-type-exe',
            'application/x-msdownload': 'ncc-file-type-exe',

            'audio/mpeg': 'ncc-file-type-sound',
            'audio/vnd.wav': 'ncc-file-type-sound',

            'application/x-compressed': 'ncc-file-type-compressed',
            'application/zip': 'ncc-file-type-compressed',
            'application/x-rar-compressed': 'ncc-file-type-compressed',

            'application/javascript': 'ncc-file-type-code'
        };

        return {
            getIconClass: function (item) {
                var iconClass;
                if (item.is_folder) {
                    return basicFolderClass
                }
                iconClass = icons[item.mimetype];
                return iconClass ? iconClass : basicFileClass;
            }
        };
    });