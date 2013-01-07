/*

customAdapter.js
================

A example custom test framework adapter for Testem. By doing something
similar, you can use any test framework with Testem.

This simple test framework provides just the functions `test` and `assert`
and has the following syntax:

    test('say hello', function() {
        assert(hello() === 'hello world', 'should equal hello world')
    })

    test('test something else', function(){
        assert('something else', 'should be something else')
    })

*/

// The interface for an adapter is simply a function that takes
// a [Socket.IO](http://socket.io/) socket. When test events
// `tests-start`, `test-result`, `all-test-results` come in,
// the adapter is responsible for sending these events to the socket.
function customTestFrameworkAdapter(socket) {

    // Store all the tests in an array for simplicity of running.
    var tests = []
    
    var started = false
    window.test = function test(name, fn){
        tests.push([name, fn])
        // assume all tests are added synchronously
        // so after the setTimeout, we should have all the
        // tests we have to run available in `tests` variable.
        if (!started){
            setTimeout(runTests, 1)
            started = true
        }
    }

    // simple assert function
    window.assert = function assert(bool, message) {
        if (!bool) {
            throw new Error(message)
        }
    }

    function runTests(){
        var results = {  // Summary of all test results
            failed: 0
            , passed: 0
            , total: 0
            , tests: []
        }
        var id = 1 // A counter that IDs each test

        // Send `tests-start` to indicate to the Testem UI
        // that tests have started running.
        socket.emit("tests-start")

        // Loop through the tests and run them
        for (var i = 0, numTests = tests.length; i < numTests; i++){
            var test = tests[i]
              , name = test[0] // test name
              , fn = test[1]   // test function
              , passed = false
            var result = {     // the result object to report for this test
                passed: 0
                , failed: 0
                , total: 1
                , id: id++
                , name: name
                , items: []
            }

            try {
                fn()           // run it!
                passed = true  // we passed!
            } catch (err) {
                // On failure, we want to recored the
                // error message and, if available - the stacktrace
                // and add to `result.items` to be reported back
                result.items.push({
                    passed: false
                    , message: err.message
                    , stacktrace: err.stack ? err.stack : undefined
                })
            }

            // update the passed and failed count for this test
            // and the overall summary
            if (passed) {
                results.passed++
                result.passed++
            } else {
                results.failed++
                result.failed++
            }

            // Now actually report back this test result
            socket.emit("test-result", result)
            
            // update the total tally and add to the collection of
            // overall results
            results.total++
            results.tests.push(result)
        }

        // Report back all test results and the fact that
        // we are done running them.
        socket.emit("all-test-results", results)
    }
    

}

// Tell Testem to use your adapter
Testem.useCustomAdapter(customTestFrameworkAdapter)