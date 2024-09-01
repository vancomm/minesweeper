#!/bin/sh

if [ -e .env.production ]; then
    . ./.env.production
fi

if [ -e .env.production.local ]; then
    . ./.env.production.local
fi

if [ -z "${OUT_DIR+x}" ] \
    || [ -z "${DEPLOY_HOST+x}" ] \
    || [ -z "${DEPLOY_LOCATION+x}" ] \
    ; then
    echo "deploy params unset"
    exit 1
fi

rsync -avz "${OUT_DIR%%/}/" "$DEPLOY_HOST":"$DEPLOY_LOCATION"