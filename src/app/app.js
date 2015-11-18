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
        '720kb.tooltips',

        'smoothScroll',
        'toastr',

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
        'gettextCatalog',

        function($localStorage, $rootScope, $state, $log, $location, gettextCatalog) {
            var locale = $localStorage.locale ? $localStorage.locale : 'en';
            var match = $location.path().match(/^\/(en|fr|it|es|de|pt-br|ja)\//);

            if (!match) {
                $log.debug('no url locale set, redirecting to: ' + locale);
                $state.go('app.home', { locale: locale });
            } else if (locale !== match[1]) {
                $log.debug('selected locale does not match url, updating url to match...');
                $state.go($state.current.name ? $state.current.name : 'app.home', { locale: locale });
            }

            gettextCatalog.setCurrentLanguage(locale);
            moment.locale(locale);

            $rootScope.$on('$stateNotFound', function(event, state) {
                $log.error('state not found');
                $log.error(state);
            });

            $rootScope.$on('$stateChangeError', function(event, err) {
                $log.error(err);
            });

            $rootScope.$on('$stateChangeStart', function(event, toState) {
                $rootScope.apiError = false;

                if (toState.title) {
                    $rootScope.title = gettextCatalog.getString(toState.title) + ' - Guardian.gg';
                } else {
                    $rootScope.title = gettextCatalog.getString(
                        'Guardian.gg: Advanced Destiny Stats, Profiles and Leaderboards'
                    );
                }
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
