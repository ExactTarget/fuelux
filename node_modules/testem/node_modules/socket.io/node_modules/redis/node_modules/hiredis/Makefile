all:
	cd deps/hiredis && $(MAKE) static
	node-waf configure build

clean:
	cd deps/hiredis && $(MAKE) clean
	rm -rf build

temp:
	rm -rf tmp/hiredis
	mkdir -p tmp/hiredis
	cp -r README *.{cc,h,js*} wscript Makefile deps test tmp/hiredis
	cd tmp/hiredis && rm -rf deps/*/.git* deps/*/*.o deps/hiredis/libhiredis.*

package: temp
	cd tmp && tar -czvf hiredis.tgz hiredis
