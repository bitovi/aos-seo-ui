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

NEXUS_REPO="http://store-nexusrepo.apple.com/nexus/service/local/artifact/maven/redirect?r=public"
NODE_MODULES_ARCHIVE=node-modules-shff-linux-x64
NODE_POM_VERSION=0.3-SNAPSHOT
POM_VERSION=2.3-SNAPSHOT

JAR_NAME=seo-ui.jar
MVN_ARTIFACT_NAME=seo-ui
MVN_VERSION=6.0-SNAPSHOT


function log {
    echo $1 >> $LOG_FILE 2>&1
    echo $1 1>&2
}

log "=-=-=-=-=-=Starting SEO-UI Build=-=-=-=-=-="
log "BUILD_DIR: $BUILD_DIR"
log "SRC_DIR: $SRC_DIR"

# Detect the platform
PLATFORM=$(uname)
if [[ "$PLATFORM" == 'Darwin' ]]; then
   PLATFORM=darwin
elif [[ "$PLATFORM" == 'Linux' ]]; then
   PLATFORM=linux
fi

# We don't trust the system to have nodejs in the correct version, we will download it
cd $BUILD_DIR
if [ ! -d nodejs ]; then
  log "Downloading node.js v0.10.35 from $NEXUS_REPO&g=com.apple.store.content&a=node-v0.10.35-$PLATFORM-x64&v=$NODE_POM_VERSION&p=zip"
  curl -L -o nodejs.zip "$NEXUS_REPO&g=com.apple.store.content&a=node-v0.10.35-$PLATFORM-x64&v=$NODE_POM_VERSION&p=zip
   unzip nodejs.zip >> $LOG_FILE
fi
if [ -f nodejs.zip ]; then
   rm nodejs.zip
fi

cd $SRC_DIR
# Check thenode_modules checksum.
# If the file exists but the check fails, remove the node_modules folder
# If the file does not exist, remove the node_modules folder
# If the check passes, do nothing. If node_modules exists, it will be used in this build
log "--Checking node_modules checksum--"
if [ -d node_modules ]; then
    if [ -f "$MD5_FILE" ]; then

        NEW_MODULE_MD5=$(find node_modules -type f -name "package.json" -exec md5sum {} + | awk '{print $1}' | sort | md5sum)
        OLD_MODULE_MD5=$(cat $MD5_FILE)

        if [ "$NEW_MODULE_MD5" = "$OLD_MODULE_MD5" ]; then
            log "checksum matches, using existing node_modules folder"
        else
            log "checksum does not match, removing node_modules folder"
            rm -rf $BUILD_DIR/node_modules
            rm -rf $SRC_DIR/node_modules
        fi
    else
        log "checksum file missing, removing node_modules folder"
        rm -rf $BUILD_DIR/node_modules
        rm -rf $SRC_DIR/node_modules
    fi
else
    log "node_modules folder is missing"
fi


# Download node_modules if it does not exist
cd $BUILD_DIR

if [ ! -d node_modules ]; then
    log "Downloading node_modules from $NEXUS_REPO&g=com.apple.store.content&a=$NODE_MODULES_ARCHIVE&v=$POM_VERSION&p=zip"
   curl -L -o node-modules-linux-x64.zip "$NEXUS_REPO&g=com.apple.store.content&a=$NODE_MODULES_ARCHIVE&v=$POM_VERSION&p=zip"
   unzip node-modules-linux-x64.zip >> $LOG_FILE
fi
if [ -f node-modules-linux-x64.zip ]; then
   rm node-modules-linux-x64.zip
fi

# Set up the paths
NODE_PATH="$BUILD_DIR/nodejs/bin"
MODULES_PATH=$BUILD_DIR/node_modules

NPM_BIN="$NODE_PATH/npm"
NODE_BIN="$NODE_PATH/node"
GULP_BIN="$MODULES_PATH/.bin/gulp"

#
# Environment setup - Node
#

chmod a+x $NODE_PATH/*
PATH=$NODE_PATH:$PATH
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
   if [[ "$PLATFORM" == 'darwin' ]]; then
      log "Calling npm install, node_modules is missing"
      $NPM_BIN --loglevel info install
   else
      log "Copying node_modules"
      cp -R $BUILD_DIR/node_modules $SRC_DIR/node_modules
   fi
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
curl -L "$NEXUS_REPO&g=com.apple.store.content&a=publishing-ui&v=develop-SNAPSHOT&p=tar.gz" | tar -xz

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

# Check for the task
if [ -z $GULP_TASK ]; then
    GULP_TASK=build:full:skip-tests
fi

# Run Gulp

#run tests separately because the production flag makes fixtures not work //TODO
log "Executing gulp test"
$GULP_BIN test

log "Executing gulp build, production"
export NODE_ENV='production'
$GULP_BIN $GULP_TASK

#
# Do some validations. All the target files we need
#

log "Verifying target files"

if [ ! -f $SRC_DIR/target/app.js ]; then
   log "app.js was not generated in the target folder. Exiting now."
   exit 11
fi
if [ ! -f $SRC_DIR/target/app.css ]; then
   log "app.css was not generated in the target folder. Exiting now."
   exit 12
fi
if [ ! -f $SRC_DIR/target/app.min.js ]; then
   log "app.min.js was not generated in the target folder. Exiting now."
   exit 13
fi
if [ ! -f $SRC_DIR/target/app.min.css ]; then
   log "app.min.css was not generated in the target folder. Exiting now."
   exit 14
fi
if [ ! -f $SRC_DIR/target/index.html ]; then
   log "index.html was not generated in the target folder. Exiting now."
   exit 15
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
cp $UI_BUILD_DST/index.html $JAR_SRC/index.html
cp $UI_BUILD_DST/index.production.html $JAR_SRC/index.production.html
cp $UI_BUILD_DST/app.css $JAR_SRC/app.css
cp $UI_BUILD_DST/app.min.css $JAR_SRC/app.min.css
cp $UI_BUILD_DST/app.js $JAR_SRC/app.js
cp $UI_BUILD_DST/app.min.js $JAR_SRC/app.min.js
cp $UI_BUILD_DST/bootstrap-theme.html $JAR_SRC/bootstrap-theme.html
cp $UI_BUILD_DST/route-list.json $JAR_SRC/route-list.json


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
  -DgeneratePom=false \
  -DgroupId=com.apple.store.content -DartifactId=$MVN_ARTIFACT_NAME -Dversion=$MVN_VERSION -Dpackaging=jar \
  -Durl=http://store-nexusrepo.apple.com/nexus/content/repositories/snapshots \
  -DrepositoryId=snapshots

#
# Cleanup
#

rm $JAR_NAME
rm -rf $JAR_SRC

log "=-=-=-=-=-=End SEO-UI Build=-=-=-=-=-="


exit 0
