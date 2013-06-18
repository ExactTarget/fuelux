TEST_DIR = test/common test/unit test/local test/saucelabs test/ghostdriver

DEFAULT:
	@echo
	@echo '  make test -> run the unit and  local tests (start selenium with chromedriver first).'
	@echo '  make test_unit -> run the unit tests'
	@echo '  make test_local -> run the local tests (start selenium with chromedriver first).'
	@echo '  make test_saucelabs -> run the saucelabs tests (configure username/access_key first).'
	@echo '  make test_ghostdriver -> run the ghostdriver tests (start ghostdriver first).'
	@echo '  make test_coverage -> generate test coverage (install jscoverage first).'
	@echo '  mapping -> build the mapping (implemented only).'  
	@echo '  full_mapping -> build the mapping (full).'  
	@echo

# run unit and local tests, start selenium server first
test:
	./node_modules/.bin/mocha \
	test/unit/*-test.js \
	test/local/*-test.js

# run unit tests
test_unit:
	./node_modules/.bin/mocha test/unit/*-test.js

# run local tests, start selenium server first
test_local:
	./node_modules/.bin/mocha test/local/*-test.js

# run saucelabs test, configure username/key first
test_saucelabs:
ifdef ($(TRAVIS))
	# run saucelabs test if this is not a pull request
	ifneq ($(TRAVIS_PULL_REQUEST),false)
		@echo 'Skipping Sauce Labs tests as this is a pull request'
	else
		./node_modules/.bin/mocha test/saucelabs/*-test.js
	endif
else
	./node_modules/.bin/mocha test/saucelabs/*-test.js
endif

# run ghostdriver test, start ghostdriver first
test_ghostdriver:
	./node_modules/.bin/mocha test/ghostdriver/*-test.js

# run test coverage, install jscoverage first
test_coverage:
	rm -rf lib-cov
	jscoverage --no-highlight lib lib-cov --exclude=bin.js
	WD_COV=1 ./node_modules/.bin/mocha --reporter html-cov \
	test/unit/*-test.js \
	test/local/*-test.js \
	test/saucelabs/*-test.js \
  > coverage.html

_dox:
	@mkdir -p tmp
	@./node_modules/.bin/dox -r < lib/webdriver.js > tmp/webdriver-dox.json
	@./node_modules/.bin/dox -r < lib/element.js > tmp/element-dox.json

# build the mapping (implemented only)
mapping: _dox
	@node doc/mapping-builder.js

# build the mapping (full)
full_mapping: _dox
	@node doc/mapping-builder.js full

.PHONY: \
	test \
	DEFAULT \
	test_unit \
	test_local \
	test_saucelabs \
	test_coverage \
	test_ghostdriver \
	build_mapping \
	build_full_mapping \
	_dox
