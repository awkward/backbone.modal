module.exports = (grunt) ->
  fs = require('fs')

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    open:
      default:
        url: 'http://localhost:8000'

    connect:
      default:
        options:
          base: './'
          middleware: (connect, options) ->
            [connect.static(options.base), (req, res, next) ->
              fs.readFile "#{options.base}/test/spec.html", (err, data) ->
                res.writeHead(200)
                res.end(data)
            ]
      examples:
        options:
          port: 5000
          base: './'
          middleware: (connect, options) ->
            [connect.static(options.base), (req, res, next) ->
              fs.readFile "#{options.base}/examples/2_tab_based.html", (err, data) ->
                res.writeHead(200)
                res.end(data)
            ]

    uglify:
      modal:
        src: 'backbone.modal.js'
        dest: 'backbone.modal-min.js'
      modals:
        src: 'backbone.marionette.modals.js'
        dest: 'backbone.marionette.modals-min.js'
      bundled:
        src: 'backbone.modal-bundled.js'
        dest: 'backbone.modal-bundled-min.js'

    jasmine:
      all:
        src: ['backbone.modal.js', 'backbone.marionette.modals.js']
        options:
          specs: 'test/spec/**/*.js'
          outfile: 'test/spec.html'
          host: 'http://127.0.0.1:8000/'
          vendor: ['http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js', 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js', 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min.js', 'http://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/1.4.1-bundled/backbone.marionette.min.js']

    coffee:
      all:
        files:
          'backbone.modal.js': 'src/backbone.modal.coffee'
          'backbone.marionette.modals.js': 'src/backbone.marionette.modals.coffee'
          'backbone.modal-bundled.js': ['src/backbone.modal.coffee', 'src/backbone.marionette.modals.coffee']

          'examples/vendor/backbone.modal.js': 'src/backbone.modal.coffee'
          'examples/vendor/backbone.marionette.modals.js': 'src/backbone.marionette.modals.coffee'
      specs:
        files:
          grunt.file.expandMapping(['test/src/**/*.coffee'], 'test/spec/',
            rename: (destBase, destPath) ->
              return destBase + destPath.slice(9, destPath.length).replace(/\.coffee$/, '.js')
          )

    sass:
      compile:
        files:
          'backbone.modal.css': 'src/backbone.modal.sass'
          'backbone.modal.theme.css': 'src/backbone.modal.theme.sass'
          'examples/vendor/backbone.modal.css': 'src/backbone.modal.sass'
          'examples/vendor/backbone.modal.theme.css': 'src/backbone.modal.theme.sass'
          'examples/style.css': 'src/style.sass'

    concurrent:
      compile: ['coffee', 'sass']

    watch:
      sass:
        files: ['src/**/*.sass']
        tasks: ['sass']
        options:
          livereload: true
      coffee:
        files: ['src/**/*.coffee', 'test/src/**/*.coffee']
        tasks: ['uglify', 'coffee']
        options:
          livereload: true

  # Auto include Grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask 'build', ['concurrent', 'uglify', 'jasmine:all:build']
  grunt.registerTask 'default', ['connect', 'build', 'open', 'watch']