/* global describe:false, it:false, before:false, after:false */

/* mocha tests for Niffy go here */
// var express = require('express');
// var exphbs  = require('express-handlebars');
// var path = require('path');

var server = require('./regression/server.js');
var $ = require( 'jquery' );

// var should = require('chai').should();
var Niffy = require('niffy');

var EIGHT_PIXELS = 0.00102;

describe('Fuel UX 3', function testFuelUX3 () {
	var basehost = 'http://localhost:8000';
	var testhost = 'http://localhost:8013';
	var niffy;
	var devServer;
	var refServer;

	before(function instantiateNiffy () {
		devServer = server.getServer(8000);
		refServer = server.getServer(8013);
		niffy = new Niffy(basehost, testhost, { show: true, threshold: EIGHT_PIXELS });
	});
	after(function* stopAll () {
		devServer.close();
		refServer.close();
		yield niffy.end();
	});

	var components = [
		'checkbox',
		'combobox',
		'datepicker',
		// 'loader', // Because it is animated, loader is consistently ~0.0046% different, and therefore cannot be reliably tested with the current setup
		'pillbox',
		'placard',
		'radio',
		'repeater',
		'scheduler',
		'search',
		'selectlist',
		'spinbox',
		'tree', // Tree won't work until https://github.com/ExactTarget/fuelux/pull/2000 is merged and npm installed into this project
		'wizard'
	];

	components.forEach(function describeTest (component) {
		describe(component, function testComponent () {
			it('correctly renders', function* executeTest () {
				yield niffy.test('/component/' + component);
			});
		});
	});

	describe('datepicker', function describeDatepickerTest () {
		it('responds to interaction', function* interactWithDatepicker () {
			yield niffy.test('/component/datepicker', function* clickOnDatepicker (nightmare) {
				yield nightmare.click('#myDatepicker button');
			});
		});
	});

	describe('combobox', function describeComboboxTest () {
		it('responds to interaction', function* interactWithCombobox () {
			yield niffy.test('/component/combobox', function* clickOnCombobox (nightmare) {
				yield nightmare.click('#myCombobox button');
			});
		});
	});

	describe('placard', function describePlacardTest () {
		it('responds to interaction', function* interactWithPlacard () {
			yield niffy.test('/component/placard', function* runNightmareTest (nightmare) {
				yield nightmare.evaluate(function showPlacard () {
					return $('#myPlacard').placard('show');
				});
			});
		});
	});

	describe('selectlist', function describeSelectlistTest () {
		it('responds to interaction', function* interactWithSelectlist () {
			yield niffy.test('/component/selectlist', function* clickOnSelectlist (nightmare) {
				yield nightmare.click('#mySelectlist button');
			});
		});
	});

	describe('repeater', function describeRepeaterTest () {
		it('allows single select', function* interactWithRepeater () {
			yield niffy.test('/component/repeater-single', function* clickInRepeater (nightmare) {
				yield nightmare.click('#row1').click('#row2');
			});
		});
	});

	describe('repeater', function describeRepeaterTest () {
		it('allows multi select', function* interactWithRepeater () {
			yield niffy.test('/component/repeater-multi', function* runNightmareTest (nightmare) {
				yield nightmare.evaluate(function clickInRepeater () {
					$($('#myRepeaterMulti tr')[14]).click();
					return $($('#myRepeaterMulti tr')[13]).click();
				});
			});
		});
	});
});
