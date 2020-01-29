/**
 * Project / Gulp Configuration.
 *
 * In paths you can add <<glob or array of globs>>. Edit the variables as per
 * your project requirements.
 */

const sourceDirectoryName = 'src';
const buildDirectoryName = 'build';
const distDirectoryName = 'docs';

module.exports = {
    projectName: 'CSS Grid Prototype',

    // BrowserSync Settings
    bsServerDirectory: buildDirectoryName, // Directory to watch for syncing.
    bsBrowserAutoOpen: false, // Automatically open browser on start.
    bsGhostMode: false, // Mirror actions on one device to all others.
    bsNotify: false, // Show pop-over notifications from BrowserSync.
    bsScrollProportionally: false, // Sync viewports to TOP position.
    bsInjectChanges: true, // Inject changes instead of reloading.

    // Set Build & Dist Directories
    buildDirectory: `./${buildDirectoryName}/`,
    cssBuildDirectory: `./${buildDirectoryName}/assets/css/`,
    jsBuildDirectory: `./${buildDirectoryName}/assets/js/`,
    distDirectory: `./${distDirectoryName}/`,
    cssDistDirectory: `./${distDirectoryName}/assets/css/`,
    jsDistDirectory: `./${distDirectoryName}/assets/js/`,

    // Style/SCSS Options
    styleSRC: `./${sourceDirectoryName}/assets/css/main.scss`, // Path to main .scss file.
    sassOutputStyle: 'compressed', // Available options → 'compact' or 'compressed' or 'nested' or 'expanded'
    sassErrLogToConsole: true,
    sassPrecision: 10,

    // Autoprefixer Options
    // Browserlist: https://github.com/ai/browserslist
    BROWSERS_LIST: [
        'last 2 version',
        '> .25%',
        'ie >= 10',
    ],

    // JS - Project Options
    jsSRC: `./${sourceDirectoryName}/assets/js/*.js`, // Path to JS custom scripts folder.
    jsFileName: 'main', // Compiled JS custom file name.

    // HTML File Options
    htmlSRC: `./${sourceDirectoryName}/**/*.html`, // Path to all HTML files.

    // Watch files paths.
    styleWatchFiles: `./${sourceDirectoryName}/assets/css/**/*.scss`, // Path to all *.scss files.
    jsWatchFiles: `./${sourceDirectoryName}/assets/js/**/*.js`, // Path to all JS files.
    htmlWatchFiles: `./${sourceDirectoryName}/**/*.html`, // Path to all HTML files.
};
