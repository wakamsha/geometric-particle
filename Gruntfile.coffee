module.exports = (grunt)->

	pkg = grunt.file.readJSON 'package.json'

	for taskName of pkg.devDependencies
		if taskName.substring(0,6) == 'grunt-'
			grunt.loadNpmTasks taskName


	grunt.initConfig

		external_daemon:
			mid_serve:
				cmd: 'bundle'
				args: ['exec', 'middleman', 'server']
				options:
					verbose: true
					
		typescript:
			base:
				src: ['source_typescript/Main.ts']
				dest: 'source/assets/javascripts/main.js'
				options:
					target: 'es5'

		middleman:
			options:
				useBundle: true
			build:
				options:
					command: 'build'

		watch:
			options:
				livereload: true
			typescript:
				files: ['source_typescript/*.ts']
				tasks: ['typescript']



	grunt.registerTask 'default', ['typescript','watch']
	grunt.registerTask 'build', ['typescript', 'middleman:build']
	grunt.registerTask 'serve', ['typescript', 'external_daemon:mid_serve', 'watch']