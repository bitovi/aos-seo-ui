#!/bin/bash

PUI_FOLDER=$1
NPM_VERSION=$(npm -v)
NPM_MAJOR_VERSION=$(npm -v | cut -c 1)

if [ "$NPM_MAJOR_VERSION" -lt "2" ]; then
    echo "Script requires npm 2.x '$NPM_VERSION' found, aborting local install"
    echo "Use 'sudo npm install -g npm' to upgrade to latest stable version and try again."
    exit 1
fi

if [ -z $PUI_FOLDER ]; then
    PUI_FOLDER="../publishing-ui"
fi

echo ">> Installing PUI from '$PUI_FOLDER'"

if [ ! -d "$PUI_FOLDER" ]; then
    echo "Cannot find folder '$PUI_FOLDER', aborting local install"
    exit 2
fi

npm install file:$PUI_FOLDER

cd "node_modules/pui"

echo ">> Creating symlinks"

rm -rf dist
rm -rf src
rm package.json

ln -s ../../$PUI_FOLDER/dist dist
ln -s ../../$PUI_FOLDER/src src
ln ../../$PUI_FOLDER/package.json package.json

echo "ƒin"
exit 0
