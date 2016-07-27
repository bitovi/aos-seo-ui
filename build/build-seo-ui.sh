#!/bin/bash

#
# This script is responsible for building the jar file that is used in the production servers
# Anything in that jar file is what the servers have "access" to, anything not in them turns out to be out of scope
#

# If the build dir is not shared, we will use the build/ directory for temporary files
if [ ! -d "$BUILD_DIR" ]; then
   BUILD_DIR=$( cd "$( dirname "$0" )" && pwd )
fi

SRC_DIR=$(dirname "$BUILD_DIR")
LOG_FILE=$BUILD_DIR/build.log
MD5_FILE=$BUILD_DIR/node_modules.md5

NEXUS_REPO="https://store-nexusrepo.apple.com/nexus/service/local/artifact/maven/redirect?r=public"
NODE_MODULES_ARCHIVE=node-modules-shff-linux-x64
POM_VERSION=2016.7-july-SNAPSHOT

JAR_NAME=seo-ui.jar
MVN_ARTIFACT_NAME=seo-ui
MVN_VERSION=1.0-SNAPSHOT

function log {
    echo $1 >> $LOG_FILE 2>&1
    echo $1 1>&2
}

log "=-=-=-=-=-=Starting Seo-UI Build=-=-=-=-=-="
log "BUILD_DIR: $BUILD_DIR"
log "SRC_DIR: $SRC_DIR"

# Detect the platform
PLATFORM=$(uname)
if [[ "$PLATFORM" == 'Darwin' ]]; then
  echo This script is meant to be used on the Linux boxes, and does not work on Mac
#  exit 1
fi

cd $SRC_DIR
# Check thenode_modules checksum.
# If the file exists but the check fails, remove the node_modules folder
# If the file does not exist, remove the node_modules folder
# If the check passes, do nothing. If node_modules exists, it will be used in this build
log "Removing node_modules folder"
rm -rf $BUILD_DIR/node_modules
rm -rf $SRC_DIR/node_modules

# Download node_modules if it does not exist
cd $BUILD_DIR
if [ ! -d node_modules ]; then
    log "Downloading node_modules from $NEXUS_REPO&g=com.apple.store.content&a=$NODE_MODULES_ARCHIVE&v=$POM_VERSION&p=zip"
   curl -L -o node-modules-linux-x64.zip -u aos-readonly:KWcdKwLN8k9 "$NEXUS_REPO&g=com.apple.store.content&a=$NODE_MODULES_ARCHIVE&v=$POM_VERSION&p=zip"
   if [ ! -f node-modules-linux-x64.zip ]; then
     echo "Could not download node-modules-linux-x64.zip"
     exit 1
   fi
   echo "Unzipping node-modules for the seo build"
   unzip node-modules-linux-x64.zip >> $LOG_FILE
fi
if [ -f node-modules-linux-x64.zip ]; then
   rm node-modules-linux-x64.zip
fi

# Set up the paths
NODE_PATH="${BUILD_DIR}/nodejs/bin"
MODULES_PATH=$BUILD_DIR/node_modules

NPM_BIN="$NODE_PATH/npm"
NODE_BIN="$NODE_PATH/node"
GULP_BIN="$MODULES_PATH/.bin/gulp"

#
# Environment setup - Node
#

