
//	main gulp build

    //  modules
var gulp          = require('gulp'),
    path          = require('path'),
    runSequence   = require('run-sequence'),
    es            = require('event-stream'),
    rimraf        = require('rimraf'),
    concat        = require('gulp-concat'),
    gulpif        = require('gulp-if'),
    eslint        = require('gulp-eslint'),
    less          = require('gulp-less'),
    react         = require('gulp-react'),
    //  helpers
    getPath,
    //  variables
    paths         = {},
    ENV = 'dev';  //  environment variable

//  paths getter
getPath = function(pathName){

  if(typeof paths[pathName] !== 'string'){
    throw Error('pathName '+pathName+' does not exist!');
  }

  return paths[pathName];
};

//  paths
paths.src            = path.resolve('./src');
paths.deploy         = path.resolve('./deploy');

//  js files dir
paths.jsDir          = path.join(getPath('src'), 'js');
paths.vendorJsDir    = path.join(getPath('jsDir'), 'vendor');
paths.appJsDir       = path.join(getPath('jsDir'), 'app');
//  LESS files dir
paths.stylesDir      = path.join(getPath('src'), 'styles');


//  tasks
//--------------------------------------------------------- clean-deploy-dir
// clean the deploy folder
gulp.task('clean-deploy-dir', function(taskDone){

  rimraf(getPath('deploy'), function(){
    taskDone();
  });
});

//--------------------------------------------------------- deploy-js
//  handle the js files
gulp.task('deploy-js', function(taskDone){

  var vendorJS;

  if(ENV === 'dev'){
    vendorJS = getPath('vendorJsDir') + '/**/*.js';
  } else {
    vendorJS = getPath('vendorJsDir') + '/**/*.min.js';
  }

  es.merge(
    //  vendor.js
    gulp.src(vendorJS)
    .pipe( concat('vendor.js') )
    .pipe( gulp.dest(getPath('deploy')) ),

    //  main.js
    gulp.src(getPath('appJsDir') + '/**/*.js')
    //  pass all js code through ESLint
    .pipe( eslint({ config: '.eslintrc' }) )
    .pipe( eslint.format() )
    .pipe( concat('main.js') )
    .pipe( gulp.dest(getPath('deploy')) )
  )
  .on('end',function(){
    taskDone();
  });

});

//--------------------------------------------------------- deploy-html
//  handle the html files
gulp.task('deploy-html', function(taskDone){

  gulp.src( path.join(getPath('src'), 'index.html') )
  .pipe( gulp.dest(paths.deploy) )
  .on('end',function(){
    taskDone();
  });
});

//--------------------------------------------------------- deploy-css
//  handle the css files
gulp.task('deploy-css', function(){

  gulp.src( path.join(getPath('stylesDir'), '*.less') )
  .pipe( less() )
  .pipe( gulp.dest(paths.deploy) );
});

//--------------------------------------------------------- dev
gulp.task('dev', function(taskDone){

  ENV = 'dev';

  runSequence(
    'clean-deploy-dir',
    ['deploy-js', 'deploy-html', 'deploy-css'],
    taskDone
  );
});

//--------------------------------------------------------- release
gulp.task('release', function(taskDone){

  ENV = 'release';

  runSequence(
    'clean-deploy-dir',
    ['deploy-js', 'deploy-html', 'deploy-css'],
    taskDone
  );
});


gulp.task('watch', function(){

  ENV = 'dev';

  //  watchers
  gulp.watch([getPath('jsDir') + '/**/*'], ['deploy-js']);
  gulp.watch([getPath('src') + '/*.html'], ['deploy-html']);
  gulp.watch([getPath('stylesDir') + '/*.less'], ['deploy-css']);
});


gulp.task('default', function(){
  log.data('========================== cabbie - hailo demo ==========================');
  log.data('run `gulp dev` to build in the development environent');
  log.data('run `gulp watch` to build in the development environent and keep watchers running');
  log.data('run `gulp release` to build in the release environent');
});
