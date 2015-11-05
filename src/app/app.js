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
            // track state changes and update locale accordingly
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                if (toState.title) {
                    $rootScope.title = gettextCatalog.getString(toState.title) + ' - Guardian.gg';
                } else {
                    $rootScope.title = gettextCatalog.getString(
                        'Guardian.gg: Advanced Destiny Stats, Profiles and Leaderboards'
                    );
                }

                if (fromParams.locale == toParams.locale) {
                    return;
                }

                // translations are by default in English
                if (toParams.locale != 'en') {
                    gettextCatalog.loadRemote('/language/' + toParams.locale + '.json');
                }

                gettextCatalog.setCurrentLanguage(toParams.locale);
                $localStorage.locale = toParams.locale;
                moment.locale(toParams.locale);
            });

            if (!$location.path().match(/^\/\w{2}\//)) {
                var locale = $localStorage.locale ? $localStorage.locale : 'en';

                $log.debug('no url locale set, redirecting to: ' + locale);
                $state.go('app.home', { locale: locale });
            }
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
