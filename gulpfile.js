var gulp = require('gulp'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass')(require('sass')),
  prefix = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create();

/////////////
// Compiling
/////////////

gulp.task('pug', () => gulp.src(['source/pug/*.pug'])
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest('.'))
		.pipe(browserSync.stream()) );

gulp.task('sass', () => gulp.src(['source/sass/*.sass'])
		.pipe(sass())
		.pipe(prefix('last 3 versions'))
		.pipe(gulp.dest('app/'))
		.pipe(browserSync.stream()) );

///////////////////
// Synchronization
///////////////////

// Watching files
gulp.task('watch', () => {
	gulp.watch('source/pug/*.pug', gulp.series('pug'));
	gulp.watch('source/sass/*.sass', gulp.series('sass'));
});

// Livereload
gulp.task('browser-sync', () => browserSync.init({
	port: 1337,
	server: {
		baseDir: './'
	},
  ui: {
    port: 1338
  },
  notify: true
}) );

gulp.task('default', gulp.parallel('pug', 'sass', 'browser-sync', 'watch'));
