const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const minifyImg = require('gulp-imagemin');
const concat = require('gulp-concat');
const minifyJS = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const runSequence = require('gulp4-run-sequence');
const fsCache = require('gulp-fs-cache');
const babel = require('gulp-babel');

gulp.task('browser-sync', async () => {
    browserSync.init({
        server: {
            baseDir: "dist",
            //https: true
        }
    });
});

gulp.task('css', async () => {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(autoprefixer())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    let jsFsCache = fsCache('tmp/jscache');
    return gulp.src('src/js/**/*.js')
        .pipe(jsFsCache)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(minifyJS(
            /*{
                mangle: false,
                output: {
                    beautify: true,
                    comments: true
                }
            }*/
        ))
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('html', async () => {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('img', async () => {
    gulp.src('src/img/**/*')
        .pipe(minifyImg())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('delete', async () => del(['dist/css', 'dist/js', 'dist/img', 'dist/**/*.html']));

gulp.task('watch', () => {
    gulp.watch("src/sass/**/*.sass", gulp.series('css'));
    gulp.watch("src/js/**/*.js", gulp.series('js'));
    gulp.watch("src/img/**/*", gulp.series('img'));
    gulp.watch("src/**/*.html", gulp.series('html'));
});

gulp.task('default', async () => {
    runSequence(
        'delete',
        'html',
        'css',
        'js',
        'img',
        'browser-sync',
        'watch'
    );
});