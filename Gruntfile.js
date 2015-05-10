module.exports = function (grunt) {
  var args = {
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: 'out'
    },

    jshint: {
      files: ['src/js/common.js', 'src/js/index.js']
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'src/js/',
            src: 'dygraph-combined.js',
            dest: 'out/www/',
          },
          {
            expand: true,
            cwd: 'src/html/',
            src: 'index.html',
            dest: 'out/www/',
          },
          {
            expand: true,
            cwd: 'src/py/',
            src: '**/*.py',
            dest: 'out/',
          },
          {
            expand: true,
            cwd: 'src/yaml/',
            src: 'app.yaml',
            dest: 'out/',
          }
        ]
      }
    },

    cssmin: {
      combine: {
        files: {
          'out/www/till.css': 'src/css/till.css'
        }
      }
    },

    'closure-compiler': {
      build: {
        closurePath: '/home/kjiwa/opt/closure',
        js: ['src/js/common.js', 'src/js/index.js'],
        jsOutputFile: 'out/www/index.js',
        options: {
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT',
          warning_level: 'VERBOSE'
        }
      }
    }
  };

  grunt.initConfig(args);
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', [ 'jshint', 'copy', 'cssmin', 'closure-compiler' ]);
};
