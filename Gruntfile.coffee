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

    uglify:
      options:
        sourceMap: false
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
          vendor: ['http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js', 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js', 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js', 'http://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.2.1/backbone.marionette.js', 'http://localhost:35729/livereload.js']

    coffee:
      all:
        files:
          'backbone.modal.js': 'src/backbone.modal.coffee'
          'backbone.marionette.modals.js': 'src/backbone.marionette.modals.coffee'
          'backbone.modal-bundled.js': ['src/backbone.modal.coffee', 'src/backbone.marionette.modals.coffee']
      specs:
        files:
          grunt.file.expandMapping(['test/src/**/*.coffee'], 'test/spec/',
            rename: (destBase, destPath) ->
              return destBase + destPath.slice(9, destPath.length).replace(/\.coffee$/, '.js')
          )

    sass:
      options:
        sourcemap: 'none'
      compile:
        files:
          'backbone.modal.css': 'src/backbone.modal.sass'
          'backbone.modal.theme.css': 'src/backbone.modal.theme.sass'

    concurrent:
      compile: ['coffee', 'sass']

    watch:
      examples:
        files: ['examples/**/*']
        options:
          livereload: true
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
  grunt.registerTask 'test', ['jasmine']
