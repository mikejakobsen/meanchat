var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var sass = require('gulp-sass');

gulp.task('images', function(){
    gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('static/img/'));
});

gulp.task('styles', function(){
    gulp.src(['src/styles/**/*.sass'])
    .pipe(plumber({
        errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('static/css/'))
});

gulp.task('scripts', function(){
    return gulp.src('src/js/**/*.js')
    .pipe(plumber({
        errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(babel())
        .pipe(gulp.dest('static/js/'))
});

gulp.task('default', function(){
    gulp.watch("src/styles/**/*.sass", ['styles']);
    gulp.watch("src/js/**/*.js", ['scripts']);
});

gulp.task('watch', function(){
    gulp.watch("src/styles/**/*.sass", ['styles']);
    gulp.watch("src/js/**/*.js", ['scripts']);
});
