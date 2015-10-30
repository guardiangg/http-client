var series          = require('stream-series'),
    gulp            = require('gulp'),
    async           = require('async'),
    concat          = require('gulp-concat'),
    gettext         = require('gulp-angular-gettext'),
    jeditor         = require('gulp-json-editor'),
    inject          = require('gulp-inject'),
    less            = require('gulp-less'),
    minifyCSS       = require('gulp-minify-css'),
    minifyHTML      = require('gulp-minify-html'),
    rename          = require('gulp-rename'),
    rev             = require('gulp-rev'),
    watch           = require('gulp-watch'),
    uglify          = require('gulp-uglify'),
    util            = require('gulp-util'),

    // ggg deps
    gggDownload = require('./gulp/download.js');

var isProd = !!util.env.prod;

var cssFiles = [
    './src/asset/less/guardian.less'
];

var jsFiles = {
    site: [
        'config.js',
        'app.js',
        'routes.js',
        'shared/**/*.js',
        'component/**/*.js'
    ],
    vendor: [
        'underscore/underscore.js',
        'jquery/dist/jquery.js',
        'bootstrap/dist/js/bootstrap.min.js',
        'angular/angular.js',
        'angular-animate/angular-animate.js',
        'angular-cookies/angular-cookies.js',
        'angular-filter/dist/angular-filter.js',
        'angular-loading-bar/src/loading-bar.js',
        'angular-gettext/dist/angular-gettext.js',
        'angular-smooth-scroll/angular-smooth-scroll.js',
        'angular-toastr/dist/angular-toastr.js',
        'angular-toastr/dist/angular-toastr.tpls.js',
        'angular-sanitize/angular-sanitize.js',
        'angular-ui-router/release/angular-ui-router.js',
        'angular-ui-select/dist/select.js',
        'angularjs-datepicker/src/js/angular-datepicker.js',
        'angular-tooltips/dist/angular-tooltips.min.js',
        'highcharts-release/highcharts.src.js',
        'highcharts-release/themes/grid-light.js',
        'highcharts-ng/dist/highcharts-ng.js',
        'moment/moment.js',
        'moment/locale/fr.js',
        'moment/locale/es.js',
        'moment/locale/de.js',
        'moment/locale/it.js',
        'moment/locale/ja.js',
        'moment/locale/pt-br.js'
    ]
};

var viewFiles = ['./src/view/**/*.html'];

var cssCallback = function() {
    var stream = gulp
        .src(cssFiles)
        .pipe(less());

    if (isProd) {
        stream = stream
            .pipe(rev())
            .pipe(minifyCSS());
    }

    return stream.pipe(gulp.dest('./build/asset/css'));
};

var jsCallback = function() {
    var stream = gulp.src(jsFiles.site, { cwd: './src/app/' });

    if (isProd) {
        stream = stream
            .pipe(concat('app.js'))
            .pipe(rev())
            .pipe(uglify());
    }

    return stream.pipe(gulp.dest('./build/app'));
};

var jsVendorCallback = function() {
    var stream = gulp
        .src(jsFiles.vendor, { cwd: './bower_components' });

    if (isProd) {
        stream = stream
            .pipe(concat('vendor.js'))
            .pipe(rev())
            .pipe(uglify());
    }

    return stream.pipe(gulp.dest('./build/asset/js'));
};

gulp.task('build', ['config', 'robots', 'image', 'font', 'translate', 'view', 'css', 'jsVendor', 'js', 'index']);

gulp.task('watch', function() {
    gulp.watch(['./src/asset/less/**/*.less'], ['css']);
    gulp.watch(['./src/app/**/*.js'], ['js']);
    gulp.watch(['./src/po/*.po'], ['translate']);
    gulp.watch(viewFiles, ['view']);
});

gulp.task('config', function() {
    var stream = gulp.src('./src/app/config.json');

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

gulp.task('index', function() {
    var stream = gulp
        .src('./src/index.html')
        .pipe(inject(cssCallback(), {ignorePath: '/build', removeTags: true, name: 'app'}))
        .pipe(inject(jsVendorCallback(), {ignorePath: '/build', removeTags: true, name: 'vendor'}))
        .pipe(inject(jsCallback(), {ignorePath: '/build', removeTags: true, name:'app'}));

    //if (isProd) {
        stream = stream.pipe(minifyHTML());
    //}

    return stream.pipe(gulp.dest('./build'))
});

gulp.task('jsVendor', jsVendorCallback);

gulp.task('js', jsCallback);

gulp.task('css', cssCallback);

gulp.task('image', function() {
    return gulp.src('./src/asset/image/*').pipe(gulp.dest('./build/asset/image'));
});

gulp.task('font', function() {
    return gulp.src('./src/asset/font/*').pipe(gulp.dest('./build/asset/font'));
});

gulp.task('robots', function() {
    return gulp.src('./robots.txt').pipe(gulp.dest('./build'));
});

gulp.task('view', function() {
    var stream = gulp.src(viewFiles);

    //if (isProd) {
        stream = stream.pipe(minifyHTML());
    //}

    return stream.pipe(gulp.dest('./build/app/view'));
});

gulp.task('pot', function () {
    return gulp.src(['src/index.html', 'src/view/**/*.html', 'src/app/**/*.js'])
        .pipe(gettext.extract('template.pot', {
            // options to pass to angular-gettext-tools...
        }))
        .pipe(gulp.dest('src/po'));
});

gulp.task('translate', function () {
    return gulp
        .src('src/po/**/*.po')
        .pipe(gettext.compile({
            format: 'json'
        }))
        .pipe(gulp.dest('build/language/'));
});

gulp.task('download', function() {
    gggDownload('en');
    gggDownload('de');
    gggDownload('fr');
    gggDownload('es');
    gggDownload('it');
    gggDownload('ja');
    gggDownload('pt-br');
});