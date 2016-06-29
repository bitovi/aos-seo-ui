#!/bin/bash

# Detect the directory that the package is at
if [ ! -d "$BUILD_DIR" ]; then
	BUILD_DIR=$( cd "$( dirname "$0" )" && pwd )
	SRC_DIR=$(dirname "$BUILD_DIR")
fi

MVN_ARTIFACT_NAME=node-modules-shff-linux-x64
ZIP_FILE=$MVN_ARTIFACT_NAME.zip

MVN_GROUP_ID=com.apple.store.content
MVN_VERSION=2.3-SNAPSHOT

# This might be too aggressive, but is needed to make sure we have 100% correct modules

npm cache clean

#
# seo-ui
#

cd $SRC_DIR

if [ -d node_modules ]; then
	echo "Removing existing /node_modules"
	rm -rf node_modules
fi
if [ -f npm-shrinkwrap.json ]; then
	echo "Removing shrinkwrap"
	rm -rf npm-shrinkwrap.json
fi

# python26 is added because the box is CentOS 5.6 which does NOT have python26 as the defualt
echo "npm install on the module"
npm install --python=/usr/bin/python26
npm ls

#
# Build the zip file, and fly that to nexus
#

zip -r $ZIP_FILE node_modules/

#
# Fly the artifact to Nexus
#

# Check for the task. Used deploy:deploy-file for real deployment (setup in bamboo), else it will just do install
if [ -z $MVN_TASK ]; then
	MVN_TASK=deploy:deploy-file
fi

mvn $MVN_TASK -Dfile=$ZIP_FILE \
  -DgeneratePom=true \
  -DgroupId=$MVN_GROUP_ID -DartifactId=$MVN_ARTIFACT_NAME -Dversion=$MVN_VERSION -Dpackaging=zip \
  -Durl=http://store-nexusrepo.apple.com/nexus/content/repositories/snapshots \
  -DrepositoryId=snapshots
