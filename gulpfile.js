var gulp         = require('gulp');
var clean        = require('gulp-clean');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var babelify     = require('babelify');
var runSequence  = require('run-sequence');
var stringify    = require('stringify');
var sass         = require('gulp-sass');
var cssify       = require('cssify');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');

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

function bundle(debug){
	var bundler = browserify('./src/index.js', { debug : debug });
	bundler.transform(stringify({ extensions: ['.html'] }));
	bundler.transform(cssify);
	bundler.transform( babelify.configure({ ignore : 'node_modules' }) );
	return bundler.bundle()
	.pipe(source('phaser-inspector.js'))
	.pipe(gulp.dest('./build'));
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
	runSequence('css', 'clean', 'browserify', 'copy:example', cb);
});

gulp.task('debug', function(cb) {
	runSequence('css', 'clean', 'browserify:debug', 'copy:example', cb);
});