var gulp       = require('gulp'),
    templates  = require('gulp-angular-templatecache'),
    async      = require('async'),
    concat     = require('gulp-concat'),
    gettext    = require('gulp-angular-gettext'),
    jeditor    = require('gulp-json-editor'),
    inject     = require('gulp-inject'),
    less       = require('gulp-less'),
    merge      = require('merge-stream'),
    minifyCSS  = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    rename     = require('gulp-rename'),
    rev        = require('gulp-rev'),
    template   = require('gulp-template-compile'),
    watch      = require('gulp-watch'),
    uglify     = require('gulp-uglify'),
    util       = require('gulp-util');

var isProd = !!util.env.prod;

var jsFiles = {
    site: [
        'i18n/*.js',
        'app/app.js',
        'app/templates.js',
        'app/routes.js',
        'app/shared/**/*.js',
        'app/component/**/*.js'
    ],
    tooltip: [
        'node_modules/opentip/lib/opentip.js',
        'node_modules/opentip/lib/adapter-native.js',
        'node_modules/underscore/underscore.js',
        'src/tooltip/tooltip.js'
    ],
    vendor: [
        'underscore/underscore.js',
        'jquery/dist/jquery.js',

        'bootstrap/dist/js/bootstrap.min.js',
        'angular/angular.js',
        'angular-animate/angular-animate.js',
        'angular-filter/dist/angular-filter.js',
        'angular-loading-bar/src/loading-bar.js',
        'angular-gettext/dist/angular-gettext.js',
        'ng-smooth-scroll/dist/angular-smooth-scroll.min.js',
        'angular-toastr/dist/angular-toastr.js',
        'angular-toastr/dist/angular-toastr.tpls.js',
        'angular-sanitize/angular-sanitize.js',
        'angular-ui-router/release/angular-ui-router.js',
        'ui-select/dist/select.js',
        'angularjs-datepicker/src/js/angular-datepicker.js',
        'angulartics/dist/angulartics.min.js',
        'angulartics-google-analytics/dist/angulartics-google-analytics.min.js',

        'jquery.kinetic/jquery.kinetic.js',

        'ngstorage/ngStorage.js',

        'highcharts-release/highcharts.src.js',
        'highcharts-release/themes/grid-light.js',
        'highcharts-ng/dist/highcharts-ng.js',

        'moment/moment.js',
        'moment-duration-format/lib/moment-duration-format.js',
        'moment/locale/fr.js',
        'moment/locale/es.js',
        'moment/locale/de.js',
        'moment/locale/it.js',
        'moment/locale/ja.js',
        'moment/locale/pt-br.js',

        '../src/vendor/ui-bootstrap-custom-0.14.3.js',
        '../src/vendor/ui-bootstrap-custom-tpls-0.14.3.js'
    ]
};

var templateFiles = ['./src/app/**/*.html'];

var cssCallback = function() {
    var stream = gulp
        .src('./src/asset/less/guardian.less')
        .pipe(less());

    if (isProd) {
        stream = stream
            .pipe(rev())
            .pipe(minifyCSS());
    }

    return stream.pipe(gulp.dest('./build/asset/css'));
};

var cssTooltipCallback = function() {
    var stream = gulp
        .src('./src/tooltip/less/tooltip.less')
        .pipe(less());

    if (isProd) {
        stream = stream
            .pipe(minifyCSS());
    }

    return stream.pipe(gulp.dest('./build/asset/css'));
};

var jsCallback = function() {
    var stream = gulp.src(jsFiles.site, { cwd: './src/' });

    if (isProd) {
        stream = stream
            .pipe(concat('app.js'))
            .pipe(rev())
            .pipe(uglify());
    }

    return stream.pipe(gulp.dest('./build/app'));
};

var jsTooltipCallback = function() {
    var stream = gulp.src(jsFiles.tooltip);
    var tStream = gulp.src('src/tooltip/item.html').pipe(template()).pipe(concat('template.js'));

    stream = merge(stream, tStream);

    if (isProd) {
        stream = stream
            .pipe(concat('tooltip.js'))
            .pipe(uglify());
    }

    return stream.pipe(gulp.dest('./build/asset/js'));
};

