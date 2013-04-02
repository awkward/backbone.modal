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

    uglify:
      main:
        src: 'backbone.modal.js'
        dest: 'backbone.modal-min.js'

    jasmine:
      main:
        src: 'backbone.modal.js'
        options:
          specs: 'test/spec/**/*.js'
          outfile: 'test/spec.html'
          host: 'http://127.0.0.1:8000/'
          vendor: ['examples/vendor/jquery-1.9.1.js', 'examples/vendor/underscore.js', 'examples/vendor/backbone.js']

    coffee:
      main:
        files:
          'backbone.modal.js': 'src/backbone.modal.coffee'
      specs:
        files:
          grunt.file.expandMapping(['test/src/**/*.coffee'], 'test/spec/', 
            rename: (destBase, destPath) ->
              return destBase + destPath.slice(9, destPath.length).replace(/\.coffee$/, '.js')
          )

    regarde:
      livereloadJS:
        files: ['test/**/*.js']
        tasks: ['livereload']
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

  grunt.registerTask 'watch', ['connect', 'coffee', 'uglify', 'jasmine:main:build', 'livereload-start', 'open', 'regarde']