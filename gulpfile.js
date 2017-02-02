var gulp = require('gulp'),

    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    ngAnnotate = require('gulp-ng-annotate'),
    cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del = require('del'); // Подключаем библиотеку для удаления файлов и папок


gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('scripts', function () {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/js/*.js',
        'app/js/lib/controls/*.js',
        'app/js/lib/*.js',
        'app/js/renderers/*.js',



    ])
        .pipe(concat('app.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(ngAnnotate({
            // true helps add where @ngInject is not used. It infers.
            // Doesn't work with resolve, so we must be explicit there
            add: true
        }))
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('dist/js')); // Выгружаем в папку app/js
});


gulp.task('css-libs', function () {
    return gulp.src('app/css/*.css') // Выбираем файл для минификации
        .pipe(concat('app.css'))
        .pipe(cssnano()) // Сжимаем
        .pipe(gulp.dest('dist/css')); // Выгружаем в папку app/css
});


gulp.task('build', ['clean', 'css-libs', 'scripts'], function () {


    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});


