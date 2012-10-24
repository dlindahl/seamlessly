/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    min: {
      main: {
        src : ['<banner:meta.banner>','compiled/<%=pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      embed : {
        src : ['<banner:meta.banner>','compiled/<%=pkg.name %>_embed.js'],
        dest: 'dist/<%= pkg.name %>_embed.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {},
    coffee: {
      main: {
        src: [ 'lib/**/seamlessly.coffee' ],
        dest: 'compiled',
        options : {
          bare : false
        }
      },
      embed: {
        src: [ 'lib/**/seamlessly_embed.coffee' ],
        dest: 'compiled',
        options : {
          bare : false
        }
      },
      test: {
        src: [ 'test/*.coffee' ],
        dest: 'test/compiled',
        options : {
          base : false
        }
      },
      spec: {
        src: [ 'test/spec/*.coffee' ],
        dest: 'test/spec/compiled',
        options : {
          bare : false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('test', 'coffee mocha');

  // Default task.
  grunt.registerTask('default', 'lint test concat min');
};
