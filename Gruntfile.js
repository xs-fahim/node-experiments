const webpackConfig = require('./webpack.config.js');
const gruntScriptVersion = '1.0.0';

module.exports = function(grunt) {
  'use strict';

	const projectConfig = {
		name: 'getgenie', 				// should be the text domain of the project (todo: spilt it)
		srcDir: './', 						// the source directory of the plugin
		distDir: '../dist/getgenie/',		// where to save the built files
	};

	// Grunt task begins
	grunt.initConfig( {

		// Compile app.js files from src to dest
		webpack: {
            myConfig: webpackConfig,
        },

		// i18n
		addtextdomain: {
			options: {
				// textdomain: 'foobar',
				updateDomains: true, // List of text domains to replace.
			},
			target: {
				src: [
					projectConfig.srcDir + '*.php',
					projectConfig.srcDir + '**/*.php',
					'!' + projectConfig.srcDir + 'node_modules/**',
					'!' + projectConfig.srcDir + 'dev-*/**',
				],
			},
		},

		checktextdomain: {
			standard: {
				options: {
					text_domain: projectConfig.name, //Specify allowed domain(s)
					// correct_domain: true, // don't use it, it has bugs
					keywords: [ //List keyword specifications
						'__:1,2d',
						'_e:1,2d',
						'_x:1,2c,3d',
						'esc_html__:1,2d',
						'esc_html_e:1,2d',
						'esc_html_x:1,2c,3d',
						'esc_attr__:1,2d',
						'esc_attr_e:1,2d',
						'esc_attr_x:1,2c,3d',
						'_ex:1,2c,3d',
						'_n:1,2,4d',
						'_nx:1,2,4c,5d',
						'_n_noop:1,2,3d',
						'_nx_noop:1,2,3c,4d',
					],
				},
				files: [ {
					src: [
						projectConfig.srcDir + '**/*.php',
						'!' + projectConfig.srcDir + 'node_modules/**',
					], //all php
					expand: true,
				} ],
			},
		},

		makepot: {
			target: {
				options: {
					cwd: projectConfig.srcDir, // Directory of files to internationalize.
					mainFile: '', // Main project file.
					type: 'wp-plugin', // Type of project (wp-plugin or wp-theme).
					updateTimestamp: false, // Whether the POT-Creation-Date should be updated without other changes.
					updatePoFiles: false, // Whether to update PO files in the same directory as the POT file.
					domainPath: '/languages', // The directory where the POT file should be saved. Defaults to the value from the "Domain Path" header if it exists.
				},
			},
		},

		// Deleting previous build files & .zip
		clean: {
			options: { force: true },
			dist: [
				projectConfig.distDir + '/**',
				projectConfig.distDir.replace( /\/$/, '' ) + '.zip',
			],
		},

		// Copying project files to ../dist/ directory
		copy: {
			dist: {
				files: [ {
					expand: true,
					src: [
						'' + projectConfig.srcDir + '**',
						'!' + projectConfig.srcDir + 'Gruntfile.js',
						'!' + projectConfig.srcDir + 'package.json',
						'!' + projectConfig.srcDir + 'package-lock.json',
						'!' + projectConfig.srcDir + 'node_modules/**',
						'!' + projectConfig.srcDir + '**/dev-*/**',
						'!' + projectConfig.srcDir + '**/*-test/**',
						'!' + projectConfig.srcDir + '**/*-beta/**',
						'!' + projectConfig.srcDir + '**/scss/**',
						'!' + projectConfig.srcDir + '**/sass/**',
						'!' + projectConfig.srcDir + '**/src/**',
						'!' + projectConfig.srcDir + '**/.*',
						'!' + projectConfig.srcDir + '**/*.config',
						'!' + projectConfig.srcDir + 'build-package/**',
						'!' + projectConfig.srcDir + 'none',
						'!' + projectConfig.srcDir + 'Built',
						'!' + projectConfig.srcDir + 'Installable',
						'!' + projectConfig.srcDir + 'webpack.config.js',
						'!' + projectConfig.srcDir + 'README.md',
						'!' + projectConfig.srcDir + 'composer.json',
						'!' + projectConfig.srcDir + 'composer.lock',
					],
					dest: projectConfig.distDir,
				} ],
			},
		},

		// Compress Build Files into ${project}.zip
		compress: {
			dist: {
				options: {
					force: true,
					mode: 'zip',
					archive: projectConfig.distDir.replace( projectConfig.name, '' ) + projectConfig.name + '.zip',
				},
				expand: true,
				cwd: projectConfig.distDir,
				src: [ '**' ],
				dest: '../' + projectConfig.name,
			},
		},

		// Minify all .js files.
		terser: {
			options: {
				ie8: true,
				parse: {
					strict: false,
				},
			},
			js: {
				files: [ {
					expand: true,
					src: [ projectConfig.distDir + '**/*.js' ],
					dest: '',
				} ],
			},
		},

		// Minify all .css files.
		cssmin: {
			options: {
				force: true,
				compress: true,
				sourcemaps: false,
			},
			minify: {
				files: [ {
					expand: true,
					src: [ projectConfig.distDir + '**/*.css' ],
					dest: '',
				} ],
			},
		},

		// PHP Code Sniffer.
		phpcs: {
			options: {
				bin: projectConfig.srcDir + 'vendor/phpcs/bin/phpcs',
			},
			dist: {
				src: [
					'**/*.php', // Include all php files.
					'!includes/api/legacy/**',
					'!includes/libraries/**',
					'!node_modules/**',
					'!tests/cli/**',
					'!tmp/**',
					'!vendor/**',
				],
			},
		},

		// All logging configuration
		log: {
			// before build starts log
			begin: `
───────────────────────────────────────────────────────────────────
# Project: ${projectConfig.name}
# Dist: ${projectConfig.distDir}
# Script Version: ${gruntScriptVersion}
───────────────────────────────────────────────────────────────────
			`.cyan,

			// before build starts log
			// nolintwarning: '\n>>'.red + ' Linting is not enabled for this project.',

			// before textdomain tasks starts log
			textdomainchecking: '\n>>'.green + ` Checking textdomain [${projectConfig.name}].`,

			// before textdomain tasks starts log
			minifying: '\n>>'.green + ' Minifying js & css files.',

			// After finishing all tasks
			finish: `
╭─────────────────────────────────────────────────────────────────╮
│                                                                 │
│                      All tasks completed.                       │
│   Built files & Installable zip copied to the dist directory.   │
│                        ~ XpeedStudio ~                          │
│                                                                 │
╰─────────────────────────────────────────────────────────────────╯
			`.green,
		},
	} );

	// Stopping Grunt header logs before every task
	grunt.log.header = function() { };

	// Load all Grunt library tasks
	require( 'jit-grunt' )( grunt );

	// Loading modules that are not autoloaded by jit-grant
	grunt.loadNpmTasks( 'grunt-wp-i18n' ); // Load wp-i18n lib

	/* ---------------------------------------- *
	 *  Registering TASKS
	 * ---------------------------------------- */
	// Default tasks
	grunt.registerTask( 'default', [
		'log:begin',
		'js'
	] );

	grunt.registerTask( 'js', [
		'webpack',
	] );

	grunt.registerTask( 'minify', [
		'log:minifying',
		'terser:js',
		'cssmin',
	] );

	grunt.registerTask( 'boot', [
		'clean',
		'copy',
	] );

	grunt.registerTask( 'build', [
		'log:begin',
		'fixtextdomain',
		'makepot',
		'boot',
		'minify',
		'compress',
		'log:finish',
	] );

	grunt.registerTask( 'lint', [
		'eslint',
		'stylelint',
	] );

	grunt.registerTask( 'fixtextdomain', [
		'log:textdomainchecking',
		'addtextdomain',
		'checktextdomain',
	] );

	// Only an alias to 'default' task.
	grunt.registerTask( 'dev', [
		'default',
	] );

	// Logging multi task
	grunt.registerMultiTask( 'log', function() {
		grunt.log.writeln( this.data );
	} );
};