var jsVendorCallback = function() {
    var stream = gulp.src(jsFiles.vendor, { cwd: './node_modules' });

    if (isProd) {
        stream = stream
            .pipe(concat('vendor.js'))
            .pipe(rev())
            .pipe(uglify());
    }

    return stream.pipe(gulp.dest('./build/asset/js'));
};

gulp.task('build', ['tooltip', 'config', 'robots', 'image', 'font', 'index']);

gulp.task('watch', ['build'], function() {
    gulp.watch(['./src/index.html'], ['index']);
    gulp.watch(['./src/asset/less/**/*.less'], ['css']);
    gulp.watch(['./src/app/**/*.js'], ['js']);
    gulp.watch(['./src/tooltip/**/*.js'], ['jsTooltip']);
    gulp.watch(['./src/po/*.po'], ['translate']);
    gulp.watch(['src/index.html', 'src/app/**/*.html', 'src/app/**/*.js'], ['pot']);
    gulp.watch(['src/tooltip/**/*.html'], ['tooltip']);
    gulp.watch(['src/tooltip/less/tooltip.less'], ['cssTooltip']);
    gulp.watch(templateFiles, ['templates']);
});

gulp.task('templates', function() {
    return gulp
        .src(templateFiles)
        .pipe(templates({
            module: 'app',
            standalone: false
        }))
        .pipe(gulp.dest('./src/app'))
});

gulp.task('config', function() {
    var stream = gulp.src('./src/app/config.json.dist');

    stream = stream
       .pipe(jeditor(function(json) {
           json.deployTime = +new Date();

           return json;
       }));

    if (isProd) {
        stream = stream
            .pipe(jeditor(function(json) {
                json.api = '//api.guardian.gg';
                json.deployTime = +new Date();

                return json;
            }));
    }

    return stream
        .pipe(rename('config.json'))
        .pipe(gulp.dest('./build/app'));
});

gulp.task('index', ['js', 'jsVendor', 'css', 'translate'], function() {
    var stream = gulp
        .src('./src/index.html')
        .pipe(inject(cssCallback(), {ignorePath: '/build', removeTags: true, name: 'app'}))
        .pipe(inject(jsVendorCallback(), {ignorePath: '/build', removeTags: true, name: 'vendor'}))
        .pipe(inject(jsCallback(), {ignorePath: '/build', removeTags: true, name:'app'}))
        .pipe(inject(jsTooltipCallback(), {ignorePath: '/build', removeTags: true, name: 'tooltip'}));

    if (isProd) {
        stream = stream.pipe(minifyHTML());
    }

    return stream.pipe(gulp.dest('./build'))
});

gulp.task('tooltip', ['cssTooltip', 'jsTooltip'], function() {
    var stream = gulp
        .src('./src/tooltip/test.html')
        .pipe(inject(cssTooltipCallback(), {ignorePath: '/build', removeTags: true, name: 'tooltip'}))
        .pipe(inject(jsTooltipCallback(), {ignorePath: '/build', removeTags: true, name: 'tooltip'}));

    if (isProd) {
        stream = stream.pipe(minifyHTML());
    }

    return stream.pipe(gulp.dest('./build'))
});

gulp.task('jsTooltip', jsTooltipCallback);

gulp.task('jsVendor', jsVendorCallback);

gulp.task('js', ['templates'], jsCallback);

gulp.task('css', cssCallback);

gulp.task('cssTooltip', cssTooltipCallback);

gulp.task('image', function() {
    return gulp.src('./src/asset/image/**/*').pipe(gulp.dest('./build/asset/image'));
});

gulp.task('font', function() {
    return gulp.src('./src/asset/font/**/*').pipe(gulp.dest('./build/asset/font'));
});

gulp.task('robots', function() {
    return gulp.src('./robots.txt').pipe(gulp.dest('./build'));
});

gulp.task('pot', function () {
    return gulp
        .src(['src/index.html', 'src/app/**/*.html', 'src/app/**/*.js'])
        .pipe(gettext.extract('template.pot', {
            // options to pass to angular-gettext-tools...
        }))
        .pipe(gulp.dest('src/po'));
});

gulp.task('translate', function () {
    return gulp
        .src('src/po/**/*.po')
        .pipe(gettext.compile())
        .pipe(gulp.dest('src/i18n/'));
});

gulp.task('default', ['build']);