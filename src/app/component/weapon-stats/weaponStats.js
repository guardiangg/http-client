(function() {
    var WeaponStats = function($q, $http, $location, util, gettextCatalog) {
        var getTopWeapons = function() {
            var search = $location.search();

            return $http.get(
                util.buildApiUrl(
                    'weapon/top?mode={mode}&platform={platform}&start={start}&end={end}&activity={activity}&lc={lc}',
                    {
                        lc: gettextCatalog.getCurrentLanguage(),
                        mode: search.mode ? search.mode : 10,
                        platform: search.platform ? search.platform : 2,
                        start: search.start ? search.start : '1970-01-01',
                        end: search.end ? search.end : '2099-01-01',
                        activity: search.activity ? search.activity : 0
                    }
                )
            );
        };

        var getTopWeaponTypes = function() {
            var search = $location.search();

            return $http.get(
                util.buildApiUrl(
                    'weapon/type/top?mode={mode}&platform={platform}&start={start}&end={end}&activity={activity}&lc={lc}',
                    {
                        lc: gettextCatalog.getCurrentLanguage(),
                        mode: search.mode ? search.mode : 10,
                        platform: search.platform ? search.platform : 2,
                        start: search.start ? search.start : '1970-01-01',
                        end: search.end ? search.end : '2099-01-01',
                        activity: search.activity ? search.activity : 0
                    }
                )
            );
        };

        this.getActivities = function() {
            var search = $location.search();

            return $http.get(
                util.buildApiUrl(
                    'weapon/activities?mode={mode}&platform={platform}&start={start}&end={end}&activity={activity}&lc={lc}',
                    {
                        lc: gettextCatalog.getCurrentLanguage(),
                        mode: search.mode ? search.mode : 10,
                        platform: search.platform ? search.platform : 2,
                        start: search.start ? search.start : '1970-01-01',
                        end: search.end ? search.end : '2099-01-01',
                        activity: search.activity ? search.activity : 0
                    }
                )
            );
        };

        this.loadWeapons = function() {
            var d = $q.defer();
            var weapons;

            getTopWeapons()
                .then(function(result) {
                    weapons = result.data;

                    d.notify(50);

                    return getTopWeaponTypes();
                }, d.reject)
                .then(function(result) {
                    d.notify(50);

                    d.resolve({
                        weapons: weapons,
                        weaponTypes: result.data
                    });
                }, d.reject);

            return d.promise;
        };
    };

    angular.module('app').service('weaponStats', [
        '$q',
        '$http',
        '$location',
        'util',
        'gettextCatalog',

        function ($q, $http, $location, util, gettextCatalog) {
            return new WeaponStats($q, $http, $location, util, gettextCatalog);
        }
    ]);
})();