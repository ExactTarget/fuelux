Package.describe({
  name: 'exacttarget:fuelux',
  version: '3.7.1',
  summary: 'fuelux as a meteor package!',
  git: 'https://github.com/ExactTarget/fuelux',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.0.1');
    api.use('jquery', 'client');

    api.add_files(['dist/js/fuelux.js'], 'client');
}); 