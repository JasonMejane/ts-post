// Karma configuration
// Generated on Sun Feb 28 2021 09:23:40 GMT-0500 (heure normale de l’Est)

module.exports = function (config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'karma-typescript'],

		// list of files / patterns to load in the browser
		files: [
            { pattern: 'src/**/*.ts' },
            { pattern: 'test/**/*.spec.ts' }
		],

		// list of files / patterns to exclude
		exclude: [],

		plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-firefox-launcher', 'karma-coverage', 'karma-typescript'],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'src/**/*.ts': ['karma-typescript', 'coverage'],
			'test/**/*.spec.ts': ['karma-typescript'],
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage', 'karma-typescript'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Firefox', 'ChromeHeadless'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		coverageReporter: {
			includeAllSources: true,
			dir: 'coverage/',
			reporters: [{ type: 'html', subdir: 'html' }, { type: 'text-summary' }],
		},
	});
};
