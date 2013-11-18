module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["build"],
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/js/apps/',
                    src: ['**/*.js'],
                    dest: 'build/tmp/',
                    ext: '.min.js',
                    flatten: true
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    'build/tmp/style.min.css': 'src/css/style.css'
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                files: {
                    'build/apps/allInOneHost.min.js': ['libs/jquery/jquery.min.js',
                        'libs/bootstrap/dist/js/bootstrap.min.js',
                        'libs/peerjs/peer.min.js', 
                        'build/tmp/compatibility.min.js',
                        'build/tmp/host.min.js'
                    ],
                    'build/apps/allInOneClient.min.js': ['libs/jquery/jquery.min.js',
                        'libs/bootstrap/dist/js/bootstrap.min.js',
                        'libs/peerjs/peer.min.js', 
                        'build/tmp/compatibility.min.js',
                        'build/tmp/client.min.js'
                    ],
                    'build/css/allInOne.min.css': ['libs/bootstrap/dist/css/bootstrap.min.css',
                        'libs/bootstrap/dist/css/bootstrap-theme.min.css',
                        'build/tmp/style.min.css'
                    ]
                }
            }
        },
        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'libs/',
                    src: ['jquery/jquery.js', 'bootstrap/dist/js/bootstrap.js', 'peerjs/peer.js'],
                    dest: 'build/libs/',
                    flatten: true
                }, {
                    expand: true,
                    cwd: 'libs/bootstrap/dist/fonts/',
                    src: ['*'],
                    dest: 'build/fonts/'
                }, {
                    expand: true,
                    cwd: 'libs/bootstrap/dist/css/',
                    src: ['bootstrap-theme.css', 'bootstrap.css'],
                    dest: 'build/css/'
                }, {
                    expand: true,
                    cwd: 'src/js/apps/',
                    src: ['*.js'],
                    dest: 'build/apps/'
                }, {
                    expand: true,
                    cwd: 'src/css/',
                    src: ['*.css'],
                    dest: 'build/css/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'libs/bootstrap/dist/fonts/',
                    src: ['*'],
                    dest: 'build/fonts/'
                }]
            }
        },
        template: {
            dev: {
                options: {
                    data: {
                        hostScripts: ["libs/jquery.js", "libs/bootstrap.js", "libs/peer.js", "apps/compatibility.js", "apps/host.js"],
                        clientScripts: ["libs/jquery.js", "libs/bootstrap.js", "libs/peer.js", "apps/compatibility.js", "apps/client.js"],
                        csss: ['css/bootstrap.css', 'css/bootstrap-theme.css', 'css/style.css']
                    }
                },
                files: {
                    'build/host.html': ['src/html/host.html.tpl'],
                    'build/client.html': ['src/html/client.html.tpl']
                }
            },
            dist: {
                options: {
                    data: {
                        hostScripts: ["apps/allInOneHost.min.js"],
                        clientScripts: ["apps/allInOneClient.min.js"],
                        csss: ['css/allInOne.min.css']
                    }
                },
                files: {
                    'build/host.html': ['src/html/host.html.tpl'],
                    'build/client.html': ['src/html/client.html.tpl']
                }
            }
        },
        watch: {
            dev: {
                files: ['src/**/*'],
                tasks: ['default'],
                options: {
                    livereload: true
                }
            },
            dist: {
                files: ['src/**/*'],
                tasks: ['dist']
            }
        },
        connect: {
            server: {
                options: {
                    port: 9898,
                    base: 'build/'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'copy:dev', 'template:dev']);
    grunt.registerTask('dist', ['clean', 'uglify', 'cssmin:dist', 'concat:dist', 'copy:dist', 'template:dist']);
};