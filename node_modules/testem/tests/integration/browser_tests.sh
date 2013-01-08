./testem.js launchers
cd examples
for dir in $(ls)
do
	echo "Testing $dir..."
	cd $dir
	../../testem.js ci | pcregrep -M "# tests ([0-9]+)\n# (pass|fail)  ([0-9]+)"
	cd ..
done
cd ..