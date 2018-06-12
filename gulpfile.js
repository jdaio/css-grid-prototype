/**
 * Gulpfile.
 */

/**
 * CONFIG
 *
 * Customize project in the config.js file.
 */
const config = require('./config.js');

/**
 * PLUGINS
 *
 * Load gulp & required plugins.
 */
const gulp = require('gulp'); // Gulp

/* Plugins > CSS */
const sass = require('gulp-sass'); // Gulp-Sass
const minifycss = require('gulp-uglifycss'); // Minifies CSS.
const autoprefixer = require('gulp-autoprefixer'); // Automatic CSS prefixes.
const mmq = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.

/* Plugins > JS */
const concat = require('gulp-concat'); // Concatenates JS files.
const uglify = require('gulp-uglify'); // Minifies JS files.
const babel = require('gulp-babel'); // Compiles ESNext to browser compatible JS.

/* Plugins > Utilities */
const rename = require('gulp-rename'); // Renames files.
const lineec = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings).
const filter = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
const sourcemaps = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
const notify = require('gulp-notify'); // Sends message notification to you
const browserSync = require('browser-sync')
    .create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
const remember = require('gulp-remember'); //  Adds all the files it has ever seen back into the stream
const plumber = require('gulp-plumber'); // Prevent pipe breaking caused by errors from gulp plugins

/**
 * Task: `browser-sync`.
 *
 * Live Reloads & CSS injections.
 */
function browsersync() {
    browserSync.init({
        // For more options
        // @link http://www.browsersync.io/docs/options/

        server: config.bsServerDirectory,
        ghostMode: config.bsGhostMode,
        logPrefix: config.projectName,
        open: config.bsBrowserAutoOpen,
        notify: config.bsNotify,
        scrollProportionally: config.bsScrollProportionally,
        injectChanges: config.bsInjectChanges,
    });
}

// Helper function to allow browser reload with Gulp 4.
function reload(done) {
    browserSync.reload();
    done();
}

/**
 * Task: `styles`.
 *
 * Compiles, autoprefixes and minifies SCSS.
 *
 * This task does the following:
 *    1. Gets the source SCSS file.
 *    2. Compiles SCSS to CSS.
 *    3. Writes sourcemaps for it.
 *    4. Autoprefixes it and generates style.css.
 *    5. Renames the CSS file with suffix .min.css.
 *    6. Minifies the CSS file and generates style.min.css.
 *    7. Injects CSS or reloads the browser via browserSync.
 */
gulp.task('styles', () => gulp
    .src(config.styleSRC)
    .pipe(sourcemaps.init())
    .pipe(sass({
        errLogToConsole: config.sassErrLogToConsole,
        outputStyle: config.sassOutputStyle,
        precision: config.sassPrecision,
    }))
    .on('error', sass.logError)
    .pipe(sourcemaps.write({ includeContent: false }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(autoprefixer(config.BROWSERS_LIST))
    .pipe(sourcemaps.write('./'))
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.cssBuildDirectory))
    .pipe(filter('**/*.css')) // Filtering stream to only css files
    .pipe(mmq({ log: true })) // Merge Media Queries only for .min.css version.
    .pipe(browserSync.stream()) // Reloads style.css if that is enqueued.
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss({ maxLineLen: 10 }))
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.cssBuildDirectory))
    .pipe(filter('**/*.css')) // Filtering stream to only css files
    .pipe(browserSync.stream()) // Reloads style.min.css if that is enqueued.
    .pipe(notify({
        message: 'TASK: "styles" Completed! 💯',
        onLast: true,
    })));

gulp.task('styles-dist', () => gulp
    .src(config.styleSRC)
    .pipe(sass({
        errLogToConsole: config.sassErrLogToConsole,
        outputStyle: config.sassOutputStyle,
        precision: config.sassPrecision,
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer(config.BROWSERS_LIST))
    .pipe(filter('**/*.css')) // Filtering stream to only css files
    .pipe(mmq({ log: true })) // Merge Media Queries only for .min.css version.
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.cssDistDirectory))
    .pipe(notify({
        message: 'TASK: "styles-dist" Completed! 💯',
        onLast: true,
    })));

/**
 * Task: `vendorsJS`.
 */
gulp.task('vendorsJS', () => gulp
    .src(config.jsVendorSRC)
    .pipe(gulp.dest(config.jsBuildDirectory))
    .pipe(notify({
        message: 'TASK: "vendorsJS" Completed! 💯',
        onLast: true,
    })));

