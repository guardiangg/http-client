var app = angular.module(
    'app',
    [
        'ngAnimate',
        'ngSanitize',
        'ngStorage',

        'angular.filter',
        'angular-loading-bar',

        'angulartics',
        'angulartics.google.analytics',

        'gettext',

        'highcharts-ng',

        '720kb.datepicker',

        'smoothScroll',
        'toastr',

        'ui.bootstrap',
        'ui.router',
        'ui.select'
    ]
);

app
    .config([
        'toastrConfig',
        '$httpProvider',

        function(toastrConfig, $httpProvider) {
            angular.extend(toastrConfig, {
                progressBar: true,
                tapToDismiss: true,
                timeOut: 2000
            });

            $httpProvider.interceptors.push('bungieInterceptor');
        }
    ])
    .run([
        '$localStorage',
        '$rootScope',
        '$state',
        '$log',
        '$location',
        'consts',
        'gettextCatalog',
        'util',

        function($localStorage, $rootScope, $state, $log, $location, consts, gettextCatalog, util) {
            var locale = $localStorage.locale ? $localStorage.locale : 'en';
            var regex = new RegExp("^\/(" + Object.keys(consts.languages).join('|') + ")\/");
            var match = $location.path().match(regex);

            if (!match) {
                $log.debug('no url locale set, redirecting to: ' + locale);
                $state.go('app.home', { locale: locale });
            } else if (locale !== match[1]) {
                $log.debug('selected locale does not match url, updating url to match...');
                locale = match[1];
            }

            window["gggTips"].locale(locale);
            gettextCatalog.setCurrentLanguage(locale);
            moment.locale(locale);

            $rootScope.locale = locale;
            $rootScope.isMobile = util.isMobile.any();

            $rootScope.$on('$stateChangeSuccess', function() {
                $rootScope.$broadcast('advert-floating.refresh');
                $rootScope.$broadcast('advert.refresh');
            });

            $rootScope.$on('$stateNotFound', function(event, state) {
                $log.error('state not found');
                $log.error(state);
            });

            $rootScope.$on('$stateChangeError', function(event, err) {
                $log.error(err);
            });
        }
    ]);

// load config JSON and manually bootstrap angular
angular.element(document).ready(function() {
    $.getJSON('/app/config.json', function(config) {
        app.service('config', function() {
            return config;
        });

        angular.bootstrap(document, ['app']);
    });
});
