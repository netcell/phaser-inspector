var gulp         = require('gulp');
var clean        = require('gulp-clean');
var browserify   = require('browserify');
var watchify     = require('watchify');
var source       = require('vinyl-source-stream');
var babelify     = require('babelify');
var runSequence  = require('run-sequence');
var stringify    = require('stringify');
var sass         = require('gulp-sass');
var cssify       = require('cssify');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');

gulp.task('minify', function() {
	return gulp.src('./build/phaser-inspector.js')
	.pipe(rename('phaser-inspector.min.js'))
	.pipe(uglify({ mangle: false }))
	.pipe(gulp.dest('./build'));
});

gulp.task('css', function () {
	return gulp.src('./src/css/**/*.sass', { base: './src/css'})
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer({
	        browsers: ['last 3 versions'],
	        cascade: false
	    }))
		.pipe(gulp.dest('./src/css'));
});

gulp.task('copy:example', function() {
	return gulp.src('./build/*.js')
	.pipe(gulp.dest('./example/phaser-inspector'));
});

gulp.task('watch', function() {
	gulp.watch(['./src/css/**/*.sass'], ['css']);
})

function rebundle(bundler, debug) {
	console.log('Start rebundling')
	return bundler.bundle()
	.on('error', function(err){
		console.log(err)
	})
	.pipe(source('phaser-inspector.js'))
	.pipe(gulp.dest('./build'))
	.on('end', function(){
		debug && runSequence('copy:example', function(){
			console.log('REBUNDLED');
		})
	});
}

function bundle(debug){
	watchify.args.debug = debug;
	var bundler = browserify('./src/index.js', watchify.args);
	debug && ( bundler = watchify(bundler) );
	bundler.transform(stringify({ extensions: ['.html'] }));
	bundler.transform(cssify);
	bundler.transform( babelify.configure({ ignore : 'node_modules' }) );
	bundler.transform('stripify');
	debug && bundler.on('update', function(){
		rebundle(bundler, debug);
	});
	return rebundle(bundler, debug);
}

gulp.task('browserify', function() {
	return bundle(false);
});

gulp.task('browserify:debug', function() {
	return bundle(true);
});

gulp.task('clean', function () {
	return gulp.src([ './build/**/*.*', ], {read: false}).pipe(clean({force: true}));
});

gulp.task('default', function(cb) {
	runSequence('css', 'clean', 'browserify', 'minify', 'copy:example', cb);
});

gulp.task('debug', function(cb) {
	runSequence('watch', 'css', 'clean', 'browserify:debug', cb);
});