gulp.task('vendorsJS-dist', () => gulp
    .src(config.jsVendorSRC)
    .pipe(gulp.dest(config.jsDistDirectory))
    .pipe(notify({
        message: 'TASK: "vendorsJS-dist" Completed! 💯',
        onLast: true,
    })));

/**
 * Task: `customJS`.
 *
 * Concatenate and uglify custom JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS custom files
 *     2. Concatenates all the files and generates custom.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates custom.min.js
 */
gulp.task('customJS', () => gulp
    .src(config.jsSRC, { since: gulp.lastRun('customJS') }) // Only run on changed files.
    .pipe(plumber({
        errorHandler: (err) => {
            notify.onError('Error: <%= error.message %>')(err);
            this.emit('end'); // End stream if error is found
        },
    }))
    .pipe(babel({
        presets: [
            [
                'airbnb', // Preset which compiles ES6 to ES5.
                {
                    targets: { browsers: config.BROWSERS_LIST }, // Target browser list to support.
                },
            ],
        ],
    }))
    .pipe(remember('customJS')) // Bring all files back to stream
    .pipe(concat(`${config.jsFileName}.js`))
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.jsBuildDirectory))
    .pipe(rename({
        basename: config.jsFileName,
        suffix: '.min',
    }))
    .pipe(uglify())
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.jsBuildDirectory))
    .pipe(notify({
        message: 'TASK: "customJS" Completed! 💯',
        onLast: true,
    })));

gulp.task('customJS-dist', () => gulp
    .src(config.jsSRC, { since: gulp.lastRun('customJS-dist') }) // Only run on changed files.
    .pipe(plumber({
        errorHandler: (err) => {
            notify.onError('Error: <%= error.message %>')(err);
            this.emit('end'); // End stream if error is found
        },
    }))
    .pipe(babel({
        presets: [
            [
                'airbnb', // Preset which compiles ES6 to ES5.
                {
                    targets: { browsers: config.BROWSERS_LIST }, // Target browser list to support.
                },
            ],
        ],
    }))
    .pipe(remember('customJS-dist')) // Bring all files back to stream
    .pipe(concat(`${config.jsFileName}.js`))
    .pipe(rename({
        basename: config.jsFileName,
        suffix: '.min',
    }))
    .pipe(uglify())
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.jsDistDirectory))
    .pipe(notify({
        message: 'TASK: "customJS-dist" Completed! 💯',
        onLast: true,
    })));

/**
 * Task: `HTML`.
 *
 * Watch changes for HTML files and then move them to the build directory.
 */
gulp.task('html', () => gulp
    .src(config.htmlSRC, { since: gulp.lastRun('html') })
    .pipe(plumber({
        errorHandler: (err) => {
            notify.onError('Error: <%= error.message %>')(err);
            this.emit('end'); // End stream if error is found
        },
    }))
    .pipe(remember('html'))
    .pipe(lineec())
    .pipe(gulp.dest(config.buildDirectory))
    .pipe(filter('**/*.html'))
    .pipe(browserSync.stream())
    .pipe(notify({
        message: 'TASK: "html" Completed! 💯',
        onLast: true,
    })));

gulp.task('html-dist', () => gulp
    .src(config.htmlSRC, { since: gulp.lastRun('html-dist') })
    .pipe(plumber({
        errorHandler: (err) => {
            notify.onError('Error: <%= error.message %>')(err);
            this.emit('end'); // End stream if error is found
        },
    }))
    .pipe(remember('html-dist'))
    .pipe(lineec())
    .pipe(gulp.dest(config.distDirectory))
    .pipe(filter('**/*.html'))
    .pipe(notify({
        message: 'TASK: "html-dist" Completed! 💯',
        onLast: true,
    })));

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */
gulp.task(
    'default',
    gulp.parallel(
        'styles',
        'vendorsJS',
        'customJS',
        'html',
        browsersync,
        () => {
            gulp.watch(config.styleWatchFiles, gulp.parallel('styles'));
            gulp.watch(config.jsWatchFiles, gulp.series('customJS', reload));
            gulp.watch(config.htmlWatchFiles, gulp.series('html'));
        },
    ),
);

/**
 * Dist Task.
 *
 * Renders files for distribution.
 */

gulp.task(
    'dist',
    gulp.parallel(
        'styles-dist',
        'vendorsJS-dist',
        'customJS-dist',
        'html-dist',
    ),
);
