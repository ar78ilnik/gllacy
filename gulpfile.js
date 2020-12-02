'use strict';

/* подключаем плагины */
const gulp = require('gulp');
const scss = require('gulp-sass');
const pug = require('gulp-pug');
const debug = require('gulp-debug');
const bs = require('browser-sync').create();
const plumber = require('gulp-plumber');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('autoprefixer');
const del = require('del');

function clean() {
    return del('dist');
};

function copy() {
    return gulp.src([
        'app/fonts/**/*.*',
        'app/img/**/*.{jpg,png,webp,mp4,svg}',
        'app/js/*.*'
    ], {
            base: 'app',
        })
        .pipe(gulp.dest('dist'))
        .pipe(debug({
            title: 'copy'
        }));
};

function toHtml() {
    return gulp.src('app/pages/**/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('dist'))
        .pipe(bs.reload({
            stream: true
        }))
};

function style() {
    return gulp.src('app/scss/style.scss')
        .pipe(plumber())
        .pipe(debug({
            title: 'src'
        }))
        .pipe(scss())
        .pipe(debug({
            title: 'scss'
        }))
        .pipe(postcss([
        autoprefixer({
                grid: true
            })
    ]))
        .pipe(gulp.dest('dist/css'))
        .pipe(csso())
        .pipe(rename('style.min.css'))
        .pipe(debug({
            title: 'rename'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(bs.reload({
            stream: true
        }))
};

function watch() {
    gulp.watch('app/pages/**/*.pug', toHtml);
    gulp.watch('app/components/**/*.pug', toHtml);
    gulp.watch('app/scss/*.scss', style);
    gulp.watch('app/js/**/*.js', copy);
    gulp.watch('app/fonts/*.{woff, woff2}', copy);
    gulp.watch('app/img/**/*.*', copy);
};

function server() {
    bs.init({
        server: 'dist'
    });
    bs.watch('app/pages/**/*.pug').on('change', bs.reload);
    bs.watch('app/components/**/*.pug').on('change', bs.reload);
    bs.watch('app/scss/*.scss').on('change', bs.reload);
    bs.watch('app/js/**/*.js').on('change', bs.reload);
    bs.watch('app/img/**/*.*').on('change', bs.reload);

};

const build = gulp.series(clean, copy, toHtml, style, gulp.parallel(watch, server));

exports.clean = clean;
exports.copy = copy;
exports.toHtml = toHtml;
exports.style = style;
exports.build = build;
exports.server = server;