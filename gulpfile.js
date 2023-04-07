// ✨✨✨✨✨✨✨✨✨✨✨
// 1 Déclaration des variables
// ✨✨✨✨✨✨✨✨✨✨✨

var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
const minify = require('gulp-minify');




// ✨✨✨✨✨✨✨✨✨✨✨
// 2 Mes tâches
// ✨✨✨✨✨✨✨✨✨✨✨

// sass
gulp.task('sassification', function() {
    return gulp.src('dev/css/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(rename(function (path) {
                path.basename += ".min";
            }))
            .pipe(autoprefixer())
        .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('prod/css')); 
});

// html
gulp.task('htmlification', function() {
    return gulp.src('dev/*.html')
    .pipe(gulp.dest('prod'));
});

// js
gulp.task('jsification', function() {
    return gulp.src('dev/js/*.js')
    .pipe(gulp.dest('prod/js'));
});

// minify js with terser
gulp.task('minification', function() {
    gulp.src(['dev/js/*.js', 'prod/js/*.mjs'])
      .pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        }
      }))
      .pipe(gulp.dest('prod/js'))
});

// live server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "prod"
        }
    });
});

// img
gulp.task('imagification', function() {
    return gulp.src('dev/img/*')
    .pipe(gulp.dest('prod/img'));
});




// ✨✨✨✨✨✨✨✨✨✨✨
// 3 Exécution des tâches
// ✨✨✨✨✨✨✨✨✨✨✨

gulp.task('observation', gulp.parallel('browser-sync', 'sassification', 'htmlification', 'jsification', 'minification', 'imagification', function() {
    gulp.watch('dev/css/**/*.scss', gulp.series('sassification'));
    gulp.watch('dev/*.html', gulp.series('htmlification'));
    gulp.watch('dev/js/*.js', gulp.series('jsification'));
    gulp.watch('prod/**/*').on('change', browserSync.reload);
    gulp.watch('dev/js/*.js', gulp.series('minification'));
}))

gulp.task('default', gulp.series('observation'));