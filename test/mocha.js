/* global describe:false, it:false, before:false, after:false */

/* mocha tests for Niffy go here */
// var express = require('express');
// var exphbs  = require('express-handlebars');
// var path = require('path');

var server = require('./regression/server.js');

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

	describe('Components', function testComponents () {
		/**
		 * Top level.
		 */
		it('/checkbox', function* testCheckbox () {
			yield niffy.test('/checkbox');
		});
	});
});
