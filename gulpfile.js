import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import webp from 'gulp-webp';
import squoosh from 'gulp-libsquoosh';
import rename from 'gulp-rename';
import svgsprite from 'gulp-svg-sprite';
import { deleteAsync as del } from 'del';
import svgo from 'gulp-svgo';
import csso from 'postcss-csso';


// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
}

//images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src(['source/img/**/*.{jpg,png,svg}', '!source/img/icons/*.svg'])
    .pipe(gulp.dest('build/img'))
}

// webP

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'))
}

// SVG

const optimizeSvg = () =>
  gulp.src(['source/img/**/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));


// Sprites
const svgSprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgsprite({
      mode: {
        stack: {
          sprite: 'sprite.svg'
        }
      },
    }
    ))
    .pipe(gulp.dest('build/img'));
}

//Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    // 'source/*.ico',
    'manifest.webmanifest',
    // 'favicon.ico'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// Delete build

export const clean = () => {
  return del('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done()
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts))
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch('source/img/*.{jpg,png,svg}', gulp.series(copyImages, styles, html, reload));
  gulp.watch('source/img/icons/*.svg', gulp.series(svgSprite, styles, html, reload ));
}

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    optimizeSvg,
    svgSprite,
    createWebp
  )
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    optimizeSvg,
    svgSprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));

