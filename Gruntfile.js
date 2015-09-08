/*jshint node:true*/

// Generated on 2015-07-01 using
// generator-webapp 0.6.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  var path = require('path');

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    tmp: '.tmp'
  };

  // PAGES OF APPLICATION
  var bem = grunt.file.readJSON('bem.json');

  var pagesWithPath = {};
  var blocksWithPath = [];
  var includesWithPath = {};

  for (var i in bem.blocks) {
    blocksWithPath[i] = path.join('<%= config.tmp %>', 'styles', 'blocks', bem.blocks[i] + '.css');
  }

  for (var i in bem.pages) {
    pagesWithPath[path.join('<%= config.tmp %>', bem.pages[i])] = path.join('<%= config.app %>', bem.pages[i]);
  }

  for (var i in bem.includes) {
    includesWithPath[path.join('<%= config.tmp %>', 'includes', bem.includes[i])] = path.join('<%= config.app %>', 'includes', bem.includes[i]);
  }

  grunt.initConfig({
    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files

    bake: {
      includes: {
        files: includesWithPath
      },
      build: {
        files: pagesWithPath
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'postcss']
      },
      html: {
        files: ['<%= config.app %>/includes/**', '<%= config.app %>/*.html'],
        tasks: ['copy:includes', 'generate-blocks-include', 'bake:includes', 'wait:pause', 'bake:build']
      },
      bem: {
        files: ['bem.json'],
        tasks: ['newer:copy:styles', 'postcss', 'copy:includes', 'generate-blocks-include', 'bake:includes', 'bake:build']
      }
    },

    browserSync: {
      options: {
        notify: false,
        background: true
      },
      bake: {
        files: ['<%= config.app %>/includes/**'],
        tasks: ['copy:includes', 'generate-blocks-include', 'bake:includes', 'bake:build']
      },
      livereload: {
        options: {
          files: [
            '<%= config.tmp %>/{,*/}*.html',
            '<%= config.tmp %>/styles/{,*/}*.css',
            '<%= config.app %>/images/{,*/}*',
            '<%= config.app %>/scripts/{,*/}*.js'
          ],
          port: 9000,
          server: {
            baseDir: ['<%= config.tmp %>', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      test: {
        options: {
          port: 9001,
          open: false,
          logLevel: 'silent',
          host: 'localhost',
          server: {
            baseDir: ['<%= config.tmp %>', './test', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      dist: {
        options: {
          background: false,
          server: '<%= config.dist %>'
        }
      }
    },

    secret: grunt.file.readJSON('secret.json'),
    sftp: {
      copyToServer: {
        files: {
          "./": "dist/**/*"
        },
        options: {
          path: '/var/www/html',
          srcBasePath: "dist/",
          createDirectories: true,
          host: '<%= secret.host %>',
          username: '<%= secret.username %>',
          password: '<%= secret.password %>',
          showProgress: true
        }
      }
    },
    sshexec: {
      recreateHttFolder: {
        command: 'rm -rf /var/www/html; mkdir /var/www/html; echo "hello"',
        options: {
          host: '<%= secret.host %>',
          username: '<%= secret.username %>',
          password: '<%= secret.password %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.tmp %>',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '<%= config.tmp %>'
    },

    wait: {
      pause: {
        options: {
          delay: 50
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/index.html']
        }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          // Add vendor prefixed styles
          require('autoprefixer-core')({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
          })
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.tmp %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= config.tmp %>/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        src: ['<%= config.tmp %>/*.html'],
        ignorePath: /^<%= config.app %>\/|\.\.\//
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= config.dist %>/scripts/{,*/}*.js',
          '<%= config.dist %>/styles/{,*/}*.css',
          '<%= config.dist %>/images/{,*/}*.*',
          '<%= config.dist %>/styles/fonts/{,*/}*.*',
          '<%= config.dist %>/*.{ico,png}'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles'
        ]
      },
      html: ['<%= config.dist %>/{,**/}*.html'],
      css: ['<%= config.dist %>/styles/{,**/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    /*  htmlmin: {
     dist: {
     options: {
     collapseBooleanAttributes: true,
     collapseWhitespace: true,
     conservativeCollapse: true,
     removeAttributeQuotes: true,
     removeCommentsFromCDATA: true,
     removeEmptyAttributes: true,
     removeOptionalTags: true,
     // true would impact styles with attribute selectors
     removeRedundantAttributes: false,
     useShortDoctype: true
     },
     files: [{
     expand: true,
     cwd: '<%= config.dist %>',
     src: '{,*!/}*.html',
     dest: '<%= config.dist %>'
     }]
     }
     },*/

    /*   cssmin: {
     dist: {
     files: {
     '<%= config.dist %>/styles/main.css': [
     '.tmp/styles/{,*!/}*.css',
     '<%= config.app %>/styles/{,**!/}*.css'
     ]
     }
     }
     },*/

    concat_css: {
      options: {
        // Task-specific options go here.
      },
      all: {
        src: blocksWithPath,
        dest: '<%= config.dist %>/styles/common/blocks.css'
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/scripts.js': [
    //         '<%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            'scripts/{,**/}*.js',
            'fonts/{,**/}*.*'
          ]
        }]
      },
      includes: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/',
        dest: '<%= config.tmp %>',
        src: ['includes/{,**/}*.html']
      },
      html: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/',
        dest: '<%= config.tmp %>',
        src: ['*.html']
      },
      html_dist: {
        expand: true,
        dot: true,
        cwd: '<%= config.tmp %>/',
        dest: '<%= config.dist %>',
        src: ['{,*/}*.html']
      },
      styles_dist: {
        expand: true,
        dot: true,
        cwd: '<%= config.tmp %>/styles/',
        dest: '<%= config.dist %>/styles',
        src: ['{,**/}*.css', '!{,blocks/}*.css']
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/styles',
        dest: '<%= config.tmp %>/styles/',
        src: '{,**/}*.css'
      }
    },

    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: 'bower_components/modernizr/modernizr.js',
        outputFile: '<%= config.dist %>/scripts/vendor/modernizr.js',
        files: {
          src: [
            '<%= config.dist %>/scripts/{,*/}*.js',
            '<%= config.dist %>/styles/{,*/}*.css',
            '!<%= config.dist %>/scripts/vendor/*'
          ]
        },
        uglify: true
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    }
  });

  // Dependencies

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });



  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-file-append');
  grunt.loadTasks("tasks");
  grunt.loadNpmTasks('grunt-wait');


  // Tasks
  grunt.registerTask('serve', 'start the server and preview your app', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'bake:build',
      'concurrent:server',
      'postcss',
      'browserSync:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'postcss'
      ]);
    }

    grunt.task.run([
      'browserSync:test',
      'mocha'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'bake:includes',
    'bake:build',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    /*'concat',*/
    /*'cssmin',
     'uglify',*/
    'copy:dist',
    'copy:styles_dist',
    'copy:html_dist',
    'concat_css',
    'copy:styles',
    'modernizr',
    /*'filerev',*/
    'usemin',
    /*'htmlmin'*/
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('deploy', [
    'sshexec:recreateHttFolder',
    'sftp:copyToServer'
  ]);

  grunt.registerTask('redeploy', [
    'build',
    'deploy'
  ]);

};
