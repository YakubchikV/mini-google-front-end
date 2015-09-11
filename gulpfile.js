'use strict';

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')(),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-minify-css'),
    runSequence = require('run-sequence'),
    concatFilenames = require('gulp-concat-filenames'),
    inject = require('gulp-inject'),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    fileinclude = require('gulp-file-include'),
    watch = require('gulp-watch'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    wiredep = require('wiredep').stream,
    browserSync = require('browser-sync').create();

// paths to resources
var paths = {
    styles: 'app/styles',
    scripts: 'app/scripts',
    images: 'app/images',
    fonts: 'app/fonts',


    //scss: 'build/scss/style.scss',
    sass: 'styles/**/*.scss',
    main: 'build/js/main.js',
    plugins: ['bower_components/modernizr/modernizr.js'],
    php: '**/*.php',
    css: '**/*.css',
    js: '**/*.js',
    scss: '**/*.scss',
    //
    blocksListFile: '_blocks.scss',
    blocksFolder: './app/styles/blocks',
    styleSassFile: './app/styles/styles.scss'
};

// destinations for resources
var dest = {
    app: 'app',
    tmp: '.tmp',
    dist: 'dist'
};

// Clean up dist and temporary
gulp.task('clean', function (cb) {
    return del([
        dest.tmp,
        dest.dist
    ], cb);
});

gulp.task('styles', function () {
    return gulp.src(paths.styles + '/**/*.css')
        .pipe(gulp.dest(dest.tmp + '/styles'))
});

//sass
gulp.task('sass', function () {
    gulp.src(dest.app + '/styles/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', gutil.log.bind(gutil, 'Sass Error'))
        .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.tmp + '/styles'));
});

// blocks list
gulp.task('sass:blocks_list', function () {
    return gulp
        .src([paths.blocksFolder + '/**/*.scss', '!' + paths.blocksFolder + '/**/_*.scss'])
        .pipe(concatFilenames(paths.blocksListFile, {
            root: paths.blocksFolder,
            prepend: '@import "',
            append: '";'
        }))
        .pipe(gulp.dest(paths.blocksFolder));
});

gulp.task('sass:compile', function (cb) {
    return runSequence('sass:blocks_list', 'sass', cb);
});

gulp.task('html', function () {
    return gulp.src(dest.app + '/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(wiredep())
        .pipe(usemin({
            css: [minifyCss(), 'concat']
        }))
        .pipe(gulp.dest(dest.tmp))
});

gulp.task('html:dist', function () {
    return gulp.src(dest.app + '/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(wiredep())
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest(dest.tmp))
});

gulp.task('usemin', function () {
    return gulp.src(dest.tmp + '/*.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('images', function () {
    gulp.src(dest.app + '/images/**/*')
        .pipe(gulp.dest(dest.tmp + '/images'));
});

// compress images
gulp.task('images:dist', function () {
    return gulp.src(dest.app + '/images/**/*.png')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(dest.tmp + '/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return gulp.src(dest.app + '/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest(dest.tmp));
});

gulp.task('fonts:dist', function () {
    return gulp.src(require('main-bower-files')({
        filter: '**/*.{eot,svg,ttf,woff,woff2}'
    }).concat('app/pages/**/fonts/**/*'))
        .pipe(gulp.dest(dest.tmp + '/fonts'))
        .pipe(gulp.dest(dest.dist + '/fonts'));
});

gulp.task('scripts', function () {
   return gulp.src(paths.scripts + '/' + paths.js)
       .pipe(gulp.dest(dest.tmp + '/scripts'));
});

gulp.task('build', function (cb) {
    return runSequence('sass', 'html', ('images', 'fonts'), cb);
});

gulp.task('default', ['watch']);

gulp.task('watch', ['html', 'sass:compile', 'scripts', 'images', 'fonts'], function (cb) {
    browserSync.init({
        server: {
            baseDir: "./.tmp"
        }
    });

    // Static files
    watch(['app/*.html', 'app/**/*.html'], function (events) {
        return runSequence('html', browserSync.reload);
    });

    // JS
    watch(paths.scripts + '/' + paths.js, function (events) {
        return runSequence('scripts', browserSync.reload);
    });

    // Images
    watch(paths.images + '/**/*', function (events) {
        return runSequence('images', browserSync.reload);
    });

    // Fonts
    watch(paths.fonts + '/**/*', function (events) {
        return runSequence('fonts', browserSync.reload);
    });

    // Generate blocks list
    watch([paths.blocksFolder + '/**/*.scss', '!' + paths.blocksFolder + '/**/_*.scss'], function (events) {
        if ('add' === events.event || 'unlink' === events.event) {
            return gulp.start('sass:compile');
        }
    });

    // Sass recompile
    watch([paths.styles + '/' + paths.scss, '!' + paths.blocksFolder + '/' + paths.blocksListFile], function (events) {
        if ('change' === events.event) {
            return gulp.start('sass');
        }
    });
});
