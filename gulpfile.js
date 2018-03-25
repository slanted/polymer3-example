'use strict';

const del = require('del');
const fs = require('fs-extra');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const eslint = require('gulp-eslint');
let run = require('gulp-run');

// Analyzer stuff.
const {Analyzer, generateAnalysis} = require('polymer-analyzer');
const FSUrlLoader = require('polymer-analyzer/lib/url-loader/fs-url-loader').FSUrlLoader;
const PackageUrlResolver = require('polymer-analyzer/lib/url-loader/package-url-resolver').PackageUrlResolver;

// Paths to the app directories
let catalogPath = __dirname + '/web/catalog/';
let distPath = catalogPath + 'dist/';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

gulp.task('clean', function() {
  return del([catalogPath + '/dist']);
});

let repos = [];

gulp.task('make-dist', function() {
  // Get the packages info
  let json = JSON.parse(fs.readFileSync(catalogPath + 'catalog.json'));
  let packages = json.packages;
  if (!fs.existsSync(distPath)){
    fs.mkdirSync(distPath);
  }

  for (var repo in packages) {
    // The plan: analyze and build docs for elements based on catalog.json
    let path = catalogPath + 'dist/' + repo;
    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }

    let repoName = repo;  // save this for later because loops.
    repos.push(path);     // save this for later to run bower on.

    // Step 1. Get the list of elements for the given package from catalog.json.
    let inputs = [].concat(packages[repo].elements);

    // ==========> Question: will our elements have any dependencies?

    // Step 2. bower install the element's dependencies.]
    // TODO: move this to its own task.
    // console.log('Running bower install in ' + path);
    // bower({cwd: path, verbosity: 1}).on('end', function() {
    // Step 3. Copy the element in its bower_components, so that
    // the demo works.
    // gulp.src(path + '/**').pipe(gulp.dest(`${path}/bower_components/${repoName}`));

    // Step 2. Run analyzer.
    let analyzerRoot = __dirname + '/web/' + repoName + '/';
    const analyzer = new Analyzer({
      urlLoader: new FSUrlLoader(analyzerRoot),
      urlResolver: new PackageUrlResolver(),
    });

    // Step 3. Check for inputs, generate an analysis, write that to a descriptor file and build a docs file.
    if (inputs == null || inputs.length === 0) {
      console.log('got nothing to analyze');
      // TODO: fall back to package analysis
    } else {
      analyzer.analyze(inputs).then(function(analysis) {
        // var blob = JSON.stringify(generateAnalysis(analysis, analyzerRoot));
        var blob = generateAnalysis(analysis, analyzerRoot);
        fs.writeJsonSync(path + '/descriptor.json', blob);

        let docsFile =
          `
          <!doctype html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
            <title>${repoName}</title>
            <link rel="import" href="../../../components/iron-ajax/iron-ajax.html">
            <link rel="import" href="../../../components/iron-doc-viewer/iron-doc-viewer.html">
            <link rel="import" href="../../../components/iron-doc-viewer/default-theme.html">
            <link rel="import" href="../../../components/polymer/lib/elements/custom-style.html">
            <link rel="import" href="../../../components/polymer/lib/elements/dom-bind.html">
            <script src="../../../components/webcomponentsjs/webcomponents-lite.js"></script>
            <custom-style>
              <style is="custom-style" include="iron-doc-default-theme"></style>
            </custom-style>
          </head>
          <body>
            <dom-bind>
              <template>
                <iron-ajax auto url="./descriptor.json" last-response="{{response}}" handle-as="json"></iron-ajax>
                <iron-doc-viewer descriptor="[[response]]"></iron-doc-viewer>
              </template>
            </dom-bind>
          </body>
          </html>
          `;
        fs.writeFileSync(path + '/docs.html', docsFile);
      }).catch(function(error) {
        console.log(error);
      });
    }
  }
});

gulp.task('polymer-build', function() {
  return run('polymer build').exec();
});

gulp.task('copy-dist-to-build', function() {
  gulp.src(__dirname + '/dist/**/*').pipe(gulp.dest(`${__dirname}/build/es6-bundled/dist/`));
});

gulp.task('default', function(done) {
  runSequence('clean', 'make-dist', 'polymer-build', 'copy-dist-to-build');
});

// Note: this assume your local 'dist' folder is ok (you've ran make-dist in the past)
gulp.task('debug', function(done) {
  runSequence('polymer-build', 'copy-dist-to-build');
});

gulp.task('test', function(done) {
  console.log('test');
})

gulp.task('lint-ns-forms', function() {
	return gulp.src(__dirname + '/web/ns-forms/**/index.html')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
})
