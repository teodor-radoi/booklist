'use strict';

module.exports = function(grunt) {

	// load grunt plugins
    require('jit-grunt')(grunt, {
        configureProxies: 'grunt-connect-proxy'
	});
	

	grunt.initConfig({

		settings: {
            connect: {
                host: 'localhost',
                port: '9555'
            },
            proxy: {
                host: 'i42lp1.informatik.tu-muenchen.de',
                port: '8000'
            }
		},
		
		connect: {
            options: {
                hostname: '<%= settings.connect.host %>',
                port: '<%= settings.connect.port %>',
                livereload: 35729,
                middleware: function (connect, options, defaultMiddleware) {
                    var aMiddlewares = [];
                    aMiddlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
                    aMiddlewares.push(defaultMiddleware);
                    return aMiddlewares;
                }
            },
            connectWebapp: {
                options: {
                    base: ['webapp'],
                    open: true
                }
            },
            proxies: [
                // {
                //     context: '/resources',
                //     host: '<%= settings.proxy.host %>',
                //     port: '<%= settings.proxy.port %>',
                //     https: false,
                //     rewrite: {
                //         '/resources': '/sap/public/bc/ui5_ui5/resources'
                //     }
				// }, 
				{
                    context: '/sap/opu/odata',
                    host: '<%= settings.proxy.host %>',
                    port: '<%= settings.proxy.port %>',
                    https: false
				}
				
            ]
		},
		
		watch: {
            options: {
                livereload: true
            },
            watchWebapp: {
                files: ['webapp/**/*']
            }
        },

		// connect: {
		// 	options: {
		// 		port: 8080,
		// 		hostname: '*'
		// 	},
		// 	src: {},
		// 	dist: {}
		// },

		openui5_connect: {
			src: {
				options: {
					appresources: 'webapp'
				}
			},
			dist: {
				options: {
					appresources: 'dist'
				}
			}
		},

		openui5_preload: {
			component: {
				options: {
					resources: {
						cwd: 'webapp',
						prefix: 'simple-app',
						src: [
							'**/*.js',
							'**/*.fragment.html',
							'**/*.fragment.json',
							'**/*.fragment.xml',
							'**/*.view.html',
							'**/*.view.json',
							'**/*.view.xml',
							'**/*.properties',
							'manifest.json',
							'!test/**'
						]
					},
					dest: 'dist'
				},
				components: true
			}
		},

		clean: {
			dist: 'dist',
			coverage: 'coverage'
		},

		copy: {
			dist: {
				files: [ {
					expand: true,
					cwd: 'webapp',
					src: [
						'**',
						'!test/**'
					],
					dest: 'dist'
				} ]
			}
		},

		eslint: {
			webapp: ['webapp']
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');

	// Server task
	// grunt.registerTask('serve', function(target) {
	// 	grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
	// });

	// register serve task
    grunt.registerTask('serve', ['configureProxies:server', 'connect:connectWebapp', 'watch:watchWebapp']);

	// Build task
	grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);

	// Default task
	grunt.registerTask('default', ['serve']);
};
