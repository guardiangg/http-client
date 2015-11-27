var app = angular.module('app');

app.service('bungie', [
    '$http',
    'gettextCatalog',
    'util',

    function ($http, gettextCatalog, util) {
        return new function () {
            var BASE_URL = '//proxy.guardian.gg/Platform/Destiny';
            var ENDPOINTS = {
                account: '/{platform}/Account/{membershipId}/Summary/',
                inventory: '/{platform}/Account/{membershipId}/Character/{characterId}/Inventory/?definitions=true&lc={locale}',
                activityHistory: '/Stats/ActivityHistory/{platform}/{membershipId}/{characterId}/?mode={mode}&definitions=true&count=25&page={page}&lc={locale}',
                searchForPlayer: '/SearchDestinyPlayer/{platform}/{name}/',
                pgcr: '/Stats/PostGameCarnageReport/{instanceId}/'
            };

            this.getPgcr = function(instanceId) {
                return this.get(ENDPOINTS.pgcr, {
                    instanceId: instanceId
                });
            };

            this.searchForPlayer = function(platform, name) {
                return this.get(ENDPOINTS.searchForPlayer, {
                    platform: platform,
                    name: name
                });
            };

            this.getAccount = function(platform, membershipId) {
                return this.get(ENDPOINTS.account, {
                    platform: platform,
                    membershipId: membershipId
                });
            };

            this.getInventory = function(platform, membershipId, characterId) {
                return this.get(ENDPOINTS.inventory, {
                    platform: platform,
                    membershipId: membershipId,
                    characterId: characterId,
                    locale: gettextCatalog.getCurrentLanguage()
                });
            };

            this.getActivityHistory = function(platform, membershipId, characterId, mode, page) {
                return this.get(ENDPOINTS.activityHistory, {
                    platform: platform,
                    membershipId: membershipId,
                    characterId: characterId,
                    mode: mode,
                    page: page,
                    locale: gettextCatalog.getCurrentLanguage()
                });
            };

            this.get = function(endpoint, tokens) {
                return $http.get(BASE_URL + util.buildUrl(endpoint, tokens));
            };
        };
    }
]);
