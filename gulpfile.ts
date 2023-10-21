import * as gulp from 'gulp';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const fs = require('fs');
const spawn = require('child_process').spawn;

import { build } from './data-injector'

// Paths
const srcDir = 'src/';
const buildDir = 'www/';
const assetDir = 'www/assets/';

// Task to inject data from config.json into index.html
gulp.task('inject-data', async function (done: () => void) {
  build();

  await gulp.src('www/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('www'));

  done();
});

// Task to concatenate and minify CSS files
gulp.task('minify-css', async function () {
  await  gulp.src(`${srcDir}style.css`)
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(buildDir));

  await  gulp.src(`${srcDir}animation.css`)
  .pipe(cleanCSS())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest(buildDir));
});

// Copy all the asset dependencies
gulp.task('copy-assets', async function () {

  await gulp.src([
    './LICENSE'
  ])
  .pipe(gulp.dest(`${buildDir}`));

  await gulp.src(`${srcDir}assets/**/*`)
  .pipe(gulp.dest(`${buildDir}assets/`));

  await (await glob(`./node_modules/@fontsource/albert-sans/**/*`)).forEach(async (file) => {
    return gulp.src(file)
    .pipe(rename(({dirname, basename, extname}: {dirname: string, basename: string, extname: string}) => {
      return {
        dirname: dirname.replace('node_modules\\@fontsource', ''),
        basename,
        extname
      };
    }))
    .pipe(gulp.dest(`${assetDir}`));
  });
})




// Task to watch for changes and run tasks automatically
gulp.task('watch', function () {
  gulp.watch(`${srcDir}/index.html`, gulp.series('inject-data'));
  gulp.watch(`${srcDir}/style.css`, gulp.series('minify-css'));
  gulp.watch(`${srcDir}/animation.css`, gulp.series('minify-css'));
});

// Default task
gulp.task('default', gulp.parallel('inject-data', 'minify-css', 'copy-assets', 'watch'));

// Just build task
gulp.task('build', gulp.parallel('inject-data', 'minify-css', 'copy-assets'));

