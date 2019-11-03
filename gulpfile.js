
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task(('sass'), function () {
    return gulp.src('./app/sass/master.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('../css'))
});

gulp.task('watch', function () {    
    return gulp.watch('./app/sass/**/*.scss', gulp.series(['sass']));
});



gulp.task('default', gulp.series(['sass', 'watch']));

 