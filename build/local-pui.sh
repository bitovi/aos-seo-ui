#!/bin/bash

PUI_FOLDER=$1

NODE_VERSION=$(node -v)
NODE_MAJOR_VERSION=$(node -v | cut -c 2)
NODE_TARGET_VERSION=6

NPM_VERSION=$(npm -v)
NPM_MAJOR_VERSION=$(npm -v | cut -c 1)
NPM_TARGET_VERSION=3

if [ "$NPM_MAJOR_VERSION" -lt "$NPM_TARGET_VERSION" ]; then
    echo "Script requires npm $NPM_TARGET_VERSION.x or later. $NPM_VERSION found. Aborting local install."
    echo "Use 'sudo npm install -g npm' to upgrade to latest stable version and try again."
    exit 1
fi

if [ "$NODE_MAJOR_VERSION" -lt "$NODE_TARGET_VERSION" ]; then
    echo "WARNING: This script has been tested with Node $NODE_TARGET_VERSION.x and later. You are running $NODE_VERSION."
    echo "     If you run into problems, try the following:"
    echo "     Install nvm: 'curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash'"
    echo "     Activate nvm from shell: '. ~/.nvm/nvm.sh'"
    echo "     Install node v[version number]: 'nvm install [version number]'"
    echo "     In any new shell, use the installed version: 'nvm use [version number]'"
    echo "     Or if you prefer, set it as the default version: 'nvm alias default [version number]'"
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

cd "node_modules/@apple/pui"

echo ">> Creating symlinks"

rm -rf dist
rm -rf src
rm package.json

ln -s ../../../$PUI_FOLDER/dist dist
ln -s ../../../$PUI_FOLDER/src src
ln ../../../$PUI_FOLDER/package.json package.json

echo "ƒin"
exit 0