chmod a+x ${NODE_PATH}/*
PATH=${NODE_PATH}:${PATH}
export PATH

log "--Node Environment Variables--"
log "NODE_PATH: $NODE_PATH"
log "MODULES_PATH: $MODULES_PATH"
log "NODE_BIN: $NODE_BIN"
log "GULP_BIN: $GULP_BIN"
log "PATH: $PATH"

#
# Clean up
#

if [ -f "$LOG_FILE" ]; then
   rm $LOG_FILE
fi

##
# Copying the cached modules. Note: A symlink does not work
##

cd $SRC_DIR
if [ ! -d $SRC_DIR/node_modules ]; then
  log "Copying node_modules"
  cp -R $BUILD_DIR/node_modules $SRC_DIR/node_modules
else
   log "node_modules was found. Leaving it alone."
fi

#
# Environment setup - Gulp. Recreate the symlinks
#

rm -f $MODULES_PATH/.bin/browserify
rm -f $MODULES_PATH/.bin/browser-sync
rm -f $MODULES_PATH/.bin/documentjs
rm -f $MODULES_PATH/.bin/gulp
rm -f $MODULES_PATH/.bin/watchify

ln -s -f $MODULES_PATH/browserify/bin/cmd.js $MODULES_PATH/.bin/browserify
ln -s -f $MODULES_PATH/browser-sync/index.js $MODULES_PATH/.bin/browser-sync
ln -s -f $MODULES_PATH/documentjs/bin/documentjs $MODULES_PATH/.bin/documentjs
ln -s -f $MODULES_PATH/gulp/bin/gulp.js $MODULES_PATH/.bin/gulp
ln -s -f $MODULES_PATH/watchify/bin/cmd.js $MODULES_PATH/.bin/watchify

chmod a+x $MODULES_PATH/.bin/*

#
# We need to copy the latest pui into node_modules
#
log "Updating PUI from NEXUS"

TAR_NAME=publishing-ui-.tar.gz

cd $BUILD_DIR
curl -L -u aos-readonly:KWcdKwLN8k9 "$NEXUS_REPO&g=com.apple.store.content&a=publishing-ui&v=develop-SNAPSHOT&p=tar.gz" | tar -xz

if [ -d $SRC_DIR/node_modules/pui ]; then
    rm -rf $SRC_DIR/node_modules/pui/dist
    rm -rf $SRC_DIR/node_modules/pui/src
    rm $SRC_DIR/node_modules/pui/package.json
fi

cp -R $BUILD_DIR/package/dist $SRC_DIR/node_modules/pui/dist
cp -R $BUILD_DIR/package/src $SRC_DIR/node_modules/pui/src
cp $BUILD_DIR/package/package.json $SRC_DIR/node_modules/pui/package.json

##
# Regular build process
##

# Disable notifications from gulp since we are headless
export DISABLE_NOTIFIER=true

# Run tests separately because the production flag makes fixtures not work //TODO
log "Executing gulp test"
$GULP_BIN test
RETVAL=$?
if [ "$RETVAL" != "0" ]; then
  echo Gulp returned error. Cancelling the process now
fi

log "Executing gulp build, production"
export NODE_ENV='production'
$GULP_BIN build:full:skip-tests
RETVAL=$?
if [ "$RETVAL" != "0" ]; then
  echo Gulp returned error. Cancelling the process now
fi

#
# Do some validations. All the target files we need
#

log "Verifying target files"

if [ ! -f $SRC_DIR/target/seo-ui/app.js ]; then
   log "app.js was not generated in the target folder. Exiting now."
   exit 11
fi
if [ ! -f $SRC_DIR/target/seo-ui/app.css ]; then
   log "app.css was not generated in the target folder. Exiting now."
   exit 12
fi
if [ ! -f $SRC_DIR/target/index.production.html ]; then
   log "index.html.production was not generated in the target folder. Exiting now."
   exit 16
fi
if [ ! -f $SRC_DIR/target/route-list.json ]; then
   log "route-list.json was not generated in the target folder. Exiting now."
   exit 17
fi

#
# Copy the /target files to the /target-production
#

UI_BUILD_DST=$SRC_DIR/target
JAR_SRC=$SRC_DIR/target-production

mkdir -p $JAR_SRC

cp $UI_BUILD_DST/seo-ui/index.production.html $JAR_SRC/index.production.html
cp $UI_BUILD_DST/seo-ui/app.css $JAR_SRC/app.css
cp $UI_BUILD_DST/seo-ui/app.min.css $JAR_SRC/app.min.css
cp $UI_BUILD_DST/seo-ui/app.js $JAR_SRC/app.js
cp $UI_BUILD_DST/seo-ui/app.min.js $JAR_SRC/app.min.js
cp $UI_BUILD_DST/seo-ui/route-list.json $JAR_SRC/route-list.json

#
# Create the jar file that will be finally deployed
#

cd $SRC_DIR
jar -cf $JAR_NAME -C target-production/ .

# Check for the task. Used deploy:deploy-file for real deployment (setup in bamboo), else it will just do install
if [ -z $MVN_TASK ]; then
   MVN_TASK="install:install-file"
fi

mvn $MVN_TASK -Dfile=$JAR_NAME \
  -DgeneratePom=true \
  -DgroupId=com.apple.store.content -DartifactId=$MVN_ARTIFACT_NAME -Dversion=$MVN_VERSION -Dpackaging=jar \
  -Durl=https://store-nexusrepo.apple.com/nexus/content/repositories/snapshots \
  -DrepositoryId=snapshots

#
# Cleanup
#

rm $JAR_NAME
rm -rf $JAR_SRC

log "=-=-=-=-=-=End Seo-UI Build=-=-=-=-=-="

exit 0
