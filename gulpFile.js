//Подключение gulp. Вместо const можно var- одно и то же
const gulp = require('gulp')
const concat = require('gulp-concat')
// const autoprefix = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const del = require('del')
const browserSync = require('browser-sync').create()
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')(require('sass'))
const imagemin = require('gulp-imagemin')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const size = require ('gulp-size')
const newer = require ('gulp-newer')
const gulppug = require ('gulp-pug')
//Константа с путями paths - для сокращенной записи
// const paths = {
//     styles: {
//         src: 'src/css/**/*.scss',
//         src: 'src/css/**/*.sass',
//         dest: 'build/css/'
//     },
//     scripts: {
//         src: 'src/js/**/*.js',
//         dest: 'build/js/'
//     }
// }

//Порядок подключения файлов
/*
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
] 
*/
const styleFiles = [
    './src/css/main.scss',
    './src/css/color.sass'
]

const scriptFiles = [
    './src/js/lib.js',
    './src/js/main.js',
    './src/js/*.ts'
]

const html = {
    src: './*.html',
    build: './build'
}

const pug = {
    src: 'src/*.pug',
    build: './build'
}




//Таск для стилей CSS
gulp.task('styles', () => { //сокращенная запись анонимной функции
    //Шаблон для поиска файлов CSs
    return gulp.src(styleFiles)
        .pipe(sourcemaps.init())
        .pipe(sass()) //компиляция файлов sass и scss

        //Действие функции
        //Объединеие файлов в 1
        .pipe(concat('styles.css'))
        //Добавляем префиксы
        // .pipe(autoprefixer({}))
        //Минификация CSS
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('.')) //записываем файлы
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(size())

        //Выходная папка для стилей
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream())
})

//Функция для скриптов JS
gulp.task('scripts', () => {
    //Шаблон для поиска файлов JS
    return gulp.src(scriptFiles)

    //Действие функции
        .pipe(sourcemaps.init())
        //Минификация JS
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(concat('script.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size())

    //Выходная папка для стилей
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream())
})

// Удалить все в указанном файле
gulp.task('del', () => {
    return del(['build/*', '!build/img'])
})

gulp.task('img-min', () => {
    return gulp.src('./src/img/*')
        .pipe(newer('./src/img/*'))
        .pipe(imagemin([
            //оптимальный метод с;атия через объект
            imagemin.jpegtran({ progressive: true })
        ]))
        .pipe(gulp.dest('./build/img/'))
})

gulp.task('pug', () => {
    return gulp.src(pug.src)
        .pipe(gulppug())
        .pipe(size())
        .pipe(gulp.dest(pug.build))
        .pipe(browserSync.stream())
});

gulp.task('html', () => {
    return gulp.src(html.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size())
        .pipe(gulp.dest(html.build))
        .pipe(browserSync.stream())
});

//Таск для отслеживания изменений
gulp.task('watch', () => {
    //Открывает окно браузера
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./src/img/**', gulp.series('img-min'))
    //следит за стилями автоматически
    // gulp.watch('./src/css/**/*css', styles) 
    gulp.watch('./src/css/**/*scss', gulp.series('styles'))
    gulp.watch('./src/css/**/*sass', gulp.series('styles'))
    //следит за скриптами автоматически
    gulp.watch('./src/js/**/*js', gulp.series('scripts'))
    //При изменении html запучкает синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
})

//Таск по умолчанию, запускающий del, styles, scripts и watch
gulp.task('default', gulp.series('del', 'html', gulp.parallel('styles', 'scripts'), 'watch'))

//exports.название_задачи = функция - аналогичное создкание задачи
exports.pug = pug