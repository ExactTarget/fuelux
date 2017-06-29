// package metadata file for Meteor.js

/* jshint strict:false */
/* global Package:true */

Package.describe({
  name: 'exacttarget:fuelux',  // http://atmospherejs.com/exacttarget/fuelux
  summary: 'Base Fuel UX styles and controls',
  version: '3.16.1',
  git: 'https://github.com/ExactTarget/fuelux.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.use('jquery', 'client');
  api.addFiles([
    'dist/fonts/fuelux.eot',
    'dist/fonts/fuelux.svg',
    'dist/fonts/fuelux.ttf',
    'dist/fonts/fuelux.woff'
  ], 'client', { isAsset: true });
  api.addFiles([
    'dist/css/fuelux.css',
    'dist/js/fuelux.js'
  ], 'client');
});
