const gulp = require('gulp');
const zip = require('gulp-zip');
const rimraf = require('rimraf');
const replace = require('gulp-replace');
const {version} = require('./package.json');
const exec = require('child_process').exec;
const needle = require('needle');
const fs = require('fs');
const cryptojs = require('crypto-js');

require('dotenv').config();

function generateOption(method, contentMD5, contentType, resourceURL) {
  const date = new Date().toUTCString();
  const stringToSign = [
    method, contentMD5, contentType, date, resourceURL].join('\n');
  const hash = cryptojs.HmacSHA256(stringToSign, process.env.SECRET_KEY);
  const auth = `FS ${process.env.DEVELOPER_ID}:${process.env.PUBLIC_KEY}:${Buffer.from(hash.toString()).
      toString('base64url')}`;
  const options = {
    headers: {
      'Content-MD5': contentMD5, Date: date, Authorization: auth,
    },
  };
  return options;
}

function clean(cb) {
  rimraf('dist/', {}, function(err) {
    cb(err);
  });
  rimraf('build/', {}, function(err) {
    cb(err);
  });
  rimraf('tmp/', {}, function(err) {
    cb(err);
  });
  rimraf('svn/trunk/', {}, function(err) {
    cb(err);
  });
}

function cleanUp(cb) {
  rimraf('tmp/', {}, function(err) {
    cb(err);
  });
}

function copyToTrunk() {
  return gulp.src(['./tmp/**']).pipe(gulp.dest('svn/trunk'));
}

function createZip() {
  return gulp.src(['./tmp/**']).pipe(zip('sfv.zip', {compress: false})).pipe(gulp.dest('dist'));
}

function copy() {
  return gulp.src([
    './**',
    '!./sfv.php',
    '!./README.txt',
    '!./package.json',
    '!./package-lock.json',
    '!./.gitignore',
    '!./.env',
    '!./svn/**',
    '!./.git/**',
    '!./.github/**',
    '!./node_modules/**',
    '!./src/**',
    '!./dist/**',
    '!./tmp/**',
    '!./docs/**',
    '!./gulpfile.js',
    '!./.gitignore']).pipe(gulp.dest('tmp'));
}

function replaceVersion() {
  return gulp.src(['sfv.php', 'README.txt']).pipe(replace(/{{version}}/g, `${version}`)).pipe(gulp.dest('tmp'));
}

function js(cb) {
  exec('wp-scripts build', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

// deploy to freemius
async function upload() {
  const resourceURL = `/v1/developers/${process.env.DEVELOPER_ID}/plugins/${process.env.PLUGIN_ID}/tags.json`;
  const boundary = `----${new Date().getTime().toString(16)}`;
  const buffer = fs.readFileSync('./dist/sfv.zip');
  const data = {
    add_contributor: false, file: {
      buffer: buffer, filename: 'sfv.zip', content_type: 'application/zip',
    },
  };
  const options = {
    multipart: true, boundary: boundary, ...generateOption('POST', '', `multipart/form-data; boundary=${boundary}`,
        resourceURL),
  };

  await needle('POST', `https://api.freemius.com${resourceURL}`, data, options).then((response) => {
    if (response.body.error) {
      console.log('Failed to deploy to Freemius.');
      console.log(response.error.message);
    } else {
      console.log(`Successfully deployed v${response.body.version} to Freemius.`);
    }
  }).catch(() => {
    console.log('Failed to deploy to Freemius.');
  });
}

exports.deploy = gulp.series(clean, js, copy, replaceVersion, createZip, upload, cleanUp);

exports.build = gulp.series(clean, js, copy, replaceVersion, createZip, cleanUp);

exports.clean = clean;
