import Build from './Build.js';
import App from './App.js';
let Server = require('karma').Server

class blueprint {

	constructor() {
		this.apps = AssetPipeline.apps;
		this.cssBuild = new Build();
		this.jsBuild = new Build();
	}

	createAppTasks() {
		let self = this;
		self.appTasks = [];
		this.apps.map(function(name) {
			let app = new App(name, self.cssBuild, self.jsBuild);
			self.appTasks.push(app.appTaskName());
		});
		this.makeAllTask();
		this.versionTask();
		this.testTask();
	}

	makeAllTask() {
		gulp.task(this.allTaskName(), this.appTasks);
	}

	testTask() {
		gulp.task(AssetPipeline.config.testCommand, function(done) {
		    new Server({
		        configFile: __dirname + '/../karma.conf.js',
		        singleRun: true
		    }, done).start();
		});
	}

	versionTask() {
		gulp.task('version', function() {
			return gulp.src(__dirname + '/../build/**/*')
					.pipe(AssetPipeline.plugins.rev())
				    .pipe(gulp.dest('public'))
				    .pipe(AssetPipeline.plugins.rev.manifest({
				        merge: true,
				    }))
				    .pipe(gulp.dest('.'));
		});
	}

	allTaskName() {
		return AssetPipeline.config.appRunAllCommand + ':all';
	}

}

export default blueprint;