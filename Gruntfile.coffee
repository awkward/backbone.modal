module.exports = (grunt) ->
  fs = require('fs')

  grunt.initConfig
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
          base: './examples/'
          middleware: (connect, options) ->
            [connect.static(options.base), (req, res, next) ->
              fs.readFile "#{options.base}/example.html", (err, data) ->
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

    jasmine:
      all:
        src: ['backbone.modal.js', 'backbone.marionette.modals.js']
        options:
          specs: 'test/spec/**/*.js'
          outfile: 'test/spec.html'
          host: 'http://127.0.0.1:8000/'
          vendor: ['examples/vendor/jquery-1.9.1.js', 'examples/vendor/underscore.js', 'examples/vendor/backbone.js', 'examples/vendor/marionette.js']

    coffee:
      all:
        files:
          'backbone.modal.js': 'src/backbone.modal.coffee'
          'backbone.marionette.modals.js': 'src/backbone.marionette.modals.coffee'
          
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
          'examples/vendor/backbone.modal.css': 'src/backbone.modal.sass'

    concurrent:
      compile: ['coffee', 'sass']

    regarde:
      livereloadJS:
        files: ['test/**/*.js']
        tasks: ['livereload']
      livereloadCSS:
        files: ['examples/vendor/backbone.modal.css']
        tasks: ['livereload:backbone.modal.css']
      sass:
        files: ['src/**/*.sass']
        tasks: ['sass']
      coffee:
        files: ['src/**/*.coffee', 'test/src/**/*.coffee']
        tasks: ['uglify', 'coffee']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-regarde'
  grunt.loadNpmTasks 'grunt-open'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-livereload'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-concurrent'

  grunt.registerTask 'watch', ['connect', 'concurrent', 'uglify', 'jasmine:all:build', 'livereload-start', 'open', 'regarde']