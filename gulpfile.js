var gulp = require('gulp');
var ts = require('gulp-typescript');
var connect = require('gulp-connect');

gulp.task('typescript', gulp.series(()=>{
   var tsResult = gulp.src('src/**/*.ts')
                     .pipe(ts({
                         declaration: true
                     }));
   tsResult.js.pipe(gulp.dest('build/js'))
             .pipe(connect.reload());
}));

gulp.task('html', gulp.series(()=> {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
}));

gulp.task('connect', gulp.series(() =>{
    connect.server({
        root: 'dist',
        livereload: true
    });
}));

gulp.task('watch', gulp.series(()=>{
    gulp.watch('src/**/*.ts', ['typescript']);
    gulp.watch('src/**/*.html', ['html']);
}));

gulp.task('default', gulp.series('typescript','html','connect','watch'));