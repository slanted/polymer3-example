'use strict';

const del = require('del');
const fs = require('fs-extra');
const gulp = require('gulp');
const runSequence = require('run-sequence');
let run = require('gulp-run');

// Analyzer stuff.
const {Analyzer, generateAnalysis} = require('polymer-analyzer');
const FSUrlLoader = require('polymer-analyzer/lib/url-loader/fs-url-loader').FSUrlLoader;
const PackageUrlResolver = require('polymer-analyzer/lib/url-loader/package-url-resolver').PackageUrlResolver;

// Paths to the app directories
let packagesDir = __dirname + '/packages/';
let descriptorsDir = __dirname + '/packages/dist/descriptors';

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

gulp.task('clean', function() {
    return del([catalogPath + '/dist']);
});

let pkgs = [];

gulp.task('make-dist', function() {
  // Copy catalog.json to the dist folder for later use
  fs.copySync('catalog.json', 'packages/dist/catalog.json');
  // Get the packages info
  let json = JSON.parse(fs.readFileSync('catalog.json'));
  let packages = json.packages;

  for (var pkg in packages) {
    // The plan: analyze and build docs for elements based on catalog.json
    let path = packagesDir + packages[pkg].directory + '/src/';

    let pkgName = packages[pkg].directory;  // save this for later because loops.
    pkgs.push(path);     // save this for later to run bower on.

    // Step 1. Get the list of elements for the given package from catalog.json.
    let inputs = packages[pkg].elements.map(el => el + '/' + el + '.js');

    // Step 2. Run analyzer.
    let analyzerRoot = packagesDir + pkgName + '/src/';
    const analyzer = new Analyzer({
      urlLoader: new FSUrlLoader(analyzerRoot),
      urlResolver: new PackageUrlResolver(),
    });

    // Step 3. Check for inputs, generate an analysis, write that to a descriptor file and build a docs file.
    if (inputs == null || inputs.length === 0) {
      console.log('got nothing to analyze', analyzerRoot);
      // TODO: fall back to package analysis
    } else {
      analyzer.analyze(inputs).then(function(analysis) {
        // var blob = JSON.stringify(generateAnalysis(analysis, analyzerRoot));
        var blob = generateAnalysis(analysis, analyzerRoot);
        if (!fs.existsSync(descriptorsDir)){
          fs.mkdirSync(descriptorsDir);
        }
        fs.writeJsonSync(descriptorsDir + '/' + path.split('/')[8]  + '-descriptor.json', blob);
        let elements = blob.elements;
        for (const index in elements) {
          if (elements.hasOwnProperty(index)) {
            const element = elements[index];
            fs.writeJsonSync(descriptorsDir + '/' + element.tagname + '-descriptor.json', element);
            let docsHTML =
`
<custom-style>
  <style is="custom-style" include="iron-doc-default-theme"></style>
</custom-style>
<iron-ajax auto url="./descriptors/${element.tagname}-descriptor.json" last-response="{{response}}" handle-as="json"></iron-ajax>
<iron-doc-viewer descriptor="[[response]]"></iron-doc-viewer>
`;
                        fs.writeFileSync(path + element.tagname + '/docs.html', docsHTML);

                        let docsJS =
                            `
import {Element} from 'Polymer/polymer/polymer-element.js';
import 'Polymer/iron-ajax/iron-ajax.js';
import 'Polymer/iron-doc-viewer/iron-doc-viewer.js';
import 'Polymer/iron-doc-viewer/default-theme.js';
import 'Polymer/polymer/lib/elements/custom-style.js';
import 'Polymer/polymer/lib/elements/dom-if.js';

import template from './docs.html';

export class ${element.name}Doc extends Element {

  static get properties() {
    return {
      foo: {
        type: String,
        value: '',
        notify: false
      }
    };
  }

  static get template() {
    return template;
  }

  constructor() {
    super()
  }

  ready() {
    super.ready();
  }

  elementMethod() {
    console.log('Log something: ')
  }

}
customElements.define('${element.tagname}-doc', ${element.name}Doc);
`;
                        fs.writeFileSync(path + element.tagname + '/docs.js', docsJS);
                    }
                }
                // fs.writeJsonSync(path + '/descriptor.json', blob);

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