import * as gulp from 'gulp';
import { glob, globSync, globStream, globStreamSync, Glob, Path } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const spawn = require('child_process').spawn;

import { build } from './data-injector'

// Paths
const srcDir = './src/';
const buildDir = './www/';
const assetDir = './www/assets/';

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

// Copy all the asset
gulp.task('copy-assets', async function () {
  // Copy all the assets over to the assets folder
  await gulp.src(`${srcDir}assets/**/*`)
  .pipe(gulp.dest(`${buildDir}assets/`));
})

// Copy all the resources
gulp.task('copy-resources', async function () {

  // Expand the resources over the root of the build directory
  await gulp.src([
    `${srcDir}resources/**/*`,
    `${srcDir}resources/**/.*`
  ])
  .pipe(gulp.dest(`${buildDir}`));
});

// Copy all the fonts
gulp.task('copy-fonts', async function () {
  const fontSource = './node_modules/@fontsource/albert-sans';

  return globSync([
    `${fontSource}/400.css`,
    `${fontSource}/files/albert-sans-all-400-normal.woff`,
    `${fontSource}/files/albert-sans-latin-400-normal.woff2`
  ], {nodir: true}).forEach(async (file: string) => {

    const filePath = path.normalize(file)
    const fileDir = path.dirname(filePath);
    const targetPath = `${assetDir}albert-sans/`+path.relative(fontSource, filePath);
    const targetDir = path.dirname(targetPath);

    // Ensure the directory exists
    if (!fs.existsSync(targetDir)){
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy file
    fs.copyFileSync(filePath, targetPath);
  });
})

// Task to watch for changes and run tasks automatically
gulp.task('clean', async function () {
  async function deleteDirectory(dirPath: string) {
    const files = await fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileStat = await fs.lstatSync(filePath);

      if (fileStat.isDirectory()) {
        // Recursively delete subdirectories
        await deleteDirectory(filePath);
      } else {
        // Delete files, including hidden files starting with '.'
        await fs.unlinkSync(filePath);
      }
    }

    // Remove the empty directory
    await fs.rmdirSync(dirPath);
  }

  if (fs.existsSync(buildDir)) {
    await deleteDirectory(buildDir);
  }
});

// Task to watch for changes and run tasks automatically
gulp.task('watch', function () {
  gulp.series('clean');
  gulp.watch(`${srcDir}/index.html`, gulp.series('inject-data'));
  gulp.watch(`${srcDir}/style.css`, gulp.series('minify-css'));
  gulp.watch(`${srcDir}/animation.css`, gulp.series('minify-css'));
});

// Default task
gulp.task('default', gulp.series(
  'clean', 
  'inject-data', 
  'minify-css', 
  'copy-assets',
  'copy-resources',
  'copy-fonts',
  'watch'
));

// Just build task
gulp.task('build', gulp.series(
  'clean', 
  'inject-data', 
  'minify-css', 
  'copy-assets',
  'copy-resources',
  'copy-fonts'
));

