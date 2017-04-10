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
JAR_NAME=seo-ui.jar
MVN_ARTIFACT_NAME=seo-ui
MVN_VERSION=3.1.1-SNAPSHOT

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
  echo This script is meant to be used on the Linux boxes, and does not work on Mac
#  exit 1
fi

# Set up the paths
export NODE_PATH="${WORKSPACE}/node_modules"
GULP_BIN="$NODE_PATH/.bin/gulp"

log "--Node Environment Variables--"
log "NODE_PATH: $NODE_PATH"
log "GULP_BIN: $GULP_BIN"
log "PATH: $PATH"

#
# Clean up
#

if [ -f "$LOG_FILE" ]; then
   rm $LOG_FILE
fi


##
# Regular build process
##

# Disable notifications from gulp since we are headless
export DISABLE_NOTIFIER=true

# Run tests separately because the production flag makes fixtures not work //TODO
if [ "$RUN_TESTS" = true ]; then
  log "Executing gulp test"
  $GULP_BIN test
  RETVAL=$?
  if [ "$RETVAL" != "0" ]; then
    echo Gulp returned error. Cancelling the process now
    exit 2
  fi
else
  log "WARNING: SKIPPING TEST RUN!"
fi


log "Executing gulp build, production"
export NODE_ENV='production'
$GULP_BIN build:skip
RETVAL=$?
if [ "$RETVAL" != "0" ]; then
  echo Gulp returned error. Cancelling the process now
  exit 2
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

cp $UI_BUILD_DST/seo-ui/app.css $JAR_SRC/app.css
cp $UI_BUILD_DST/seo-ui/app.css $JAR_SRC/app.min.css
cp $UI_BUILD_DST/seo-ui/app.js $JAR_SRC/app.js
cp $UI_BUILD_DST/seo-ui/app.js $JAR_SRC/app.min.js
cp $UI_BUILD_DST/index.production.html $JAR_SRC/index.production.html
cp $UI_BUILD_DST/index.production.html $JAR_SRC/index.html
cp $UI_BUILD_DST/route-list.json $JAR_SRC/route-list.json

#
# Create the jar file that will be finally deployed
#

cd $SRC_DIR
jar -cf $JAR_NAME -C target-production/ .

# Check for the task. Used deploy:deploy-file for real deployment, else it will just do install
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

log "=-=-=-=-=-=End SEO-UI Build=-=-=-=-=-="

exit 0
