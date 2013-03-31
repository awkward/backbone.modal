module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      main:
        files:
          'backbone.modal.js': 'src/backbone.modal.coffee'

    regarde:
      livereloadJS:
        files: ['lib/**/*.js']
        tasks: ['livereload']
      coffee:
        files: ['src/**/*.coffee']
        tasks: ['coffee']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-regarde'
  grunt.loadNpmTasks 'grunt-contrib-livereload'

  grunt.registerTask 'watch', ['coffee', 'livereload-start', 'regarde']