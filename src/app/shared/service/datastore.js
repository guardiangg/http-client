app.factory('datastore', ['$location', function($location) {
    return {
        mapping: {
            1: 'start',
            2: 'end',
            3: 'platform',
            4: 'mode',
            5: 'activity'
        },

        mappingInverse: {
            'start': 1,
            'end': 2,
            'platform': 3,
            'mode': 4,
            'activity': 5
        },

        setParams: function(params) {
            if (params.length == 0) {
                return;
            }

            var data = [];
            for (var k in params) {
                var value = params[k];

                if (!this.mappingInverse[k] || value === false || value == null) {
                    continue;
                }

                data.push(this.mappingInverse[k] + ':' + value);
            }

            $location.path('filter/' + data.join(';'));
        },

        getParamsFromHash: function() {
            var hash = $location.path().replace('filter/', '');

            while (hash.charAt(0) == '#' || hash.charAt(0) == '/') {
                hash = hash.substring(1);
            }

            var options = hash.split(';');
            if (options.length == 0) {
                return [];
            }

            var params = {};
            for (var i in options) {
                var segments = options[i].split(':');
                if (segments.length != 2) {
                    continue;
                }

                params[this.mapping[parseInt(segments[0])]] = segments[1];
            }

            return params;
        },

        getQueryString: function() {
            if (!$location.path()) {
                return '';
            }

            var queryParts = [];
            var params = this.getParamsFromHash();

            for (var i in params) {
                var value = params[i];

                queryParts.push(i + '=' + value);
            }

            if (queryParts.length == 0) {
                return '';
            }

            return '?' + queryParts.join('&');
        }
    }
}]);
