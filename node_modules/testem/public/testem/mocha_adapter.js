/*

mocha_adapter.js
================

Testem`s adapter for Mocha. It works by monkey-patching `Runner.prototype.emit`.

*/

function mochaAdapter(socket){

	var results = 
		{ failed: 0
	    , passed: 0
	    , total: 0
	    , tests: []
		}
	var id = 1
	var Runner
	
	try{
		Runner = mocha.Runner || Mocha.Runner
	}catch(e){
		console.error('Testem: failed to register adapter for mocha.')
	}

	function getFullName(test){
		var name = ''
		while (test){
			name = test.title + ' ' + name
			test = test.parent
		}
		return name.replace(/^ /, '')
	}

	var oEmit = Runner.prototype.emit
	Runner.prototype.emit = function(evt, test){
	 	if (evt === 'start'){
			emit('tests-start')
		}else if (evt === 'end'){
			emit('all-test-results', results)
		}else if (evt === 'test end'){
			var name = getFullName(test)
			if (test.state === 'passed'){
				var tst = 
					{ passed: 1
					, failed: 0
					, total: 1
					, id: id++
					, name: name
					, items: []
					}
				results.passed++
				results.total++
				results.tests.push(tst)
				emit('test-result', tst)
			}else if (test.state === 'failed'){
				var items = [
					{ passed: false
					, message: test.err.message
					, stacktrace: (test.err && test.err.stack) ? test.err.stack : undefined
					}
				]
				var tst = 
					{ passed: 0
					, failed: 1
					, total: 1
					, id: id++
					, name: name
					, items: items
					}
				results.failed++
				results.total++
				results.tests.push(tst)
				emit('test-result', tst)
			}
		}
		oEmit.apply(this, arguments)
	}

}

