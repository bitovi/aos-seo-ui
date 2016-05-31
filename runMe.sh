#!/bin/bash

NPM=$(which npm)
if [ -z $NPM ]; then
	echo "You do not seem to have nodejs installed. Please download and install it !!! Make sure it's in your PATH"
	exit 1
fi

echo "Wait, installing modules"
if [ ! -d node_modules ]; then
	$NPM install
fi

GULP=$(which gulp)
if [ -z $GULP ]; then
	echo "You do not seem to have gulp. Do: sudo npm install --global gulp"
	exit 2
fi

echo "Runing gulp watch:app now"
$GULP watch:app