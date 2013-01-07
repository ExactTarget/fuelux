if(window.QUnit){
	steal('funcunit/browser/adapters/qunit.js')
}
else if (window.jasmine){
	steal('funcunit/browser/adapters/jasmine.js')
}