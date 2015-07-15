#!/bin/bash

if [ "$INSTALL_BOWER" = "true" ]; then
 	node ./node_modules/bower/bin/bower install
fi