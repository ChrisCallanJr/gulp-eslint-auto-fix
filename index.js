const {dest, watch, src} = require('gulp')
const eslint = require('gulp-eslint')
const gulpif = require('gulp-if')
const path = require('path')

function handleResult(result) {
  result.messages.forEach(function(message) {
    if (message.fatal) {
      console.error(message.message + ' on line ' + message.line + ' of ' + result.filePath)
    }
  })
}

function fixLintableFile(vinyl, cb) {
  if (vinyl.contents) {
    src(vinyl.path)
      .on('error', function() {}) // Prevent a crash. Let eslint.result report the error.
      .pipe(eslint({fix: true}))
      .pipe(eslint.result(handleResult))
      .pipe(gulpif(wasFixedByEslint, dest(path.dirname(vinyl.path))))
  }
  cb()
}

function wasFixedByEslint(vinyl) {
  return vinyl.eslint && vinyl.eslint.fixed
}

module.exports = function(globsToWatch) {
  globsToWatch = globsToWatch || ['**/*.js', '!**/node_modules', '!**/bower_components']
  return gulp.task(function() {
    return watch(globsToWatch, fixLintableFile)
  })
}

