
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./wwwroot/assets/sass/master.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('./wwwroot/assets/css'))
});

gulp.task('watch', function () {    
    return gulp.watch('./wwwroot/assets/sass/**/*.scss', gulp.series(['sass']));
});



gulp.task('default', gulp.series(['sass', 'watch']));
