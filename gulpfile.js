// Notes for development on your local instance
// ---
// The project root directory name must be the hostname of
// our local instance (e.g. 'wpskeleton.dev')

// Editable Options
// ---
//
// 1. The directory of our WordPress theme

let wpTheme  = 'scfernz', // 1

    devURL = require('path').basename(__dirname),
    themeDir = 'wp-content/themes/' + wpTheme + '/',

    srcPath = {
        'css': themeDir + 'src/sass/**/*.scss',
        'cssMain': themeDir + 'src/sass/main.scss',
        'js': themeDir + 'src/js/**/*.js',
        'jsMain': themeDir + 'src/js/*.js'
    },

    destPath = {
        'css': themeDir + 'dist',
        'js': themeDir + 'dist'
    };

// Load plugins
let gulp     = require('gulp'),
    plugins  = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'browser*']
    });

// Our default task rebuilds all, then watches
gulp.task('default', ['build-css', 'jshint', 'build-js', 'watch']);

/** BUILD CSS ***/
gulp.task('build-css', function() {
    return gulp.src(srcPath.cssMain)
    .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({ outputStyle: 'compressed' })
        .on('error', plugins.sass.logError)
        .on('error', handleErrors))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.sourcemaps.write('/'))
    .pipe(gulp.dest(destPath.css))
    .pipe(plugins.browserSync.stream({match: '**/*.css'}));
});

/** BUILD JS ***/
gulp.task('jshint', function() {
    return gulp.src(srcPath.jsMain)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('build-js', function() {
    return gulp.src(srcPath.js)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('site.js'))
    .pipe(plugins.uglify())
        .on('error', handleErrors)
    .pipe(plugins.sourcemaps.write('/'))
    .pipe(gulp.dest(destPath.js))
    .pipe(plugins.browserSync.stream());
});

/** WATCH TO RECOMPILE FILES ***/
gulp.task('watch', function() {

    plugins.browserSync.init({
        proxy: 'http://' + devURL,
        host: devURL,
        open: 'external'
    });

    gulp.watch(srcPath.js, ['jshint', 'build-js']);
    gulp.watch(srcPath.css, ['build-css']);
});

/** TASK ERROR HANDLER ***/
var handleErrors = function () {
    // Send error to notification center with gulp-notify
    plugins.notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>",
        timeout: 3
    }).apply(this, arguments);

    // Keep gulp from hanging on this task
    this.emit('end');
};