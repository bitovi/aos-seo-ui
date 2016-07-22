#!/bin/bash

TAR_NAME=publishing-ui.tar.gz
BRANCH=$1
if [ -z $BRANCH ]; then
    BRANCH=develop
fi
MVN_VERSION=$BRANCH-SNAPSHOT

echo "=-=-=-=-=-= Updating PUI to latest from NEXUS =-=-=-=-=-="

echo ">> Downloading pui tarball from https://store-nexusrepo.apple.com/nexus/service/local/artifact/maven/redirect?r=public&g=com.apple.store.content&a=publishing-ui&v=$MVN_VERSION&p=tar.gz"

# curl -L -o $TAR_NAME "https://store-nexusrepo.apple.com/nexus/service/local/artifact/maven/redirect?r=public&g=com.apple.store.content&a=publishing-ui&v=$MVN_VERSION&p=tar.gz"

curl -L -o $TAR_NAME -u aos-readonly:KWcdKwLN8k9  "https://store-nexusrepo.apple.com/nexus/service/local/artifact/maven/redirect?r=public&g=com.apple.store.content&a=publishing-ui&v=$MVN_VERSION&p=tar.gz"

if [ ! -f $TAR_NAME ]; then
    echo "ERROR: Cannot find $TAR_NAME, aborting PUI update"
else
    npm install file:publishing-ui.tar.gz
fi

echo ">> Installing pui from tarball"

echo ">> Cleaning up pui tarball"

rm -f publishing-ui.tar.gz

echo "ƒin"
